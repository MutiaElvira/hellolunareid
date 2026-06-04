from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
import models
from database import SessionLocal
from utils.auth_middleware import get_current_user
from schemas.message_schema import MessageCreate, MessageResponse
from typing import List

router = APIRouter(prefix="/messages", tags=["messages"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/contacts")
def get_contacts(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user)):
    # Retrieve all users except the current logged-in user
    users = db.query(models.User).filter(models.User.id != current_user_id).all()
    
    contacts = []
    for user in users:
        # Get the last message exchanged with this user
        last_msg = db.query(models.Message).filter(
            or_(
                and_(models.Message.sender_id == current_user_id, models.Message.receiver_id == user.id),
                and_(models.Message.sender_id == user.id, models.Message.receiver_id == current_user_id)
            )
        ).order_by(desc(models.Message.created_at)).first()
        
        contacts.append({
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "last_message": last_msg.text if last_msg else None,
            "last_message_time": last_msg.created_at.strftime("%H:%M") if last_msg else None
        })
        
    return contacts

@router.get("/{friend_id}", response_model=List[MessageResponse])
def get_chat_history(friend_id: int, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user)):
    # Fetch all messages between these two users ordered by time
    messages = db.query(models.Message).filter(
        or_(
            and_(models.Message.sender_id == current_user_id, models.Message.receiver_id == friend_id),
            and_(models.Message.sender_id == friend_id, models.Message.receiver_id == current_user_id)
        )
    ).order_by(models.Message.created_at).all()
    
    # Mark incoming messages as read
    db.query(models.Message).filter(
        models.Message.sender_id == friend_id,
        models.Message.receiver_id == current_user_id,
        models.Message.is_read == False
    ).update({models.Message.is_read: True}, synchronize_session=False)
    db.commit()
    
    return messages

@router.post("", response_model=MessageResponse)
def send_message(msg: MessageCreate, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user)):
    # Verify receiver exists
    receiver = db.query(models.User).filter(models.User.id == msg.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
        
    new_message = models.Message(
        sender_id=current_user_id,
        receiver_id=msg.receiver_id,
        text=msg.text,
        img_url=msg.img_url
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message
