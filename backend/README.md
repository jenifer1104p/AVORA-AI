# AVORA AI Backend
Flask REST API with JWT authentication, SQLAlchemy persistence, resume parsing, and ML/NLP services.

## Setup (Windows PowerShell)
```powershell
cd backend
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m ml_engine.train
python run.py
```
The default database is SQLite. For PostgreSQL, create `avora_ai` and set:
`DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/avora_ai`

## API
- `GET /api/health`
- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs` (included sample data only)
- `POST /api/ml/analyze-resume` (multipart: `resume`, optional `target_role`)
- `POST /api/ml/predict-role`
- `POST /api/ml/career-twin`
- `POST /api/ml/career-simulator`
- `POST /api/ml/skill-evidence`
- `POST /api/ml/recommend-projects`
- `POST /api/ml/roadmap`
- `GET /api/ml/metrics`
- `GET /api/analysis/history`
- `POST /api/assistant/chat` (optional local OpenAI-compatible server)

Protected endpoints require `Authorization: Bearer <token>`.
