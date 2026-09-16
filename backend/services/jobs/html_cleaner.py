import html
import re


def clean_html(text: str) -> str:

    if not text:
        return ""

    # Decode HTML entities
    text = html.unescape(text)

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Remove multiple spaces/newlines
    text = re.sub(r"\s+", " ", text)

    return text.strip()