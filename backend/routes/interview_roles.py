import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()

DATA = Path(__file__).parent.parent / "data" / "interview_roles.json"


@router.get("/")
def roles():

    with open(DATA, "r", encoding="utf-8") as f:

        return json.load(f)
