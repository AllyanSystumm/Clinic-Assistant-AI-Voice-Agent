# Step1: Import Database objects

import sys
import os

# Add the parent directory (vapi-voice-agent root) to the system path so it can import the 'database' package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import init_db, Appointment, ClinicSettings, get_db


init_db()

# Step3: Create Data Contracts using Pydantic Models
import datetime as dt
from pydantic import BaseModel, Field

class AppointmentRequest(BaseModel):
    patient_name: str
    reason: str
    start_time: dt.datetime

class AppointmentResponse(BaseModel):
    id: int
    patient_name: str
    reason: str | None
    start_time: dt.datetime
    canceled: bool
    created_at: dt.datetime

class CancelAppointmentRequest(BaseModel):
    patient_name: str
    date: dt.date

class CancelAppointmentResponse(BaseModel):
    canceled_count: int

class ListAppointmentRequest(BaseModel):
    date: dt.date | None = None

class ClinicSettingsResponse(BaseModel):
    start_hour: int = Field(..., ge=0, le=23)
    end_hour: int = Field(..., ge=0, le=23)
    slot_duration_minutes: int
    working_days: str
    holidays: str

class UpdateClinicSettingsRequest(BaseModel):
    start_hour: int = Field(..., ge=0, le=23)
    end_hour: int = Field(..., ge=0, le=23)
    slot_duration_minutes: int
    working_days: str
    holidays: str

# Step2: Create FastAPI application and endpoints pseudo code

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List


app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove dead connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or handle incoming messages if needed
            await manager.send_personal_message(f"Received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# settings
@app.get("/settings/", response_model=ClinicSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    from sqlalchemy import select
    settings = db.execute(select(ClinicSettings)).scalar_one_or_none()
    if not settings:
        settings = ClinicSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return ClinicSettingsResponse(
        start_hour=settings.start_hour,
        end_hour=settings.end_hour,
        slot_duration_minutes=settings.slot_duration_minutes,
        working_days=settings.working_days,
        holidays=settings.holidays
    )

@app.post("/settings/", response_model=ClinicSettingsResponse)
def update_settings(request: UpdateClinicSettingsRequest, db: Session = Depends(get_db)):
    try:
        from sqlalchemy import select
        settings = db.execute(select(ClinicSettings)).scalars().first()
        if not settings:
            settings = ClinicSettings()
            db.add(settings)

        settings.start_hour = request.start_hour
        settings.end_hour = request.end_hour
        settings.slot_duration_minutes = request.slot_duration_minutes
        settings.working_days = request.working_days
        settings.holidays = request.holidays

        db.commit()
        db.refresh(settings)
        
        return settings
    except Exception as e:
        print(f"Error in update_settings: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# schedule appt
@app.post("/schedule_appointment/")
def schedule_appointment(request: AppointmentRequest, db: Session = Depends(get_db)):
    from sqlalchemy import select
    settings = db.execute(select(ClinicSettings)).scalar_one_or_none()
    if not settings:
        settings = ClinicSettings()

    req_date_str = request.start_time.strftime('%Y-%m-%d')
    holidays = [h.strip() for h in settings.holidays.split(',')] if settings.holidays else []
    
    # 0.1 Holiday check
    if req_date_str in holidays:
        raise HTTPException(
            status_code=400,
            detail=f"I'm sorry, but the clinic is closed for a holiday on {request.start_time.strftime('%B %d, %Y')}."
        )

    # 0.2 Working days check
    working_days = [int(d.strip()) for d in settings.working_days.split(',')] if settings.working_days else []
    if request.start_time.weekday() not in working_days:
        raise HTTPException(
            status_code=400,
            detail=(
                f"I'm sorry, but the clinic is closed on this day of the week. "
                f"{request.start_time.strftime('%B %d, %Y')} falls on a non-working day. "
                "Please choose a valid working day."
            )
        )
        
    # 0.5. 10-day window check
    current_date = dt.datetime.now().date()
    appointment_date = request.start_time.date()
    
    if appointment_date < current_date:
        raise HTTPException(
            status_code=400,
            detail=(
                f"I'm sorry, but you cannot book an appointment in the past. "
                f"Please choose a date today or up to 10 days from today."
            )
        )
        
    if appointment_date > current_date + dt.timedelta(days=10):
        # Calculate the max allowed date for the error message
        max_date = current_date + dt.timedelta(days=10)
        raise HTTPException(
            status_code=400,
            detail=(
                f"I'm sorry, but appointments can only be booked up to 10 days in advance. "
                f"The latest date you can book is {max_date.strftime('%B %d, %Y')}."
            )
        )

    # 1. Time availability check
    if request.start_time.hour < settings.start_hour or request.start_time.hour >= settings.end_hour:
        start_ampm = "AM" if settings.start_hour < 12 else "PM"
        end_ampm = "AM" if settings.end_hour < 12 else "PM"
        sh = settings.start_hour % 12 or 12
        eh = settings.end_hour % 12 or 12
        
        raise HTTPException(
            status_code=400,
            detail=(
                f"I'm sorry, but your requested appointment time of "
                f"{request.start_time.strftime('%I:%M %p')} is outside clinic hours. "
                f"The doctor is only available between {sh}:00 {start_ampm} and {eh}:00 {end_ampm}. "
                "Please choose a different time slot."
            )
        )

    # 2a. Same-person duplicate check — same patient booked at the same time on the same day
    same_person_booking = db.execute(
        select(Appointment)
        .where(Appointment.patient_name == request.patient_name)
        .where(Appointment.start_time == request.start_time)
        .where(Appointment.canceled == False)
    ).scalar_one_or_none()

    if same_person_booking:
        raise HTTPException(
            status_code=400,
            detail=(
                f"It looks like {request.patient_name} already has an appointment "
                f"on {request.start_time.strftime('%B %d, %Y')} at {request.start_time.strftime('%I:%M %p')}. "
                "You cannot book the same slot twice. Please choose a different time."
            )
        )

    # 2b. Slot availability check — no two patients can occupy the exact same slot
    existing_appointment = db.execute(
        select(Appointment)
        .where(Appointment.start_time == request.start_time)
        .where(Appointment.canceled == False)
    ).scalar_one_or_none()

    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail=(
                f"I'm sorry, but the {request.start_time.strftime('%I:%M %p')} slot on "
                f"{request.start_time.strftime('%B %d, %Y')} is already booked by another patient. "
                "Please choose a different time slot."
            )
        )

    new_appointment = Appointment(
            patient_name=request.patient_name,
            reason=request.reason,
            start_time=request.start_time,
        )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    new_appointment_return_obj = AppointmentResponse(
        id = new_appointment.id,
        patient_name= new_appointment.patient_name,
        reason=new_appointment.reason,
        start_time=new_appointment.start_time,
        canceled=new_appointment.canceled,
        created_at=new_appointment.created_at
    )
    
    # TODO: Implement WebSocket broadcast for real-time updates
    # For now, frontend will use polling every 10 seconds
    
    return new_appointment_return_obj


# cancel appt
from sqlalchemy import select
@app.post("/cancel_appointment/")
def cancel_appointment(request: CancelAppointmentRequest, db: Session = Depends(get_db)):   
    
    start_dt = dt.datetime.combine(request.date, dt.time.min)
    end_dt = start_dt + dt.timedelta(days=1)

    result = db.execute(
        select(Appointment)
        .where(Appointment.patient_name == request.patient_name)
        .where(Appointment.start_time >= start_dt)
        .where(Appointment.start_time < end_dt)
        .where(Appointment.canceled == False)
    )

    appointments = result.scalars().all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No matching appointment for the details found in our system")

    for appointment in appointments:
        appointment.canceled = True
    
    db.commit()
    
    return CancelAppointmentResponse(canceled_count=len(appointments))

# list appt
@app.post("/list_appointments/")
def list_appointments(request: ListAppointmentRequest, db: Session = Depends(get_db)):
    
    query = select(Appointment)
    
    if request.date:
        start_dt = dt.datetime.combine(request.date, dt.time.min)
        end_dt = start_dt + dt.timedelta(days=1)
        query = query.where(Appointment.start_time >= start_dt).where(Appointment.start_time < end_dt)
        
    query = query.order_by(Appointment.start_time.asc())
    
    result = db.execute(query)
    booked_appointments = []
    for appointment in result.scalars().all():
        appointment_obj = AppointmentResponse(
        id=appointment.id,
        patient_name=appointment.patient_name,
        reason=appointment.reason,
        start_time=appointment.start_time,
        canceled=appointment.canceled,
        created_at=appointment.created_at
    )
        booked_appointments.append(appointment_obj)

    return booked_appointments

import uvicorn
if __name__ == "__main__":
    uvicorn.run("backend:app", host="127.0.0.1", port=4444, reload=True)
