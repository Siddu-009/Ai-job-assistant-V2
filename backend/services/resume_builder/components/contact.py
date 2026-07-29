from ..helpers import add_heading, add_text


def render_contact(container, data):

    personal = data.get("personal_info", {})

    email = (
        personal.get("email")
        or data.get("email")
        or ""
    )

    phone = (
        personal.get("phone")
        or data.get("phone")
        or ""
    )

    linkedin = (
        personal.get("linkedin")
        or data.get("linkedin")
        or ""
    )

    github = (
        personal.get("github")
        or data.get("github")
        or ""
    )

    portfolio = (
        personal.get("portfolio")
        or data.get("portfolio")
        or ""
    )

    location = (
        personal.get("location")
        or data.get("location")
        or ""
    )

    add_heading(container, "Contact")

    if phone:
        add_text(container, phone)

    if email:
        add_text(container, email)

    if location:
        add_text(container, location)

    if linkedin:
        add_text(container, linkedin)

    if github:
        add_text(container, github)

    if portfolio:
        add_text(container, portfolio)