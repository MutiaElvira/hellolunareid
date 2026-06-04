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
    if "messages" in tables:
        print("Success: 'messages' table exists!")
    else:
        print("Error: 'messages' table does NOT exist!")
except Exception as e:
    print("Database connection error:", e)
