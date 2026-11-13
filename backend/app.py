import os, json, io, jwt
from datetime import datetime, timedelta
from functools import wraps
from pathlib import Path
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from docx import Document
from config import Config
from extensions import db
from models import User, Analysis
from ml_engine.service import extract_skills,predict_role,match_jobs,career_cluster,recommend_projects,roadmap
from llm_adapter import ask_local_llm
load_dotenv(Path(__file__).resolve().parent/'.env')
BASE=Path(__file__).resolve().parent
def create_app(test_config=None):
 app=Flask(__name__); app.config.from_object(Config)
 if test_config: app.config.update(test_config)
 CORS(app,origins=os.getenv('FRONTEND_ORIGIN','http://localhost:5173').split(',')); db.init_app(app)
 with app.app_context(): db.create_all()
 def token_required(fn):
  @wraps(fn)
  def wrapped(*args,**kwargs):
   token=request.headers.get('Authorization','').replace('Bearer ','').strip()
   try:g.user=User.query.get(int(jwt.decode(token,app.config['SECRET_KEY'],algorithms=['HS256'])['sub']))
   except Exception:return jsonify({'message':'Authentication required'}),401
   if not g.user:return jsonify({'message':'User not found'}),401
   return fn(*args,**kwargs)
  return wrapped
 def read_resume(file):
  name=(file.filename or '').lower(); raw=file.read(); file.stream.seek(0)
  if name.endswith('.pdf'): text='\n'.join(p.extract_text() or '' for p in PdfReader(io.BytesIO(raw)).pages)
  elif name.endswith('.docx'): text='\n'.join(p.text for p in Document(io.BytesIO(raw)).paragraphs)
  elif name.endswith('.txt'): text=raw.decode('utf-8',errors='ignore')
  else: raise ValueError('Upload PDF, DOCX or TXT files only')
  if len(text.strip())<40: raise ValueError('Could not extract enough text. Try a text-based PDF or DOCX.')
  return text
 def jobs(): return json.loads((BASE/'ml_engine/data/jobs.json').read_text())
 @app.get('/api/health')
 def health():
  try:
   db.session.execute(db.text('SELECT 1')); database='connected'
  except Exception:
   database='unavailable'
  return jsonify({'status':'ok','service':'AVORA AI API','ml_artifacts':(BASE/'ml_engine/artifacts/role_classifier.joblib').exists(),'database':database,'optional_local_llm':bool(os.getenv('LOCAL_LLM_BASE_URL'))})
 @app.post('/api/auth/signup')
 def signup():
  d=request.get_json() or {}; name=(d.get('name') or '').strip(); email=(d.get('email') or '').strip().lower(); password=d.get('password') or ''
  if not name or '@' not in email or len(password)<8:return jsonify({'message':'Enter a name, valid email and password with at least 8 characters.'}),400
  if User.query.filter_by(email=email).first():return jsonify({'message':'Email already registered.'}),409
  u=User(name=name,email=email);u.set_password(password);db.session.add(u);db.session.commit();return jsonify({'user':u.public()}),201
 @app.post('/api/auth/login')
 def login():
  d=request.get_json() or {};u=User.query.filter_by(email=(d.get('email') or '').lower().strip()).first()
  if not u or not u.check_password(d.get('password') or ''):return jsonify({'message':'Invalid email or password.'}),401
  token=jwt.encode({'sub':str(u.id),'exp':datetime.utcnow()+timedelta(hours=12)},app.config['SECRET_KEY'],algorithm='HS256');return jsonify({'token':token,'user':u.public()})
 @app.get('/api/auth/me')
 @token_required
 def me():return jsonify({'user':g.user.public()})
 @app.get('/api/jobs')
 def list_jobs():return jsonify({'jobs':jobs(),'source':'included sample dataset','notice':'Illustrative listings, not live vacancies.'})
 @app.post('/api/ml/analyze-resume')
 @token_required
 def analyze_resume():
  if 'resume' not in request.files:return jsonify({'message':'Attach a resume file.'}),400
  f=request.files['resume']; target=request.form.get('target_role','').strip()[:120]
  try:text=read_resume(f)
  except Exception as e:return jsonify({'message':str(e)}),400
  skills=extract_skills(text); prediction=predict_role(text); matches=match_jobs(text,jobs()); gaps=sorted({s for j in matches[:3] for s in j['missing_skills']})[:12]
  result={'skills':skills,'predicted_role':prediction,'career_cluster':career_cluster(text),'matches':matches[:5],'skill_gaps':gaps,'target_role':target,'roadmap':roadmap([s['name'] for s in skills],target or prediction['role'])}
  a=Analysis(user_id=g.user.id,filename=f.filename,target_role=target,match_score=matches[0]['match_score'] if matches else 0,predicted_role=prediction['role'],result_json=result);db.session.add(a);db.session.commit();result['analysis_id']=a.id;return jsonify(result)
 @app.post('/api/ml/predict-role')
 @token_required
 def role_predict():
  d=request.get_json() or {}; text=d.get('profile_text','');return jsonify({'prediction':predict_role(text),'skills':extract_skills(text),'cluster':career_cluster(text)})
 @app.post('/api/ml/career-twin')
 @token_required
 def career_twin():
  d=request.get_json() or {};text=d.get('profile_text','');skills=extract_skills(text);pred=predict_role(text);return jsonify({'profile':g.user.public(),'predicted_role':pred,'skills':skills,'career_cluster':career_cluster(text),'recommended_projects':recommend_projects([s['name'] for s in skills],pred['role']),'roadmap':roadmap([s['name'] for s in skills],d.get('target_role') or pred['role'])})
 @app.post('/api/ml/career-simulator')
 @token_required
 def career_simulator():
  d=request.get_json() or {}; text=(d.get('profile_text') or '').strip(); target=(d.get('target_role') or '').strip()
  if len(text)<20 or not target:return jsonify({'message':'Provide profile text (at least 20 characters) and a target role.'}),400
  current={s['name'].lower() for s in extract_skills(text)}
  catalog=jobs()
  target_jobs=[j for j in catalog if target.lower() in j['title'].lower() or target.lower() in j.get('category','').lower()]
  if not target_jobs: target_jobs=[j for j in catalog if any(target.lower() in s.lower() for s in j.get('skills',[]))]
  if not target_jobs: target_jobs=catalog[:3]
  scenarios=[]
  for j in target_jobs[:3]:
   required=set(s.lower() for s in j.get('skills',[])); matched=required & current; missing=required-current
   scenarios.append({'role':j['title'],'current_coverage':round(len(matched)/max(1,len(required))*100,1),'skills_to_develop':sorted(missing),'suggested_action':'Build one demonstrable project that uses '+(', '.join(sorted(missing)[:3]) if missing else 'the role skills')})
  return jsonify({'target_role':target,'scenarios':scenarios,'disclaimer':'Exploratory skill-coverage scenarios based on the included sample job dataset; not a salary, hiring or employment prediction.'})
 @app.post('/api/ml/skill-evidence')
 @token_required
 def skill_evidence():
  d=request.get_json() or {}; profile=(d.get('profile_text') or '').strip(); projects=d.get('projects') or []
  if not profile:return jsonify({'message':'Provide profile text to evaluate.'}),400
  skills=extract_skills(profile); evidence=[]
  for item in skills:
   name=item['name']; hits=sum(1 for project in projects if name.lower() in str(project).lower())
   evidence.append({'skill':name,'category':item['group'],'project_mentions':hits,'evidence_level':'project-mentioned' if hits else 'profile-mentioned','recommendation':'Link a repository or project result demonstrating this skill.' if not hits else 'Add measurable outcomes and a concise project description.'})
  return jsonify({'evidence':evidence,'notice':'This checks text evidence only; it does not independently verify repositories, credentials or proficiency.'})
 @app.post('/api/ml/recommend-projects')
 @token_required
 def projects():
  d=request.get_json() or {};return jsonify({'recommendations':recommend_projects(d.get('skills',[]),d.get('target_role',''))})
 @app.post('/api/ml/roadmap')
 @token_required
 def learning_roadmap():
  d=request.get_json() or {};return jsonify(roadmap(d.get('skills',[]),d.get('target_role','')))
 @app.post('/api/assistant/chat')
 @token_required
 def chat():
  d=request.get_json() or {};prompt=(d.get('message') or '').strip()
  if not prompt:return jsonify({'message':'Message is required.'}),400
  return jsonify(ask_local_llm(prompt))
 @app.get('/api/ml/metrics')
 def metrics():
  p=BASE/'ml_engine/artifacts/metrics.json';return jsonify(json.loads(p.read_text()) if p.exists() else {'trained':False,'message':'Run python -m ml_engine.train first.'})
 @app.get('/api/analysis/history')
 @token_required
 def history():
  rows=Analysis.query.filter_by(user_id=g.user.id).order_by(Analysis.created_at.desc()).limit(20).all();return jsonify({'history':[{'id':a.id,'filename':a.filename,'target_role':a.target_role,'match_score':a.match_score,'predicted_role':a.predicted_role,'created_at':a.created_at.isoformat()} for a in rows]})
 @app.post('/api/signup')
 def legacy_signup():
  d=request.get_json() or {}; name=(d.get('name') or '').strip(); email=(d.get('email') or '').strip().lower(); password=d.get('password') or ''
  if not name or '@' not in email or len(password)<6:return jsonify({'message':'Enter valid details; password must contain at least 6 characters.'}),400
  if User.query.filter_by(email=email).first():return jsonify({'message':'Email already registered.'}),409
  u=User(name=name,email=email);u.set_password(password);db.session.add(u);db.session.commit();return jsonify({'message':'Signup successful','user':u.public()}),201
 @app.post('/api/login')
 def legacy_login():
  d=request.get_json() or {};u=User.query.filter_by(email=(d.get('email') or '').lower().strip()).first()
  if not u or not u.check_password(d.get('password') or ''):return jsonify({'message':'Invalid email or password.'}),401
  token=jwt.encode({'sub':str(u.id),'exp':datetime.utcnow()+timedelta(hours=12)},app.config['SECRET_KEY'],algorithm='HS256');return jsonify({'user':u.public(),'token':token})
 @app.get('/api/user/<int:user_id>')
 def legacy_user(user_id):
  u=User.query.get_or_404(user_id);return jsonify(u.public())
 @app.put('/api/profile/<int:user_id>')
 def legacy_profile(user_id):
  u=User.query.get_or_404(user_id);d=request.get_json() or {};u.name=(d.get('name') or u.name).strip();db.session.commit();return jsonify(u.public())
 return app
app=create_app()
if __name__=='__main__':app.run(host='127.0.0.1',port=5000,debug=True)
