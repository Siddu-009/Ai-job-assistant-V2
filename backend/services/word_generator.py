from docxtpl import DocxTemplate
from pathlib import Path
import uuid

TEMPLATE_DIR = Path("services/templates")
OUTPUT_DIR = Path("generated_resumes")

OUTPUT_DIR.mkdir(exist_ok=True)


def format_skills(skills):
    if not skills:
        return ""

    return "\n".join([f"• {skill}" for skill in skills])


def format_experience(experience):

    if not experience:
        return ""

    if isinstance(experience, str):
        return experience

    output = []

    for exp in experience:

        if isinstance(exp, dict):

            if exp.get("name"):
                output.append(exp["name"])

            if exp.get("title"):
                output.append(exp["title"])

            desc = exp.get("description")

            if isinstance(desc, list):
                for item in desc:
                    output.append(f"• {item}")

            elif desc:
                output.append(f"• {desc}")

            output.append("")

    return "\n".join(output)


def format_projects(projects):

    if not projects:
        return ""

    if isinstance(projects, str):
        return projects

    output = []

    for project in projects:

        if isinstance(project, dict):

            if project.get("name"):
                output.append(project["name"])

            if project.get("tech_stack"):

                output.append(
                    "Technologies: "
                    + ", ".join(project["tech_stack"])
                )

            if project.get("description"):

                output.append(
                    f"• {project['description']}"
                )

            output.append("")

    return "\n".join(output)


def format_education(education):

    if not education:
        return ""

    if isinstance(education, str):
        return education

    output = []

    for edu in education:

        if isinstance(edu, dict):

            if edu.get("name"):
                output.append(edu["name"])

            if edu.get("institution"):
                output.append(edu["institution"])

            if edu.get("cgpa"):
                output.append(f"CGPA: {edu['cgpa']}")

            if edu.get("year"):
                output.append(f"Year: {edu['year']}")

            output.append("")

    return "\n".join(output)


def format_certifications(certifications):

    if not certifications:
        return ""

    if isinstance(certifications, str):
        return certifications

    return "\n".join(
        [f"• {cert}" for cert in certifications]
    )


def generate_word_resume(
    data,
    template_name="classic"
):

    template_path = TEMPLATE_DIR / f"{template_name}.docx"

    if not template_path.exists():
        raise FileNotFoundError(
            f"Template not found: {template_path}"
        )

    doc = DocxTemplate(str(template_path))

    context = {

        "NAME": data.get("name", ""),

        "TITLE": data.get("title", ""),

        "EMAIL": data.get("email", ""),

        "PHONE": data.get("phone", ""),

        "LINKEDIN": data.get("linkedin", ""),

        "GITHUB": data.get("github", ""),

        "SUMMARY": data.get("summary", ""),

        "SKILLS": format_skills(
            data.get("skills", [])
        ),

        "EXPERIENCE": format_experience(
            data.get("experience", [])
        ),

        "PROJECTS": format_projects(
            data.get("projects", [])
        ),

        "EDUCATION": format_education(
            data.get("education", [])
        ),

        "CERTIFICATIONS": format_certifications(
            data.get("certifications", [])
        ),
    }

    doc.render(context)

    filename = f"{uuid.uuid4()}.docx"

    output_path = OUTPUT_DIR / filename

    doc.save(str(output_path))

    return str(output_path)