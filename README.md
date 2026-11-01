# JobPilot – Your AI Career Assistant 🧭

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TinyFish AI](https://img.shields.io/badge/AI%20Agents-TinyFish%20Web%20Agents-06B6D4.svg)](https://tinyfish.ai)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)

**JobPilot** is a modern, responsive, and professional AI-powered job discovery platform designed for students, freshers, and experienced software engineers. It automates career opportunity discovery using **TinyFish Autonomous AI Browser Agents** to navigate and extract real openings directly from corporate career portals (Google, Amazon, Microsoft, Adobe, Deloitte, Flipkart, Infosys, TCS, Wipro, and Accenture).

---

## 🌟 Key Features

### 1. Modern SaaS UI/UX (Linear / Notion / LinkedIn Aesthetic)
- **Deep Navy & Slate Theme**: Premium dark-mode palette (`#0b0f19`, `#111827`, `#1e293b`) with glowing blue and cyan accents.
- **Lucide React Icons**: Consistent, modern iconography across all navigation, cards, and buttons.
- **Responsive Navigation**: Adaptive desktop sidebar and collapsible mobile drawer.
- **Real-time Notifications**: Floating toast alerts for saving jobs, tracking stages, and API status changes.

### 2. Autonomous Web Discovery with TinyFish API
- **Live AI Browser Agents**: Navigates live company portals, scans DOM trees, interacts with filters, and extracts unlisted, fresh postings.
- **Normalized Data Schema**: Standardizes raw portal data into:
  - Job Title & Company
  - Work Mode (Remote / Hybrid / Onsite) & Job Type (Internship / Full-time)
  - Experience Level (Internship, Fresher, Mid-Level, Senior)
  - Technical & Soft Skills
  - Detailed Responsibilities & Qualifications
  - Direct Application URLs
- **Agent Terminal Progress**: Visual real-time terminal showing agent milestones (`Connecting to portal`, `Executing stealth browser`, `Normalizing roles`).
- **Resilient Fallback & Graceful Error Handling**: Detects expired or invalid TinyFish keys gracefully without crashing; provides transparent diagnostics and queries the verified local opportunity index.

### 3. Comprehensive Application Pipeline Tracker (Kanban)
Track your entire interview journey across 6 stages:
1. **Saved / Wishlist**
2. **Applied**
3. **Online Assessment**
4. **Interviewing**
5. **Selected / Offer 🎉**
6. **Rejected**
- Easily move applications between stages with a single click.
- Add interview notes, alumni referral details, and expected compensation.

### 4. Candidate Profile & AI Skill Matcher
- Manage Full Name, Email, College, and Experience.
- **Dynamic Skills Tag Manager**: Add technical skills with quick suggestions (Python, React, FastAPI, Machine Learning, Docker, etc.).
- **Interactive Match Score**: Calculates skill match percentages on every job detail view.
- **Resume Upload & ATS Analyzer**: Drag-and-drop resume upload that parses keywords and updates your profile automatically.

### 5. Supported Enterprise Portals (Configurable)
- **Google** (Careers & Students)
- **Microsoft** (Global Careers & Copilot Engineering)
- **Amazon** (Amazon Jobs & AWS)
- **Adobe** (Adobe Careers & Creative Cloud)
- **Deloitte** (Consulting & Cyber Advisory)
- **Flipkart** (E-Commerce & Tech)
- **Infosys** (Specialist Programmer & Systems Engineer)
- **TCS** (TCS Digital & Innovation)
- **Wipro** (NextGen Engineering)
- **Accenture** (ATCI & Generative AI Labs)

---

## 🏗️ Architecture & Technology Stack

```
jobpilot/
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # REST API endpoints & CORS configuration
│   ├── config.py             # Supported companies & environment variables
│   ├── database.py           # SQLite schema (jobs, applications, saved, profile)
│   ├── seed_data.py          # Initial verified enterprise job listings
│   ├── tinyfish_service.py   # TinyFish Agent integration, parsing & normalization
│   ├── models.py             # Pydantic schemas
│   ├── .env                  # Backend credentials (TINYFISH_API_KEY)
│   └── .env.example          # Template environment file
├── frontend/                 # Vite + React 19 Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar, JobCard, Modals)
│   │   ├── context/          # React Context (AuthContext, JobContext)
│   │   ├── pages/            # Page Views (Landing, Dashboard, Search, Jobs, Saved, Tracker, Profile, Auth)
│   │   ├── services/api.js   # Centralized REST client
│   │   ├── App.jsx           # Routing & layout setup
│   │   └── index.css         # Tailwind CSS v4 directives & custom themes
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite config with API reverse proxy
├── start_backend.bat         # 1-Click Windows Backend Launcher
├── start_frontend.bat        # 1-Click Windows Frontend Launcher
├── run_jobpilot.ps1          # Unified PowerShell Launcher
├── .env.example              # Workspace environment template
└── README.md                 # Full documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: v18+ (Tested on Node.js v24 & npm 11)
- **Git**

---

### Step 1: Backend Setup

1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows PowerShell
   .venv\Scripts\Activate.ps1
   ```

3. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic python-dotenv tinyfish requests python-multipart
   ```

4. Verify or create your `.env` file in `backend/`:
   ```bash
   copy .env.example .env
   ```
   Ensure your key is set:
   ```env
   TINYFISH_API_KEY=your_key_here
   PORT=8000
   HOST=127.0.0.1
   ENVIRONMENT=development
   ```

5. Start the backend server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 2: Frontend Setup

1. Open a new terminal in the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

### Step 3: Run Both with 1-Click Scripts (Windows)

Double click or run from PowerShell:
- **`.\start_backend.bat`**: Starts FastAPI server on port 8000.
- **`.\start_frontend.bat`**: Starts Vite dev server on port 5173.
- Or run **`powershell -ExecutionPolicy Bypass -File .\run_jobpilot.ps1`** to launch both automatically!

---

## 🔑 TinyFish API Setup & Free Credits

JobPilot uses the **TinyFish Autonomous Web Agent SDK** to scrape live career pages.

1. **Get Free Credits**:
   - Register at [tinyfish.ai/students](https://tinyfish.ai/students) using your college/school email for **$35 free credits**.
2. **Generate API Key**:
   - Visit [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys) and copy your key (`sk-tinyfish-...`).
3. **Configure in JobPilot**:
   - Paste it into `backend/.env` as `TINYFISH_API_KEY=...`
   - Or click **"API Key Settings"** directly inside the JobPilot web UI navbar to test and update keys on the fly.

> **Resilience Guarantee**: If the key expires or reaches quota, JobPilot logs a clear diagnostic alert in the agent console and seamlessly displays matching opportunities from the verified database so the platform never crashes or presents empty screens during presentations!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System health and TinyFish API key status |
| `POST` | `/api/status/key` | Update or test TinyFish API key |
| `GET` | `/api/companies` | List all supported companies & career URLs |
| `GET` | `/api/dashboard/stats` | Aggregated metrics, recent jobs, and search logs |
| `GET` | `/api/jobs` | Filter jobs by query, company, location, experience, and workplace |
| `GET` | `/api/jobs/{id}` | Detailed job information (responsibilities, requirements, URL) |
| `POST` | `/api/jobs/{id}/save` | Toggle saved / bookmarked status |
| `GET` | `/api/jobs/saved` | Retrieve all bookmarked jobs |
| `POST` | `/api/search/live` | **Run TinyFish Autonomous Agent on career portals** |
| `GET` | `/api/applications` | Get tracked applications across all Kanban stages |
| `POST` | `/api/applications` | Create or track a new application |
| `PATCH` | `/api/applications/{id}` | Update application status or interview notes |
| `DELETE` | `/api/applications/{id}` | Remove application from tracker |
| `GET` | `/api/profile` | Retrieve candidate profile and skills |
| `PUT` | `/api/profile` | Update candidate profile, preferences, and skills |
| `POST` | `/api/profile/resume` | Upload resume and auto-extract technical skills |

---

## 🎓 College & Hackathon Presentation Checklist

When demonstrating **JobPilot** to evaluators or recruiters:
1. **Showcase Landing Page (`/`)**: Walk through the modern design, statistics, and supported Fortune 500 company pills.
2. **One-Click Demo Login (`/login`)**: Use the 1-Click Demo Login button to sign in instantly as Alex Morgan.
3. **Interactive Dashboard (`/dashboard`)**: Highlight the metric cards, skill matches, and quick search.
4. **AI Job Search (`/search`)**:
   - Run a live search for "Google" or "React" or "Internship".
   - Show the real-time TinyFish Agent Console terminal logs.
   - Point out how details like workplace mode, experience level, and direct apply links are normalized.
5. **Job Details Modal (`/jobs`)**: Click on any job card to display the **Skill Match Score** and full job specifications.
6. **Application Tracker (`/tracker`)**: Demonstrate moving an application across the Kanban stages (e.g. from *Applied* to *Interview* or *Offer*).
7. **Profile & Resume (`/profile`)**: Show the interactive skill tags manager and test uploading a resume.

---

## 🛡️ License

This project is built for demonstration and educational use under the **MIT License**.
Developed with ❤️ for aspiring engineers.
