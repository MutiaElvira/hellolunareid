from pydantic import BaseModel
from datetime import date
from typing import Optional


class MoodCreate(BaseModel):
    date: date
    mood_type: str
    note: Optional[str] = None


class MoodResponse(BaseModel):
    id: int
    user_id: int
    date: date
    mood_type: str
    note: Optional[str] = None

    class Config:
        from_attributes = True
