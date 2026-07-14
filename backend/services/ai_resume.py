from services.ai_service import ai_chat


def generate_resume(master_resume, job_description=None):

    prompt = f"""
You are an Expert ATS Resume Writer with 15+ years of experience.

Your task is to COMPLETELY rewrite and improve the resume below.

VERY IMPORTANT RULES

- Do NOT copy the original resume.
- Rewrite every sentence professionally.
- Rewrite every bullet point.
- Improve grammar.
- Improve readability.
- Improve formatting.
- Use strong action verbs.
- Add ATS keywords naturally.
- Remove duplicate content.
- Do NOT invent fake experience.
- Do NOT invent fake companies.
- Do NOT invent fake certifications.
- Keep all existing technologies.
- Keep all projects.
- Keep all education details.
- Keep all certifications.
- Do NOT include explanations.
- Return ONLY the final resume.

The final resume MUST follow this structure.

================================================

FULL NAME

Job Title

Contact Information

PROFESSIONAL SUMMARY

TECHNICAL SKILLS

PROFESSIONAL PROJECTS

CERTIFICATIONS

EDUCATION

STRENGTHS

ATS IMPROVEMENTS MADE

ESTIMATED ATS SCORE

================================================

Resume

{master_resume}

Rewrite the resume completely.
"""

    result = ai_chat(prompt)

    return result