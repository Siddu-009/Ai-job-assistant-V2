import json
import re

from services.ai_service import ai_chat


def get_question(
    role,
    experience,
    difficulty,
    asked_questions=None
):
    if asked_questions is None:
        asked_questions = []

    # Convert previous questions into readable text
    previous_questions = "\n".join(
        [
            f"- {question}"
            if isinstance(question, str)
            else f"- {question.get('question', '')}"
            for question in asked_questions
        ]
    )

    prompt = f"""
You are a senior technical interviewer conducting a professional
mock interview.

Generate EXACTLY ONE unique interview question.

Role: {role}
Experience Level: {experience}
Difficulty: {difficulty}

Previously Asked Questions:
{previous_questions if previous_questions else "None"}

Follow these rules strictly:

1. Generate a new question that has not been asked before.
2. Make the question directly relevant to the role.
3. Match the requested difficulty level.
4. Do not repeatedly ask general fundamentals questions.
5. Avoid questions such as:
   - Explain the fundamentals of {role}.
   - What is {role}?
   - Introduce {role}.
6. Ask a specific technical question.
7. Return ONLY valid JSON.
8. Do not include Markdown or explanations.

Difficulty Guidelines:

- easy:
  Ask basic concepts, commands, tools, and definitions.

- medium:
  Ask practical technical concepts, configurations,
  architecture, and implementation.

- hard:
  Ask advanced concepts, optimization, security,
  architecture, and real-world implementation.

- scenario:
  Ask a realistic production-based scenario
  that requires problem-solving.

- troubleshooting:
  Ask a production issue and how the candidate
  would investigate and resolve it.

Required JSON Format:

{{
    "id": 1,
    "question": "Your unique technical interview question"
}}
"""

    try:
        response = ai_chat(prompt)

        if not response:
            raise ValueError("Empty AI response")

        # Remove Markdown code fences if present
        response = response.strip()
        response = re.sub(
            r"```json|```",
            "",
            response,
            flags=re.IGNORECASE
        ).strip()

        # Extract JSON object from the response
        match = re.search(
            r"\{.*\}",
            response,
            re.DOTALL
        )

        if not match:
            raise ValueError("No JSON object found")

        question_data = json.loads(match.group())

        question = question_data.get("question")

        if not question or not isinstance(question, str):
            raise ValueError("Invalid question format")

        # Prevent accidental repetition
        normalized_question = question.strip().lower()

        for previous in asked_questions:
            if isinstance(previous, dict):
                previous_text = previous.get(
                    "question",
                    ""
                )
            else:
                previous_text = str(previous)

            if (
                normalized_question
                == previous_text.strip().lower()
            ):
                raise ValueError("Duplicate question generated")

        return {
            "id": question_data.get("id", 1),
            "question": question.strip()
        }

    except Exception as error:
        print(
            f"Question generation error: {error}"
        )

        # Role-specific fallback questions
        fallback_questions = {
            "easy": (
                f"Which three important concepts or tools "
                f"should a {role} fresher understand, "
                f"and why are they important?"
            ),

            "medium": (
                f"Explain a practical task that a {role} "
                f"performs in a real project. Describe "
                f"the tools and steps involved."
            ),

            "hard": (
                f"How would you design a scalable and secure "
                f"solution while working as a {role}? "
                f"Explain your technical decisions."
            ),

            "scenario": (
                f"You are working as a {role}. A production "
                f"application suddenly becomes slow. "
                f"How would you investigate the issue "
                f"and identify its root cause?"
            ),

            "troubleshooting": (
                f"As a {role}, a production deployment "
                f"has failed. Explain the commands, logs, "
                f"and troubleshooting steps you would use "
                f"to resolve the issue."
            ),
        }

        fallback_question = fallback_questions.get(
            difficulty,
            (
                f"Explain one important practical technical "
                f"responsibility of a {role}."
            )
        )

        # Ensure fallback is not repeated
        existing_questions = [
            (
                item.get("question", "")
                if isinstance(item, dict)
                else str(item)
            ).strip().lower()
            for item in asked_questions
        ]

        if fallback_question.strip().lower() in existing_questions:
            fallback_question = (
                f"Describe a different real-world "
                f"technical challenge faced by a {role} "
                f"and explain how you would solve it."
            )

        return {
            "id": len(asked_questions) + 1,
            "question": fallback_question
        }