# Step5: Streamlit dashboard (Just for testing)
import streamlit as st
import datetime as dt
import requests
import time

st.title("Dubai Hospital Appointment Booking Portal")
base_url = st.text_input("Backend URL", "http://localhost:4444").strip().rstrip("/")

patient_name = st.text_input("Patient name")
reason = st.text_input("Reason")
start_date = st.date_input("Date", value=dt.date.today() + dt.timedelta(days=1))
start_time = st.time_input("Time", value=dt.time(9, 0))

if st.button("Schedule"):
    start_dt = dt.datetime.combine(start_date, start_time)
    payload = {
        "patient_name": patient_name.strip(),
        "reason": reason.strip() or None,
        "start_time": start_dt.isoformat(),
    }
    try:
        resp = requests.post(f"{base_url}/schedule_appointment/", json=payload, timeout=10)
        resp.raise_for_status()
        st.success("Scheduled")
    except requests.RequestException as exc:
        try:
            # Try to grab the exact error detail from our FastAPI response
            error_msg = exc.response.json().get("detail", str(exc))
        except Exception:
            error_msg = str(exc)
        st.error(f"Schedule failed: {error_msg}")

st.divider()

# Live Appointments Dashboard with Real-time Updates
st.subheader("🔄 Live Appointments Dashboard")

# Explanation of the issue
st.warning("""
**⚠️ Why appointments appear static:**

Streamlit apps only re-run when:
1. You interact with a widget (button, slider, etc.)
2. You manually refresh the browser page
3. The source code changes

**The dashboard does NOT auto-update in real-time** because that's how Streamlit works.
""")

# Create placeholder for appointments
appointments_placeholder = st.empty()

# Function to fetch and display appointments
def fetch_and_display_appointments():
    base_url = "https://balustered-oleomargaric-carleen.ngrok-free.dev"
    try:
        # Get today's appointments
        today = dt.date.today()
        payload = {"date": today.isoformat()}
        resp = requests.post(f"{base_url}/list_appointments/", json=payload, timeout=5)
        resp.raise_for_status()
        appointments = resp.json()
        
        # Display with timestamp
        with appointments_placeholder.container():
            col1, col2 = st.columns([3, 1])
            with col1:
                st.success(f"📅 Live Appointments for {today}")
            with col2:
                st.write(f"⏰ {dt.datetime.now().strftime('%H:%M:%S')}")
            
            if appointments:
                st.dataframe(appointments, use_container_width=True, hide_index=True)
                st.info(f"✅ Found {len(appointments)} appointment(s)")
            else:
                st.info("No appointments found for today")
                
    except requests.RequestException as exc:
        with appointments_placeholder.container():
            st.error(f"Failed to load appointments: {exc}")

# Fetch current appointments
fetch_and_display_appointments()

# Manual refresh section
st.markdown("---")
st.subheader("🔄 Refresh Controls")

col1, col2 = st.columns(2)
with col1:
    if st.button("🔄 Refresh Now", key="manual_refresh", use_container_width=True):
        st.rerun()
    
with col2:
    st.write("Click to load latest appointments")

# Auto-refresh simulation
st.markdown("---")
st.subheader("🤖 For True Real-time Updates")

st.info("""
**� Solutions for real-time updates:**

1. **Next.js Frontend**: Use http://localhost:3000 - it auto-refreshes every 2 seconds
2. **Manual Refresh**: Click the button above each time you want updates
3. **Watch the API**: New appointments appear instantly in the database

**🎯 Best option**: Use the Next.js frontend (localhost:3000) for true real-time updates!
""")

# Quick test booking section
st.markdown("---")
st.subheader("🧪 Quick Test Booking")

test_name = st.text_input("Test Patient Name", key="test_name")
test_reason = st.text_input("Test Reason", key="test_reason")

col1, col2 = st.columns(2)
with col1:
    if st.button("� Book Test Appointment", key="test_book", use_container_width=True):
        if test_name and test_reason:
            start_dt = dt.datetime.combine(dt.date.today(), dt.time(15, 0))
            payload = {
                "patient_name": test_name.strip(),
                "reason": test_reason.strip(),
                "start_time": start_dt.isoformat(),
            }
            try:
                resp = requests.post(f"{base_url}/schedule_appointment/", json=payload, timeout=10)
                resp.raise_for_status()
                st.success("✅ Test appointment booked!")
                st.rerun()
            except requests.RequestException as exc:
                st.error(f"Booking failed: {exc}")

with col2:
    st.write("Test the real-time update")