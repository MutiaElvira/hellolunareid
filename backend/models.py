from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True)
    email = Column(String(100), unique=True)
    password = Column(String(255))
    
    full_name = Column(String(100), nullable=True)
    birth_date = Column(Date, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    profile_picture = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    periods = relationship("Period", back_populates="user")
    symptoms = relationship("Symptom", back_populates="user")


class Period(Base):
    __tablename__ = "periods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    mood = Column(String(100), nullable=True)

    user = relationship("User", back_populates="periods")


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    
    cramps = Column(String(50), nullable=True)
    headache = Column(String(50), nullable=True)
    bloating = Column(String(50), nullable=True)
    fatigue = Column(String(50), nullable=True)
    acne = Column(String(50), nullable=True)
    breast_tenderness = Column(String(50), nullable=True)
    
    insomnia = Column(String(50), nullable=True)
    mood_swings = Column(String(50), nullable=True)
    anxiety = Column(String(50), nullable=True)
    depressed = Column(String(50), nullable=True)
    
    note = Column(Text, nullable=True)

    user = relationship("User", back_populates="symptoms")