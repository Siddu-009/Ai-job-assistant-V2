import uuid


sessions = {}


def create_session(role, experience):

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "role": role,
        "experience": experience,
        "score": 0,
        "question_number": 0,
        "asked_ids": [],
        "history": []
    }

    return session_id


def get_session(session_id):

    return sessions.get(session_id)


def add_question(session_id, question):

    if session_id not in sessions:
        return

    sessions[session_id]["question_number"] += 1

    sessions[session_id]["asked_ids"].append(
        question["id"]
    )

    sessions[session_id]["history"].append({
        "question_id": question["id"],
        "question": question["question"],
        "answer": "",
        "score": 0
    })


def save_answer(session_id, answer, score=0):

    if session_id not in sessions:
        return

    history = sessions[session_id]["history"]

    if len(history) == 0:
        return

    history[-1]["answer"] = answer
    history[-1]["score"] = score

    sessions[session_id]["score"] += score


def asked_questions(session_id):

    if session_id not in sessions:
        return []

    return sessions[session_id]["asked_ids"]


def current_question_number(session_id):

    if session_id not in sessions:
        return 0

    return sessions[session_id]["question_number"]


def total_score(session_id):

    if session_id not in sessions:
        return 0

    return sessions[session_id]["score"]


def interview_history(session_id):

    if session_id not in sessions:
        return []

    return sessions[session_id]["history"]


def end_session(session_id):

    if session_id in sessions:
        del sessions[session_id]
