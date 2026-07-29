from services.ai_service import ai_chat


def evaluate_answer(question, answer):

    prompt = f"""
You are an interviewer.

Question:
{question}

Candidate Answer:
{answer}

Give:

1. Score out of 10
2. Strengths
3. Weaknesses
4. Improved answer

Return ONLY JSON.
"""

    return ai_chat(prompt)