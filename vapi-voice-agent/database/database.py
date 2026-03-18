import datetime as dt

from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

import os

# Get the absolute path of the current directory to locate the database file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "appointments_db.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False, "timeout": 30})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, index=True)
    reason = Column(String, nullable=True)
    start_time = Column(DateTime, index=True)
    canceled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=dt.datetime.utcnow)

class ClinicSettings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    start_hour = Column(Integer, default=12) # 12 PM
    end_hour = Column(Integer, default=17) # 5 PM
    slot_duration_minutes = Column(Integer, default=15)
    working_days = Column(String, default="0,1,2,3,4,5") # Mon(0) to Sat(5)
    holidays = Column(String, default="") # comma-separated list of YYYY-MM-DD


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#init_db()