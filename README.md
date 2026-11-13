<<<<<<< HEAD
# AVORA AI
### Your Career. Your Potential. Your Future.
**AI-powered Career Intelligence & Growth Platform**

AVORA AI combines explainable Machine Learning, NLP and an optional open-source local language model to help users explore career options and build evidence-backed development plans.

## Included capabilities
- Resume parsing for PDF, DOCX and TXT (8 MB upload limit)
- Skill extraction from resume text
- Resume-to-job matching with TF-IDF and cosine similarity
- Job-role classification using a trained scikit-learn pipeline
- Career profile clustering using K-Means
- Skill-gap analysis and four-week learning roadmap
- Career Twin profile endpoint
- Career transition simulator based on skill coverage
- Skill evidence analyzer based on supplied profile/project text
- Project recommendations
- JWT authentication and per-user analysis history
- PostgreSQL support; SQLite default for local development
- Optional local LLM through LM Studio or llama.cpp; no Ollama or paid API required

## Quick start
See `SETUP.md`. Use Python 3.10–3.12 and Node.js 20.19+ or 22.12+.
1. Start Flask backend and train models: `python -m ml_engine.train`, then `python run.py`.
2. Start React frontend: `npm install`, then `npm run dev`.
3. Create an account and open Resume Intelligence.

## Important scope and limitations
- Included jobs and role-training examples are synthetic/sample data, not live vacancies or a representative labour-market dataset.
- ML output is exploratory decision support. It is not a validated employability score, hiring decision, salary forecast or guarantee.
- Skill evidence analysis checks text mentions only; it does not verify GitHub repositories, certificates or proficiency.
- Career simulation compares skill coverage against sample role requirements; it does not predict future outcomes.
- For public deployment, configure a strong secret, HTTPS, secure token storage, rate limiting, file scanning, database migrations, backups and a security review.
=======
# AVORA-AI
AI-Powered Career Intelligence Platform | Resume Analysis, Career Matching and Skill Gap Recommendations
>>>>>>> a71495528b2e6ba76f58f424fa1c12dd4a6bc7d2
