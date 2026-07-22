from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from xml.sax.saxutils import escape

def create_pdf(content, output_file):
    doc = SimpleDocTemplate(output_file)
    styles = getSampleStyleSheet()
    story = []

    for line in content.splitlines():
        safe_line = escape(line)
        story.append(Paragraph(safe_line, styles["BodyText"]))
        story.append(Spacer(1, 6))

    doc.build(story)