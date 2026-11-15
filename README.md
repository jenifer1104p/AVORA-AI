# ✨ AVORA AI
### Your Career. Your Potential. Your Future.

<div align="center">

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=8B5CF6&center=true&vCenter=true&width=650&lines=AI-Powered+Career+Intelligence;Discover+Your+Career+Path;Analyze.+Improve.+Grow.)

**An AI-Powered Career Intelligence & Growth Platform**

[![Live Application](https://img.shields.io/badge/Live%20Application-AVORA%20AI-8B5CF6?style=for-the-badge&logo=netlify&logoColor=white)](https://avoraai.netlify.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://avora-ai-backend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/jenifer1104p/AVORA-AI)

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/API-Flask-black?style=flat-square&logo=flask)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Machine Learning](https://img.shields.io/badge/AI-Machine%20Learning-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)

</div>

---

## 🚀 About AVORA AI

AVORA AI is an intelligent career development platform that combines **Machine Learning, Natural Language Processing, and career analytics** to help users understand their skills, explore career opportunities, and build structured learning plans.

The platform transforms resume information into actionable career insights through machine learning techniques, skill analysis, and structured recommendations.

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 Resume Intelligence | Upload PDF, DOCX, or TXT resumes for analysis |
| 🎯 Career Match Explorer | Predict suitable career roles using machine learning |
| 🧠 Skill Extraction | Identify technical skills from resume content |
| 📊 Resume-to-Job Matching | Compare resumes with sample job requirements |
| 🔍 Skill Gap Analysis | Identify missing skills for a target role |
| 🗺️ Learning Roadmap | Generate a structured four-week learning plan |
| 👤 Career Profile | Explore career profile and clustering insights |
| 🔄 Career Simulator | Compare skill coverage across sample career roles |
| 🔐 User Authentication | Account access using JWT authentication |
| 📚 Analysis History | Access previous resume analysis results |

## 📸 Application Screenshots

Explore the AVORA AI interface and its main features.

### 🏠 Home Page

![AVORA AI Home Page](Screenshots/Home.png)

### 🎯 Career Match Explorer

![AVORA AI Career Match](Screenshots/career-match.png)

### 📄 Resume Intelligence

![AVORA AI Resume Intelligence](Screenshots/resume-intelligence.png)

### ✨ Features Dashboard

![AVORA AI Features Dashboard](Screenshots/features.png)

## 🛠️ Technology Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask)
![REST API](https://img.shields.io/badge/REST-API-7952B3?style=flat-square)

### Machine Learning & Data Processing

![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)

### Database & Deployment

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)

## 🧠 Machine Learning Approach

AVORA AI uses multiple analytical techniques to generate career-related insights.

| Technique | Purpose |
|---|---|
| TF-IDF | Converts resume and job descriptions into numerical text representations |
| Cosine Similarity | Measures textual similarity between resumes and sample job requirements |
| Logistic Regression | Classifies profiles into career-role categories |
| K-Means Clustering | Groups career profiles based on extracted features |
| Rule-Based Analysis | Supports skill-gap identification and learning roadmap generation |

These techniques provide exploratory decision-support insights rather than guaranteed career or employment predictions.

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[User] --> B[React Frontend]
    B --> C[Flask REST API]
    C --> D[Authentication and Application Services]
    C --> E[Machine Learning Engine]
    E --> F[Resume Analysis]
    E --> G[Career Role Prediction]
    E --> H[Job Matching and Skill Gap Analysis]
    E --> I[Learning Roadmap]
    D --> J[(PostgreSQL Database)]
    F --> K[Career Intelligence Results]
    G --> K
    H --> K
    I --> K
    K --> C
    C --> B
```

## ⚙️ Application Workflow

```mermaid
flowchart TD
    A([User Signup / Login]) --> B[Upload Resume]
    B --> C[Resume Text Extraction]
    C --> D[Skill Identification]
    D --> E[Machine Learning Analysis]
    E --> F[Career Role Prediction]
    E --> G[Resume and Job Matching]
    E --> H[Skill Gap Analysis]
    H --> I[Personalized Learning Roadmap]
    F --> J[Career Intelligence Dashboard]
    G --> J
    I --> J
```

## 📂 Project Structure

```text
AVORA-AI/
│
├── Screenshots/
│   ├── Home.png
│   ├── career-match.png
│   ├── features.png
│   └── resume-intelligence.png
│
├── backend/
│   ├── ml_engine/
│   │   ├── artifacts/
│   │   ├── data/
│   │   ├── service.py
│   │   └── train.py
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── SETUP.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/jenifer1104p/AVORA-AI.git
cd AVORA-AI
```

### 2. Configure the Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables according to your backend configuration.

Train the ML models:

```bash
python -m ml_engine.train
```

Start the Flask backend:

```bash
python run.py
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend environment configuration with:

```env
VITE_API_URL=http://127.0.0.1:5000
```

Start the development server:

```bash
npm run dev
```

### 4. Launch AVORA AI

Open the frontend in your browser:

```text
http://localhost:5173
```

Create an account and explore the career intelligence features.

For complete configuration details, refer to [SETUP.md](SETUP.md).

## 🌐 Live Deployment

| Component | Platform | Link |
|---|---|---|
| Frontend | Netlify | [Open AVORA AI](https://avoraai.netlify.app/) |
| Backend API | Render | [Open Backend](https://avora-ai-backend.onrender.com) |
| Backend Health | Render | [Check API Health](https://avora-ai-backend.onrender.com/api/health) |
| Source Code | GitHub | [View Repository](https://github.com/jenifer1104p/AVORA-AI) |

**Backend health check:** The API health endpoint reports service status, database connectivity, and ML artifact availability.

## ⚠️ Project Scope & Limitations

- Job descriptions and role-training examples are sample or synthetic data, not live job vacancies.
- ML predictions are exploratory decision-support outputs, not validated hiring or employability scores.
- Skill extraction identifies text mentions; it does not verify actual proficiency or certificates.
- Career simulations compare skills against sample role requirements and do not predict future employment outcomes.
- Public deployment requires ongoing security hardening, including HTTPS, secure token storage, rate limiting, file scanning, and database backups.

## 🔮 Future Enhancements

- Advanced resume feedback and optimization.
- Expanded career-role datasets.
- Interactive skill development tracking.
- Improved career recommendation models.
- Enhanced career analytics dashboard.
- More personalized learning recommendations.

## 👩‍💻 Developer

**Jenifer P**

Software Developer | Java Full Stack | AI & Machine Learning Enthusiast

[![GitHub](https://img.shields.io/badge/GitHub-jenifer1104p-181717?style=for-the-badge&logo=github)](https://github.com/jenifer1104p)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/jenifer04p)

---

<div align="center">

### ✨ Explore. Learn. Evolve. ✨

**AVORA AI — Building Smarter Career Journeys.**

<sub>Designed and developed with curiosity, creativity, and technology.</sub>

</div>
