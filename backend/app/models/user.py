from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="USER")

    projects = relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete"
    )

    tasks = relationship(
        "Task",
        foreign_keys="Task.assigned_to",
        back_populates="assigned_user"
    )
