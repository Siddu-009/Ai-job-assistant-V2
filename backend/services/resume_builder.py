from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet


def build_resume(
    name,
    email,
    phone,
    location,
    summary,
    skills,
    education,
    experience,
    projects,
    output_file
):

    doc = SimpleDocTemplate(
        output_file,
        topMargin=20,
        bottomMargin=20,
        leftMargin=30,
        rightMargin=30
    )

    styles = getSampleStyleSheet()

    story = []

    # Header

    story.append(
        Paragraph(
            f"<b><font size=18>{name}</font></b>",
            styles["Title"]
        )
    )

    story.append(
        Paragraph(
            f"{email} | {phone}",
            styles["Normal"]
        )
    )

    if location:

        story.append(
            Paragraph(
                location,
                styles["Normal"]
            )
        )

    story.append(Spacer(1, 12))

    # Summary

    story.append(
        Paragraph(
            "<b>PROFESSIONAL SUMMARY</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            summary.replace("\n", "<br/>"),
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 10))

    # Skills

    story.append(
        Paragraph(
            "<b>TECHNICAL SKILLS</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            skills.replace("\n", "<br/>"),
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 10))

    # Experience

    if experience.strip():

        story.append(
            Paragraph(
                "<b>EXPERIENCE</b>",
                styles["Heading2"]
            )
        )

        story.append(
            Paragraph(
                experience.replace("\n", "<br/>"),
                styles["Normal"]
            )
        )

        story.append(Spacer(1, 10))

    # Projects

    story.append(
        Paragraph(
            "<b>PROJECTS</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            projects.replace("\n", "<br/>"),
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 10))

    # Education

    story.append(
        Paragraph(
            "<b>EDUCATION</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            education.replace("\n", "<br/>"),
            styles["Normal"]
        )
    )

    doc.build(story)
