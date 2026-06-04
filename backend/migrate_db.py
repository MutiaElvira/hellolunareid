from database import engine
from sqlalchemy import text

def run_migration():
    print("Starting database migration for users table...")
    queries = [
        "ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NULL;",
        "ALTER TABLE users ADD COLUMN birth_date DATE NULL;",
        "ALTER TABLE users ADD COLUMN height FLOAT NULL;",
        "ALTER TABLE users ADD COLUMN weight FLOAT NULL;",
        "ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) NULL;",
        "ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;"
    ]

    with engine.connect() as connection:
        for query in queries:
            try:
                connection.execute(text(query))
                print(f"Successfully executed: {query}")
            except Exception as e:
                # If column already exists or other error, print and continue
                print(f"Error executing {query}: {e}")
        connection.commit()
    print("Migration complete.")

if __name__ == "__main__":
    run_migration()
