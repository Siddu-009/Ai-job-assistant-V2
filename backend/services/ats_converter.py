import json
import re

from services.ai_service import ai_chat


def convert_to_ats_resume(
    resume_text,
    target_role="",
    target_company=""
):
    prompt = f"""
You are an expert ATS Resume Writer, Resume Parser, HR Recruiter and Career Coach.

Your task is to convert the given resume into a professional ATS-friendly resume while preserving all factual information.

TARGET ROLE
{target_role if target_role else "Not Specified"}

TARGET COMPANY
{target_company if target_company else "Not Specified"}

RESUME

{resume_text}

=================================================================
IMPORTANT RULES
=================================================================

Return ONLY one valid JSON object.

Requirements:
- Preserve factual information.
- Improve grammar.
- Remove duplicate information.
- Do not invent facts.
- Follow exactly the JSON schema below.
- Do not output markdown.
- Do not output explanations.
- If a value is unavailable, use "" or [].
- Return every field from the schema.

=================================================================
SUMMARY GUIDELINES
=================================================================

Generate a professional ATS-friendly summary.

The summary should:

- Mention the profession.
- Mention years of experience if available.
- Mention important technical skills.
- Mention domain expertise.
- Mention strengths.
- Align with the target role.
- Never invent experience.

=================================================================
EXPERIENCE GUIDELINES
=================================================================

Rewrite every experience bullet professionally.

Each bullet should:

- Begin with a strong action verb.
- Describe achievements.
- Preserve original meaning.
- Be ATS friendly.
- Be concise.
- Avoid repetition.

Examples of action verbs:

Designed
Developed
Implemented
Optimized
Configured
Deployed
Automated
Integrated
Monitored
Managed
Built
Reduced
Improved
Created
Led

=================================================================
PROJECT GUIDELINES
=================================================================

Rewrite project descriptions professionally.

Each project should clearly describe:

- Objective
- Technologies used
- Candidate contribution
- Outcome

Do not invent information.

=================================================================
SKILL GUIDELINES
=================================================================

Group skills into meaningful categories.

Possible categories include:

Programming Languages

Frameworks

Cloud Platforms

DevOps Tools

CI/CD

Operating Systems

Databases

Monitoring

Networking

Version Control

Testing

Soft Skills

Do not duplicate skills.

=================================================================
RETURN THIS JSON EXACTLY
=================================================================

{{
    "personal_info": {{
        "name": "",
        "title": "",
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "location": ""
    }},

    "summary": "",

    "skill_categories": [
        {{
            "category": "",
            "skills": []
        }}
    ],

    "experience": [
        {{
            "company": "",
            "designation": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "description": []
        }}
    ],

    "projects": [
        {{
            "name": "",
            "role": "",
            "tech_stack": [],
            "description": []
        }}
    ],

    "education": [
        {{
            "degree": "",
            "institution": "",
            "year": "",
            "cgpa": ""
        }}
    ],

    "certifications": [
        {{
            "name": "",
            "issuer": "",
            "year": ""
        }}
    ],

    "achievements": [],

    "languages": [],

    "interests": []
}}
"""

    response = ai_chat(prompt)

    print("\n========== RAW AI RESPONSE ==========")
    print(response)
    print("=====================================\n")

    response = re.sub(r"```json", "", response, flags=re.IGNORECASE)
    response = re.sub(r"```", "", response)
    response = response.strip()

    match = re.search(r"\{.*\}", response, re.DOTALL)

    if not match:
        raise Exception("No JSON object found in AI response.")

    json_text = match.group()

    try:
        data = json.loads(json_text)
    except Exception as e:
        raise Exception(
            f"Invalid JSON returned by AI.\n\n{json_text}\n\nError: {e}"
        )

    # Ensure required top-level keys always exist
    defaults = {
        "personal_info": {
            "name": "",
            "title": "",
            "email": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "portfolio": "",
            "location": "",
        },
        "summary": "",
        "skill_categories": [],
        "experience": [],
        "projects": [],
        "education": [],
        "certifications": [],
        "achievements": [],
        "languages": [],
        "interests": [],
    }

    for key, value in defaults.items():
        if key not in data or data[key] is None:
            data[key] = value

    return data