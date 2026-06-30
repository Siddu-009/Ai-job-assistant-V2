from services.ai_service import ai_chat
import json
import re


def extract_skills(text):

    prompt = f"""
Extract all technical skills from the following text.

Include programming languages, cloud, DevOps, databases,
frameworks, operating systems, engineering software,
mechanical tools, electrical tools, civil software,
testing tools, networking tools, AI/ML, ERP, SAP,
cybersecurity, embedded systems and every professional skill.

Return ONLY JSON.

Format:

{{
    "skills":[
        "Python",
        "AWS",
        "Docker"
    ]
}}

Text:

{text}
"""

    response = ai_chat(prompt)

    try:

        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:
            return json.loads(match.group())["skills"]

    except Exception:
        return []

    return []


def analyze_skill_gap(resume_text, job_description):

    resume_skills = extract_skills(resume_text)

    job_skills = extract_skills(job_description)

    resume_set = set(s.lower() for s in resume_skills)
    job_set = set(s.lower() for s in job_skills)

    matched = sorted(
        list(resume_set & job_set)
    )

    missing = sorted(
        list(job_set - resume_set)
    )

    score = 0

    if len(job_set) > 0:
        score = round(
            len(matched) / len(job_set) * 100,
            2
        )

    recommendation_prompt = f"""
The candidate is missing these skills:

{', '.join(missing)}

Suggest:

1. Learning roadmap
2. Best certifications
3. Best online courses
4. Interview topics

Return JSON only.

Format:

{{
"recommendations":[],
"courses":[],
"certifications":[],
"interview_topics":[],
"learning_path":[]
}}
"""

    ai = ai_chat(recommendation_prompt)

    try:

        match = re.search(r"\{.*\}", ai, re.DOTALL)

        if match:

            extra = json.loads(match.group())

        else:

            extra = {}

    except Exception:

        extra = {}

    return {

        "match_score": score,

        "matched_skills": matched,

        "missing_skills": missing,

        "recommendations": extra.get("recommendations", []),

        "courses": extra.get("courses", []),

        "certifications": extra.get("certifications", []),

        "interview_topics": extra.get("interview_topics", []),

        "learning_path": extra.get("learning_path", [])

    }
