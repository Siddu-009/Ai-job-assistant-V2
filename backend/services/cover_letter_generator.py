from services.ai_service import ai_chat


def generate_cover_letter(
    resume_text,
    company,
    job_title,
    job_description=""
):

    prompt = f"""
You are an expert HR Recruiter and Professional Resume Writer.

Generate a professional ATS-friendly cover letter.

Candidate Resume:

{resume_text}

Company:

{company}

Job Title:

{job_title}

Job Description:

{job_description}

Instructions:

1. Write a professional cover letter.
2. Mention ONLY the skills relevant to the Job Description.
3. Do NOT mention technologies not present in the resume or JD.
4. Mention why the candidate is suitable.
5. Mention enthusiasm for joining {company}.
6. Keep it between 300-450 words.
7. Make it sound human.
8. Return ONLY the cover letter.
"""

    return ai_chat(prompt)