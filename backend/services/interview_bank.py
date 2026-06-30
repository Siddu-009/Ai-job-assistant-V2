import json
import random
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "interview_questions.json"


def load_questions():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_question(role, experience, difficulty, asked_ids=None):

    if asked_ids is None:
        asked_ids = []

    data = load_questions()

    if role not in data:
        return None

    if experience not in data[role]:
        return None

    questions = data[role][experience].get(difficulty, [])

    available = [
        q for q in questions
        if q["id"] not in asked_ids
    ]

    if not available:
        return None

    return random.choice(available)
