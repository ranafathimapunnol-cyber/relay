from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models import user, project, task
from app.routers import auth, projects, tasks


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Relay API",
    description="Project & Task Management Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Relay API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
