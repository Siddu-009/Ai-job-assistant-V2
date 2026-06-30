from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_service import ai_chat
from services.interview_bank import get_question
from services.interview_session import (
    create_session,
    get_session,
    add_question,
    save_answer,
    asked_questions,
    current_question_number,
    total_score,
    interview_history,
)

router = APIRouter()


TOTAL_QUESTIONS = 10


class MockTestRequest(BaseModel):
    role: str
    experience: str = "Fresher"
    session_id: str = ""
    answer: str = ""


def difficulty(question_no: int):

    if question_no <= 3:
        return "easy"

    if question_no <= 6:
        return "medium"

    if question_no <= 8:
        return "hard"

    if question_no == 9:
        return "scenario"

    return "troubleshooting"


@router.post("/")
def mock_test(req: MockTestRequest):

    # ------------------------
    # START NEW TEST
    # ------------------------

    if req.session_id == "":

        session_id = create_session(
            req.role,
            req.experience
        )

        level = difficulty(1)

        question = get_question(
            req.role,
            req.experience,
            level,
            []
        )

        if question is None:

            return {
                "success": False,
                "message": "No questions found for this role."
            }

        add_question(
            session_id,
            question
        )

        return {

            "finished": False,

            "session_id": session_id,

            "question_number": 1,

            "total_questions": TOTAL_QUESTIONS,

            "question": question["question"]

        }

    # ------------------------
    # CONTINUE TEST
    # ------------------------

    session = get_session(
        req.session_id
    )

    if session is None:

        return {

            "success": False,

            "message": "Invalid Session."

        }

    history = interview_history(
        req.session_id
    )

    current = history[-1]

    prompt = f"""
You are an expert interviewer.

Question:

{current["question"]}

Candidate Answer:

{req.answer}

Evaluate professionally.

Return ONLY:

Score: x/10

Strengths

Weaknesses

Ideal Answer

Improvement Tips
"""

    evaluation = ai_chat(prompt)

    score = 7

    try:

        if "Score:" in evaluation:

            line = evaluation.splitlines()[0]

            value = line.split(":")[1].split("/")[0].strip()

            score = int(float(value))

    except:

        score = 7

    save_answer(

        req.session_id,

        req.answer,

        score

    )

    next_no = current_question_number(
        req.session_id
    ) + 1

    # ------------------------
    # FINISHED
    # ------------------------

    if next_no > TOTAL_QUESTIONS:

        final_score = round(

            (total_score(req.session_id) / (TOTAL_QUESTIONS * 10)) * 100,

            2

        )

        return {

            "finished": True,

            "final_score": final_score,

            "history": interview_history(req.session_id)

        }

    level = difficulty(next_no)

    question = get_question(

        req.role,

        req.experience,

        level,

        asked_questions(req.session_id)

    )

    if question is None:

        return {

            "finished": True,

            "message": "Question bank completed.",

            "history": interview_history(req.session_id)

        }

    add_question(

        req.session_id,

        question

    )

    return {

        "finished": False,

        "session_id": req.session_id,

        "question_number": next_no,

        "total_questions": TOTAL_QUESTIONS,

        "evaluation": evaluation,

        "question": question["question"]

    }
