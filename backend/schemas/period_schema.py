from pydantic import BaseModel
from datetime import date
from typing import Optional


class PeriodCreate(BaseModel):
    start_date: date
    end_date: date
    mood: Optional[str] = None


class PeriodResponse(BaseModel):
    id: int
    user_id: int
    start_date: date
    end_date: date
    mood: Optional[str] = None

    class Config:
        from_attributes = True