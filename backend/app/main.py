from fastapi import FastAPI

from app.routers import projects

app = FastAPI(
    title="Relay API",
    description="Project and Task Management Platform",
    version="1.0.0",
)

app.include_router(projects.router)


@app.get("/")
def root():
    return {"message": "Welcome to Relay API"}