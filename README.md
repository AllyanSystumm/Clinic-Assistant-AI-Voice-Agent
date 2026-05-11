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
AI Receptionist R&D
1. Call Answering & Patient Interaction
Example products
• https://www.curemd.com/virtual-medical-receptionist
• https://www.hyro.ai/healthcare/
Features
• 24/7 automated call answering
• intent detection (“book appointment”, “refill request”, etc.)
• urgent-call routing
• multilingual conversations
• voicemail replacement with AI conversation
AI receptionists can “answer calls, schedule visits, route urgent cases, answer FAQs, process
payments and refills, and document interactions.”
2. Appointment Scheduling & Calendar Automation
Example products
• https://www.curemd.com/virtual-medical-receptionist
• https://www.lumahealth.io/
Features
• new appointment booking
• rescheduling & cancellation
• waitlist filling
• no-show recovery calls
• provider availability lookup
Platforms like Luma automate scheduling, referrals, reminders, and waitlists across the patient
journey.3. Patient Intake Automation
Example products
• https://www.curemd.com/virtual-medical-receptionist
• https://www.lumahealth.io/
Features
• demographic capture
• consent forms
• visit-reason capture
• pre-visit readiness checklists
• referral intake
AI intake tools sync collected information directly into patient charts before visits.
4. Insurance Verification & Prior Authorization
Example products
• https://www.curemd.com/virtual-medical-receptionist
• https://www.lumahealth.io/
Features
• eligibility verification
• benefits confirmation
• payer intelligence workflows
• prior-auth automation
• copay calculation
Modern systems verify coverage during scheduling and reduce claim rejections automatically.
5. Patient Messaging & EngagementExample products
• https://www.lumahealth.io/
• https://www.hyro.ai/healthcare/
Features
• SMS reminders
• two-way patient chat
• multilingual communication
• follow-up outreach
• automated recall campaigns
Conversational AI messaging improves engagement and reduces manual call workload.
6. Prescription Refill Requests
Example products
• https://www.curemd.com/virtual-medical-receptionist
Features
• refill intake
• medication verification
• provider escalation if required
• pharmacy routing
AI systems can safely process routine refill requests automatically.
7. Payments & Billing Support
Example products
• https://www.curemd.com/virtual-medical-receptionist
• https://www.lumahealth.io/
Features• copay reminders
• payment links
• outstanding balance collection
• eligibility-linked billing workflows
Eligibility checks and payment automation accelerate revenue collection.
8. Referral & Fax Workflow Automation
Example products
• https://www.lumahealth.io/
Features
• referral intake
• inbound fax reading
• specialist scheduling
• care-gap closure workflows
New AI workflow engines even extract findings from faxed clinical reports automatically.
9. Conversational AI Knowledge Assistant
Example products
• https://www.hyro.ai/healthcare/
Features
• clinic FAQs
• provider availability
• accepted insurance plans
• directions & logistics
• service explanations
These assistants resolve large volumes of routine calls automatically.10. EHR Integration (Critical Feature)
Example products
• https://www.lumahealth.io/
Features
Integration with:
• HealUS
Healthcare AI receptionists sync scheduling, intake, and patient data directly into EHR systems.
11. Analytics & Workflow Reporting
Example products
• https://www.curemd.com/virtual-medical-receptionist
Features
• call metrics dashboards
• booking conversion tracking
• patient interaction analytics
• operational efficiency reports
Dashboards help clinics optimize workflows and staffing decisions.
