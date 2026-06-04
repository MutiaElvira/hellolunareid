from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    receiver_id: int
    text: Optional[str] = None
    img_url: Optional[str] = None

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: Optional[str] = None
    img_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
