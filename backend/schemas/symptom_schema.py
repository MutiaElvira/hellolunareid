from pydantic import BaseModel
from datetime import date
from typing import Optional


class SymptomCreate(BaseModel):
    date: date
    cramps: Optional[str] = None
    headache: Optional[str] = None
    bloating: Optional[str] = None
    fatigue: Optional[str] = None
    acne: Optional[str] = None
    breast_tenderness: Optional[str] = None
    insomnia: Optional[str] = None
    mood_swings: Optional[str] = None
    anxiety: Optional[str] = None
    depressed: Optional[str] = None
    note: Optional[str] = None


class SymptomResponse(BaseModel):
    id: int
    user_id: int
    date: date
    cramps: Optional[str] = None
    headache: Optional[str] = None
    bloating: Optional[str] = None
    fatigue: Optional[str] = None
    acne: Optional[str] = None
    breast_tenderness: Optional[str] = None
    insomnia: Optional[str] = None
    mood_swings: Optional[str] = None
    anxiety: Optional[str] = None
    depressed: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True
