from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import SessionLocal
from models import Symptom
from schemas.symptom_schema import SymptomCreate, SymptomResponse
from utils.auth_middleware import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# SAVE / UPDATE SYMPTOM (one entry per day per user)
@router.post("/symptoms", response_model=SymptomResponse)
def save_symptom(
    symptom: SymptomCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    # Check if symptom entry already exists for this date
    existing = (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id, Symptom.date == symptom.date)
        .first()
    )

    if existing:
        existing.cramps = symptom.cramps
        existing.headache = symptom.headache
        existing.bloating = symptom.bloating
        existing.fatigue = symptom.fatigue
        existing.acne = symptom.acne
        existing.breast_tenderness = symptom.breast_tenderness
        existing.insomnia = symptom.insomnia
        existing.mood_swings = symptom.mood_swings
        existing.anxiety = symptom.anxiety
        existing.depressed = symptom.depressed
        existing.note = symptom.note
        
        db.commit()
        db.refresh(existing)
        return existing

    new_symptom = Symptom(
        user_id=user_id,
        date=symptom.date,
        cramps=symptom.cramps,
        headache=symptom.headache,
        bloating=symptom.bloating,
        fatigue=symptom.fatigue,
        acne=symptom.acne,
        breast_tenderness=symptom.breast_tenderness,
        insomnia=symptom.insomnia,
        mood_swings=symptom.mood_swings,
        anxiety=symptom.anxiety,
        depressed=symptom.depressed,
        note=symptom.note,
    )

    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)
    return new_symptom


# GET SYMPTOMS (user-specific, sorted newest first)
@router.get("/symptoms", response_model=List[SymptomResponse])
def get_symptoms(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    symptoms = (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id)
        .order_by(Symptom.date.desc())
        .all()
    )
    return symptoms


# GET SYMPTOM BY DATE
@router.get("/symptoms/date/{date_val}", response_model=Optional[SymptomResponse])
def get_symptom_by_date(
    date_val: date,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    symptom = (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id, Symptom.date == date_val)
        .first()
    )
    return symptom
