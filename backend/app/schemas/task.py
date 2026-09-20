from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


TaskStatus = Literal[
    "TODO",
    "IN_PROGRESS",
    "COMPLETED"
]

TaskPriority = Literal[
    "LOW",
    "MEDIUM",
    "HIGH"
]


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None

    status: TaskStatus = "TODO"
    priority: TaskPriority = "MEDIUM"

    project_id: int
    assigned_to: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assigned_to: int | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None

    status: str
    priority: str

    project_id: int
    created_by: int
    assigned_to: int | None

    created_at: datetime
    updated_at: datetime
