from pathlib import Path
import json, joblib, re
from sklearn.feature_extraction.text import TfidfVectorizer
ROOT=Path(__file__).resolve().parent
ART=ROOT/'artifacts'
SKILL_BANK={
 'Programming':['Java','Python','JavaScript','TypeScript','C++','C#'],
 'Backend':['Spring Boot','Flask','Django','Node.js','Express','REST APIs','Microservices'],
 'Frontend':['React','HTML','CSS','Vite','Bootstrap'],
 'Database':['PostgreSQL','MySQL','MongoDB','SQL','Redis'],
 'Data & ML':['Pandas','NumPy','scikit-learn','Machine Learning','NLP','TensorFlow','PyTorch','Power BI','Tableau','Excel','Statistics'],
 'Cloud & DevOps':['AWS','Docker','Kubernetes','Jenkins','Git','Linux','CI/CD'],
 'Networking':['Cisco','Routing','Switching','TCP/IP','Firewalls','VPN','DNS','DHCP','OSPF','VLAN']
}
def extract_skills(text):
    low=text.lower(); found=[]
    for group,skills in SKILL_BANK.items():
        for skill in skills:
            if re.search(r'(?<![a-z0-9])'+re.escape(skill.lower())+r'(?![a-z0-9])',low): found.append({'name':skill,'group':group})
    return found
def _load():
    role=joblib.load(ART/'role_classifier.joblib') if (ART/'role_classifier.joblib').exists() else None
    cluster=joblib.load(ART/'career_clusters.joblib') if (ART/'career_clusters.joblib').exists() else None
    return role,cluster
def predict_role(text):
    role,_=_load()
    if role is None: return {'role':'Needs more profile data','confidence':0.0,'alternatives':[]}
    probs=role.predict_proba([text])[0]; classes=role.classes_; order=probs.argsort()[::-1]
    return {'role':str(classes[order[0]]),'confidence':round(float(probs[order[0]]),3),'alternatives':[{'role':str(classes[i]),'confidence':round(float(probs[i]),3)} for i in order[1:3]]}
def match_jobs(resume_text,jobs):
    corpus=[resume_text]+[' '.join(j['skills'])+' '+j['description']+' '+j['title'] for j in jobs]
    vec=TfidfVectorizer(ngram_range=(1,2),stop_words='english'); mat=vec.fit_transform(corpus)
    sims=(mat[1:] @ mat[0].T).toarray().ravel()
    results=[]; resume_skills={s['name'].lower() for s in extract_skills(resume_text)}
    for job,score in zip(jobs,sims):
        required={s.lower() for s in job['skills']}; matched=sorted(required & resume_skills); missing=sorted(required-resume_skills)
        results.append({**job,'match_score':round(float(score)*100,1),'matched_skills':matched,'missing_skills':missing})
    return sorted(results,key=lambda x:x['match_score'],reverse=True)
def career_cluster(text):
    _,bundle=_load()
    if not bundle:return {'cluster':None,'label':'Not trained'}
    x=bundle['vectorizer'].transform([text]); idx=int(bundle['model'].predict(x)[0])
    return {'cluster':idx,'label':['Software & application development','Data & machine learning','Infrastructure & networking','Cloud & platform engineering','General technology profile'][idx]}
def recommend_projects(skills,target_role=''):
    known={s.lower() for s in skills}; catalog=[
      {'title':'Spring Boot REST API with PostgreSQL','skills':['Java','Spring Boot','REST APIs','PostgreSQL'],'level':'Intermediate'},
      {'title':'React Analytics Dashboard','skills':['React','JavaScript','CSS','REST APIs'],'level':'Intermediate'},
      {'title':'Resume Job-Matching ML Pipeline','skills':['Python','scikit-learn','NLP','Pandas'],'level':'Advanced'},
      {'title':'Network Monitoring & Alert System','skills':['Python','Networking','Linux','SQL'],'level':'Advanced'},
      {'title':'Flask Authentication and Profile API','skills':['Python','Flask','PostgreSQL','REST APIs'],'level':'Intermediate'},
      {'title':'Data Quality and Visualization Toolkit','skills':['Python','Pandas','SQL','Power BI'],'level':'Intermediate'}]
    scored=[]
    for p in catalog:
      missing=[s for s in p['skills'] if s.lower() not in known]; matched=len(p['skills'])-len(missing)
      scored.append({**p,'coverage':round(matched/len(p['skills'])*100),'skills_to_learn':missing,'reason':'Builds on your current skills and targets '+(target_role or 'your next role')+'.'})
    return sorted(scored,key=lambda p:(len(p['skills_to_learn']),p['title']))[:4]
def roadmap(skills,target_role):
    rec=recommend_projects(skills,target_role); gaps=[]
    for p in rec:
      for s in p['skills_to_learn']:
        if s not in gaps:gaps.append(s)
    weeks=[{'week':1,'focus':'Foundation and role requirements','tasks':['Review your target role requirements','Refresh core concepts: '+(', '.join(skills[:3]) if skills else 'programming fundamentals')]},{'week':2,'focus':'Close priority skill gaps','tasks':['Study and practise: '+(', '.join(gaps[:3]) if gaps else 'advanced concepts'),'Complete small exercises and document outcomes']},{'week':3,'focus':'Build practical evidence','tasks':['Build one portfolio project related to '+(target_role or 'your target role'),'Add tests, screenshots and a clear README']},{'week':4,'focus':'Validate and present your skills','tasks':['Review the project against job requirements','Update resume with truthful project outcomes','Apply to suitable roles and track feedback']} ]
    return {'target_role':target_role or 'Explore suitable roles','identified_gaps':gaps[:8],'weeks':weeks}
