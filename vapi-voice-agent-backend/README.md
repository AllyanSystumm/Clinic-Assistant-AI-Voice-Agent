# 🏥 Clinic Assistant AI Voice Agent

A backend service built with **FastAPI**, **SQLAlchemy**, and **Streamlit** to handle voice-driven clinic appointments via [VAPI](https://vapi.ai/). Patients can dynamically schedule, cancel, and list appointments through natural language.

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/AllyanSystumm/Clinic-Assistant-AI-Voice-Agent.git
cd Clinic-Assistant-AI-Voice-Agent
uv sync
```

### 2. Run the Services
**Start the API Server:**
```bash
uv run python backend.py
```
*(Runs on `http://127.0.0.1:4444`)*

**Expose with Ngrok (for VAPI):**
```bash
ngrok http 4444
```

**Start the Testing Dashboard:**
```bash
uv run streamlit run dummy_frontend.py
```

---

## 📡 API Endpoints (POST)

All endpoints accept JSON. Time slots are strictly enforced between **12 PM - 5 PM** with mechanisms preventing double booking.

- `/schedule_appointment/`  *(Requires: `patient_name`, `reason`, `start_time`)*
- `/cancel_appointment/` *(Requires: `patient_name`, `date`)*
- `/list_appointments/` *(Requires: `date`)*

---

## 🔌 VAPI Setup

1. Copy your Ngrok URL to the VAPI Dashboard as your backend Base URL.
2. Ensure VAPI parameter names strictly match the backend (e.g., lowercase `patient_name`).
3. VAPI will automatically read API error descriptions for out-of-bounds or double booking slot errors!