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
- ⚙️ **Clinic Settings** — Doctors can configure start/end hours, slot duration, working days, and holidays from the dashboard
- 📊 **Live Dashboard** — Charts showing appointments for the next 10 days
- 🗓️ **Appointments Page** — View all appointments with search and date filtering
- ❌ **Cancellation Support** — Voice agent and dashboard both support appointment cancellations

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

### 2. Expose Backend with ngrok

```bash
ngrok http 4444
```

Copy the generated HTTPS URL and update the API URL in your frontend and VAPI settings.

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

## 📋 Environment

Update the ngrok URL in:
- `frontend/src/app/page.tsx`
- `frontend/src/app/appointments/page.tsx`
- `frontend/src/app/settings/page.tsx`

---

## 📄 License

MIT License
