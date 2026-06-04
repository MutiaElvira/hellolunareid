from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
import base64

from database import SessionLocal
import models

from schemas.user_schema import UserCreate, UserLogin, UserProfileUpdate, UserProfileResponse
from utils.auth_middleware import get_current_user
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_access_token

router = APIRouter()

# DATABASE SESSION
def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# REGISTER
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = hash_password(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# LOGIN
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    if not verify_password(user.password, db_user.password):

        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_access_token({
        "user_id": db_user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# GET PROFILE
@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# UPDATE PROFILE
@router.put("/profile")
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if profile_data.email:
        # Check if email is already taken by someone else
        existing = db.query(models.User).filter(
            models.User.email == profile_data.email,
            models.User.id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        db_user.email = profile_data.email

    if profile_data.username:
        db_user.username = profile_data.username

    if profile_data.password:
        db_user.password = hash_password(profile_data.password)

    if profile_data.full_name is not None:
        db_user.full_name = profile_data.full_name
    if profile_data.birth_date is not None:
        db_user.birth_date = profile_data.birth_date
    if profile_data.height is not None:
        db_user.height = profile_data.height
    if profile_data.weight is not None:
        db_user.weight = profile_data.weight

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile updated successfully",
        "user": db_user
    }


# UPLOAD PROFILE PHOTO
@router.post("/profile/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate extension
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

    # Convert to Base64
    try:
        contents = await file.read()
        
        # Max file size 5MB (5,242,880 bytes)
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
            
        encoded = base64.b64encode(contents).decode("utf-8")
        content_type = file.content_type or "image/png"
        
        if not content_type.startswith("image/"):
            if ext == ".png":
                content_type = "image/png"
            elif ext in [".jpg", ".jpeg"]:
                content_type = "image/jpeg"
            else:
                content_type = "image/png"
                
        base64_data_url = f"data:{content_type};base64,{encoded}"
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not process file")

    # Update DB
    db_user.profile_picture = base64_data_url
    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile picture updated successfully",
        "profile_picture": db_user.profile_picture
    }


# DELETE PROFILE PHOTO
@router.delete("/profile/delete-photo")
def delete_photo(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.profile_picture = None
    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile picture deleted successfully"
    }