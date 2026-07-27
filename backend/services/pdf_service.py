from pathlib import Path
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def generate_pdf(content: str, output_path: Path):
    """
    Generate a PDF from plain text content.
    """

    # Optional: register Arial if available
    try:
        pdfmetrics.registerFont(TTFont("Arial", "Arial.ttf"))
        font_name = "Arial"
    except Exception:
        font_name = "Helvetica"

    styles = getSampleStyleSheet()

    style = styles["Normal"]
    style.fontName = font_name
    style.leading = 18

    doc = SimpleDocTemplate(str(output_path))

    story = []

    for line in content.split("\n"):
        if line.strip():
            story.append(Paragraph(line.replace(" ", "&nbsp;"), style))
        else:
            story.append(Paragraph("<br/>", style))

    doc.build(story)