from services.resume_parser import parse_resume


def build_resume(
    resume_text,
    job
):

    sections = parse_resume(
        resume_text
    )

    resume = f"""

# PROFESSIONAL SUMMARY

{sections["summary"]}

# TECHNICAL SKILLS

{sections["skills"]}

# PROJECTS

{sections["projects"]}

# EXPERIENCE

{sections["experience"]}

# EDUCATION

{sections["education"]}

"""

    return resume