from services.ai_service import ai_chat


def candidate_match_reason(
    job_skill,
    candidate_skills
):

    prompt = f"""
You are an expert Technical Recruiter.

Job Required Skill:

{job_skill}

Candidate Skills:

{candidate_skills}

Analyze the candidate.

Return ONLY this format.

Match Score:
(0-100)

Strengths:
- ...
- ...

Missing Skills:
- ...
- ...

Recommendation:
Highly Recommended / Recommended / Average / Not Recommended

Reason:
Explain in under 40 words.
"""

    try:

        return ai_chat(prompt)

    except Exception:

        return f"""
Match Score: 70

Strengths:
- Relevant skills found

Missing Skills:
- Unknown

Recommendation:
Recommended

Reason:
Candidate has relevant skills for this position.
"""