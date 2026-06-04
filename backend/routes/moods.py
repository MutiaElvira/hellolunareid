from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal
from models import Mood
from schemas.mood_schema import MoodCreate, MoodResponse
from utils.auth_middleware import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# CREATE / UPDATE MOOD (one mood per day)
@router.post("/moods")
def create_mood(
    mood: MoodCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    # Check if mood already exists for this date
    existing = (
        db.query(Mood)
        .filter(Mood.user_id == user_id, Mood.date == mood.date)
        .first()
    )

    if existing:
        existing.mood_type = mood.mood_type
        existing.note = mood.note
        db.commit()

        return {
            "message": "Mood updated successfully",
            "id": existing.id
        }

    new_mood = Mood(
        user_id=user_id,
        date=mood.date,
        mood_type=mood.mood_type,
        note=mood.note,
    )

    db.add(new_mood)
    db.commit()
    db.refresh(new_mood)

    return {
        "message": "Mood saved successfully",
        "id": new_mood.id
    }


# GET MOODS (user-specific, sorted newest first)
@router.get("/moods", response_model=List[MoodResponse])
def get_moods(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    moods = (
        db.query(Mood)
        .filter(Mood.user_id == user_id)
        .order_by(Mood.date.desc())
        .all()
    )

    return moods


# DELETE MOOD
@router.delete("/moods/{id}")
def delete_mood(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    mood = (
        db.query(Mood)
        .filter(Mood.id == id, Mood.user_id == user_id)
        .first()
    )

    if not mood:
        raise HTTPException(
            status_code=404,
            detail="Mood not found"
        )

    db.delete(mood)
    db.commit()

    return {
        "message": "Mood deleted successfully"
    }
