from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.auth import UserResponse
from app.schemas.project import ProjectResponse
from app.schemas.task import TaskResponse

router=APIRouter(prefix="/api/admin",tags=["Admin"])

class RoleUpdate(BaseModel):
    role: str = Field(pattern="^(USER|ADMIN)$")

@router.get("/users",response_model=list[UserResponse])
def users(db:Session=Depends(get_db),admin:User=Depends(require_admin)):
    return db.query(User).order_by(User.id.desc()).all()

@router.patch("/users/{user_id}/role",response_model=UserResponse)
def update_role(user_id:int,data:RoleUpdate,db:Session=Depends(get_db),admin:User=Depends(require_admin)):
    user=db.query(User).filter(User.id==user_id).first()
    if not user: raise HTTPException(status_code=404,detail="User not found")
    if user.id==admin.id and data.role!="ADMIN": raise HTTPException(status_code=400,detail="You cannot remove your own admin role")
    user.role=data.role;db.commit();db.refresh(user);return user

@router.get("/projects",response_model=list[ProjectResponse])
def projects(db:Session=Depends(get_db),admin:User=Depends(require_admin)):
    return db.query(Project).order_by(Project.id.desc()).all()

@router.get("/tasks",response_model=list[TaskResponse])
def tasks(db:Session=Depends(get_db),admin:User=Depends(require_admin)):
    return db.query(Task).order_by(Task.id.desc()).all()
