from ..helpers import add_heading, add_text


def render_summary(container, data):

    summary = data.get("summary", "")

    if not summary:
        return

    add_heading(
        container,
        "Professional Summary"
    )

    add_text(
        container,
        summary
    )