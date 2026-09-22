from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, projects, tasks, admin

app=FastAPI(title="Relay API",description="Project & Task Management Platform",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000","http://localhost:3001",
        "http://127.0.0.1:3000","http://127.0.0.1:3001",
    ],
    allow_credentials=True,allow_methods=["*"],allow_headers=["*"],
)
# Register routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(admin.router)
# Root endpoint
@app.get("/")
def root(): return {"message":"Welcome to Relay API","status":"running"}
# Health endpoint
@app.get("/health")
def health(): return {"status":"healthy"}
