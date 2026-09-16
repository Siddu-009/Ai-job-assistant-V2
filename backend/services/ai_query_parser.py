import json

from services.ai_service import call_ai


DEFAULT_RESPONSE = {
    "primary_role": "",
    "related_roles": [],
    "skills": [],
    "location": "",
    "experience": "",
    "work_mode": "",
    "job_type": ""
}


async def parse_search(
    keyword="",
    location="",
    experience=""
):

    query = " ".join([
        keyword,
        location,
        experience
    ]).strip()

    if not query:
        return DEFAULT_RESPONSE

    prompt = f"""
You are an AI Job Search Assistant.

Understand the user's search request.

Return ONLY valid JSON.

User Query:
{query}

Schema:

{{
    "primary_role":"",
    "related_roles":[],
    "skills":[],
    "location":"",
    "experience":"",
    "work_mode":"",
    "job_type":""
}}

Rules:

Return JSON only.
No markdown.
No explanation.
"""

    response = await call_ai(prompt)

    try:

        return json.loads(response)

    except Exception:

        return {
            **DEFAULT_RESPONSE,
            "primary_role": keyword,
            "location": location,
            "experience": experience
        }