from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# This creates the SQLAlchemy Engine.
engine = create_engine(settings.DATABASE_URL)
# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
# This creates the base class for your database models.
Base = declarative_base()

# Creates a new database session.
def get_db():
    db = SessionLocal() 
# yeild temporarily gives the session to the endpoint.
    try:
        yield db
    finally:
        db.close()
