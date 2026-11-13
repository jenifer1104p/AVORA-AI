"""Train reproducible demo models from the included labelled sample dataset.
For real deployment, replace/expand this small teaching dataset with licensed,
representative job-role data and evaluate on a held-out test set.
"""
from pathlib import Path
import json, joblib, pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
ROOT=Path(__file__).resolve().parent
DATA=ROOT/'data'; OUT=ROOT/'artifacts'; OUT.mkdir(exist_ok=True)
df=pd.read_csv(DATA/'job_roles.csv')
X_train,X_test,y_train,y_test=train_test_split(df.text,df.label,test_size=.25,random_state=42,stratify=df.label)
model=Pipeline([('tfidf',TfidfVectorizer(ngram_range=(1,2),stop_words='english',sublinear_tf=True)),('classifier',LogisticRegression(max_iter=1500,class_weight='balanced'))])
model.fit(X_train,y_train)
pred=model.predict(X_test)
metrics={'accuracy':round(float(accuracy_score(y_test,pred)),3),'test_samples':len(y_test),'classification_report':classification_report(y_test,pred,output_dict=True,zero_division=0),'dataset_rows':len(df),'note':'Small illustrative dataset; metrics are not evidence of production accuracy.'}
joblib.dump(model,OUT/'role_classifier.joblib')
# KMeans profile groups trained on the same text feature space; descriptive labels are assigned in service code.
vec=TfidfVectorizer(ngram_range=(1,2),stop_words='english'); matrix=vec.fit_transform(df.text)
clusters=KMeans(n_clusters=5,random_state=42,n_init=10).fit(matrix)
joblib.dump({'vectorizer':vec,'model':clusters},OUT/'career_clusters.joblib')
(OUT/'metrics.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps({'trained':'role_classifier.joblib, career_clusters.joblib','metrics':metrics},indent=2))
