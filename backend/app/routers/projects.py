from fastapi import APIRouter

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


projects = [
    {
        "id": 1,
        "name": "Relay Website",
        "description": "Build the Relay project management platform",
    },
    {
        "id": 2,
        "name": "Mobile App",
        "description": "Create the mobile version of Relay",
    },
]


@router.get("/")
def get_projects():
    return projects