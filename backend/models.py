from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
class User(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(100), nullable=False)
    email=db.Column(db.String(180), unique=True, nullable=False, index=True)
    password_hash=db.Column(db.String(255), nullable=False)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)
    def set_password(self,p): self.password_hash=generate_password_hash(p)
    def check_password(self,p): return check_password_hash(self.password_hash,p)
    def public(self): return {"id":self.id,"name":self.name,"email":self.email}
class Analysis(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename=db.Column(db.String(255))
    target_role=db.Column(db.String(120))
    match_score=db.Column(db.Float)
    predicted_role=db.Column(db.String(120))
    result_json=db.Column(db.JSON, nullable=False)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)
