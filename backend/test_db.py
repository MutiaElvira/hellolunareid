from database import engine, Base
import models
from sqlalchemy import inspect
import os

print("Checking database URL:", os.getenv("DATABASE_URL"))
try:
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tables in database:", tables)
except Exception as e:
    print("Database connection error:", e)

