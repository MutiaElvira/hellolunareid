from fastapi import FastAPI
from database import engine
from routes.auth import router as auth_router
from routes.periods import router as period_router
from routes.symptoms import router as symptom_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import models

# Ensure uploads directory exists
os.makedirs("uploads/profile_pictures", exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, X-Requested-With"
    return response

models.Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(period_router)
app.include_router(symptom_router)

@app.get("/")
def home():
    return {
        "message": "Lunare API 🌙"
    }