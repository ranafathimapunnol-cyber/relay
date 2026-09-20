from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate
)


router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"]
)


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(
            Project.id == data.project_id,
            Project.owner_id == user.id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if data.assigned_to:
        assigned_user = (
            db.query(User)
            .filter(User.id == data.assigned_to)
            .first()
        )

        if not assigned_user:
            raise HTTPException(
                status_code=404,
                detail="Assigned user not found"
            )

    task = Task(
        title=data.title,
        description=data.description,
        status=data.status,
        priority=data.priority,
        project_id=data.project_id,
        created_by=user.id,
        assigned_to=data.assigned_to
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    status_filter: str | None = Query(
        default=None,
        alias="status"
    ),
    priority: str | None = None,
    page: int = Query(
        default=1,
        ge=1
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100
    ),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = (
        db.query(Task)
        .filter(Task.created_by == user.id)
    )

    if status_filter:
        query = query.filter(
            Task.status == status_filter
        )

    if priority:
        query = query.filter(
            Task.priority == priority
        )

    offset = (page - 1) * limit

    return (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.created_by == user.id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


@router.patch(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.created_by == user.id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    updates = data.model_dump(
        exclude_unset=True
    )

    if "assigned_to" in updates:
        if updates["assigned_to"] is not None:
            assigned_user = (
                db.query(User)
                .filter(
                    User.id == updates["assigned_to"]
                )
                .first()
            )

            if not assigned_user:
                raise HTTPException(
                    status_code=404,
                    detail="Assigned user not found"
                )

    for field, value in updates.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.created_by == user.id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }
