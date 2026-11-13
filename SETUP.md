# AVORA AI — Windows setup
## Prerequisites
- Python 3.10–3.12
- Node.js 20.19+ or 22.12+
- PostgreSQL 15+ (optional; SQLite is the local default)

## Backend
```powershell
cd backend
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m ml_engine.train
python run.py
```
API: `http://127.0.0.1:5000`

For PostgreSQL, create a database named `avora_ai`, then set in `backend/.env`:
`DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/avora_ai`

## Frontend (new terminal)
```powershell
cd frontend
npm install
npm run dev
```
Open the Vite URL (normally `http://localhost:5173`).

Set `VITE_API_URL=http://127.0.0.1:5000` in `frontend/.env` only if your backend runs elsewhere.

## Tests
```powershell
cd backend
python -m unittest discover -s tests -v
```
## Optional local LLM
Install LM Studio or llama.cpp separately and configure the OpenAI-compatible local server URL in `backend/.env`. AVORA's core ML/NLP features do not require it.
