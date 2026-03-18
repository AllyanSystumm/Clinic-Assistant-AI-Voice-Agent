# 🏥 DocAssist AI — Clinic Assistant AI Voice Agent

An AI-powered voice assistant and clinic management dashboard for scheduling, managing, and tracking patient appointments.

---

## 📁 Project Structure

```
vapi-voice-agent/
├── backend/            # FastAPI backend layer (Python)
│   ├── backend.py
│   ├── main.py
│   ├── pyproject.toml
│   └── ...
├── frontend/           # Next.js dashboard layer (React)
│   └── ...
├── database/           # Database layer (SQLAlchemy + SQLite)
│   ├── database.py
│   └── appointments_db.db
├── legacy_nestjs_backend/ # Old NestJS backend
└── README.md           # Project documentation
```

---

## 🚀 Features

- 🎙️ **AI Voice Agent** — Patients can book and cancel appointments via phone call using VAPI
- 📅 **Appointment Scheduling** — Enforces doctor's working hours, slot durations, holidays, and a 10-day booking window
- 📖 **Clinical Guidelines** — Searchable library of medical protocols for Heart Disease, Kidney Failure, Cancer, and more
- 👤 **Account Settings** — Profile management for medical professionals with personal and contact information
- 🔐 **Secure Authentication** — Dedicated login and signup system for clinic staff
- ⚙️ **Clinic Settings** — Configure working hours, slot duration, and holidays from the dashboard
- 📊 **Live Dashboard** — Real-time charts and summaries of upcoming appointments

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Voice Agent | [VAPI](https://vapi.ai) |
| Backend API | Python, FastAPI, SQLAlchemy, SQLite |
| Frontend | Next.js 15, React, TailwindCSS, Recharts |
| Tunneling | ngrok |

---

## ⚡ Getting Started

### 1. Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# Run server
python backend.py
# Server runs on http://127.0.0.1:4444
```

### 2. Expose Backend with ngrok (Optional)

If you need to access the API remotely or via VAPI:
```bash
ngrok http 4444
```
Copy the generated URL and update it in `frontend/src/config.ts`.

### 3. Frontend (Next.js)

```bash
cd frontend

npm install
npm run dev
# Dashboard runs on http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/schedule_appointment/` | Book a new appointment |
| `POST` | `/cancel_appointment/` | Cancel an appointment |
| `POST` | `/list_appointments/` | List all appointments |
| `GET` | `/settings/` | Get clinic settings |
| `POST` | `/settings/` | Update clinic settings |

---

## ⚙️ Scheduling Rules

- Appointments only allowed within **doctor's configured working hours**
- Only on **configured working days**
- **Holiday dates** are blocked automatically
- Patients can book up to **10 days in advance**
- Slot duration is configurable (15, 30, 45, or 60 minutes)

---

## 📋 Environment Configuration

Centralized API management is handled in:
- `frontend/src/config.ts`

Simply update the `API_BASE_URL` in this file to switch between local development and a production/ngrok endpoint.

---

## 📄 License

MIT License
