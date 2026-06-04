from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List

from database import SessionLocal
from models import Period
from schemas.period_schema import PeriodCreate, PeriodResponse
from utils.auth_middleware import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# CREATE PERIOD
@router.post("/periods")
def create_period(
    period: PeriodCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    # Validate end_date >= start_date
    if period.end_date < period.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be after or equal to start date"
        )

    new_period = Period(
        user_id=user_id,
        start_date=period.start_date,
        end_date=period.end_date,
        mood=period.mood,
    )

    db.add(new_period)
    db.commit()
    db.refresh(new_period)

    return {
        "message": "Period saved successfully",
        "id": new_period.id
    }


# GET ALL PERIODS (user-specific, sorted newest first)
@router.get("/periods", response_model=List[PeriodResponse])
def get_periods(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    periods = (
        db.query(Period)
        .filter(Period.user_id == user_id)
        .order_by(Period.start_date.desc())
        .all()
    )

    return periods


# UPDATE PERIOD
@router.put("/periods/{id}")
def update_period(
    id: int,
    period: PeriodCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    existing_period = (
        db.query(Period)
        .filter(Period.id == id, Period.user_id == user_id)
        .first()
    )

    if not existing_period:
        raise HTTPException(
            status_code=404,
            detail="Period not found"
        )

    if period.end_date < period.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be after or equal to start date"
        )

    existing_period.start_date = period.start_date
    existing_period.end_date = period.end_date
    existing_period.mood = period.mood

    db.commit()

    return {
        "message": "Period updated successfully"
    }


# DELETE PERIOD
@router.delete("/periods/{id}")
def delete_period(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    period = (
        db.query(Period)
        .filter(Period.id == id, Period.user_id == user_id)
        .first()
    )

    if not period:
        raise HTTPException(
            status_code=404,
            detail="Period not found"
        )

    db.delete(period)
    db.commit()

    return {
        "message": "Period deleted successfully"
    }


# PREDICTION — calculates cycle info from user's period history
@router.get("/periods/prediction")
def get_prediction(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    periods = (
        db.query(Period)
        .filter(Period.user_id == user_id)
        .order_by(Period.start_date.asc())
        .all()
    )

    if not periods:
        return {
            "has_data": False,
            "message": "No period data yet"
        }

    # Calculate average cycle length from consecutive periods
    cycle_lengths = []
    for i in range(1, len(periods)):
        diff = (periods[i].start_date - periods[i - 1].start_date).days
        if 15 <= diff <= 50:  # only count reasonable cycle lengths
            cycle_lengths.append(diff)

    avg_cycle = (
        round(sum(cycle_lengths) / len(cycle_lengths))
        if cycle_lengths
        else 28
    )

    # Calculate average period duration
    durations = []
    for p in periods:
        dur = (p.end_date - p.start_date).days + 1
        if 1 <= dur <= 15:
            durations.append(dur)

    avg_duration = (
        round(sum(durations) / len(durations))
        if durations
        else 5
    )

    # Latest period
    latest = periods[-1]
    today = date.today()

    # Current cycle day (days since last period started + 1)
    cycle_day = (today - latest.start_date).days + 1

    # Next period prediction
    next_period_date = latest.start_date + timedelta(days=avg_cycle)

    # Ovulation prediction (~14 days before next period)
    ovulation_date = next_period_date - timedelta(days=14)

    # Fertile window (5 days before ovulation + ovulation day)
    fertile_start = ovulation_date - timedelta(days=5)
    fertile_end = ovulation_date

    # Determine current phase
    days_since_start = (today - latest.start_date).days

    if days_since_start < avg_duration:
        phase = "Menstrual"
    elif days_since_start < (avg_cycle - 14 - 5):
        phase = "Follicular"
    elif days_since_start < (avg_cycle - 14 + 1):
        phase = "Ovulation"
    else:
        phase = "Luteal"

    # Generate 1-year (12 cycles) predictions
    future_predictions = []
    current_prediction = next_period_date
    for _ in range(12):
        future_predictions.append(current_prediction.isoformat())
        current_prediction += timedelta(days=avg_cycle)

    return {
        "has_data": True,
        "avg_cycle_length": avg_cycle,
        "avg_period_duration": avg_duration,
        "cycle_day": cycle_day if cycle_day > 0 else 1,
        "current_phase": phase,
        "next_period_date": next_period_date.isoformat(),
        "ovulation_date": ovulation_date.isoformat(),
        "fertile_window_start": fertile_start.isoformat(),
        "fertile_window_end": fertile_end.isoformat(),
        "latest_period_start": latest.start_date.isoformat(),
        "latest_period_end": latest.end_date.isoformat(),
        "future_predictions": future_predictions,
    }