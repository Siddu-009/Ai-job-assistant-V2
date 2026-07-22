from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from xml.sax.saxutils import escape


def create_simple_pdf(content, output_file, title="Document"):
    doc = SimpleDocTemplate(output_file)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(f"<b><font size=18>{title}</font></b>", styles["Title"])
    )

    story.append(Spacer(1, 15))

    for line in content.splitlines():

        line = escape(line)

        if line.strip():
            story.append(
                Paragraph(line, styles["BodyText"])
            )

        story.append(Spacer(1, 6))

    doc.build(story)