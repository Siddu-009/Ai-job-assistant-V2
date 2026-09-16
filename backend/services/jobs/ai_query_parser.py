import re

from services.jobs.role_mapper import expand_role
from services.jobs.location_ranker import expand_location


def parse_query(query: str):

    if not query:
        return {
            "keyword": "",
            "location": "",
            "experience": "",
            "remote": False
        }

    query = query.strip()

    result = {
        "keyword": "",
        "location": "",
        "experience": "",
        "remote": False
    }

    lower_query = query.lower()

    # ----------------------------
    # Remote Detection
    # ----------------------------

    if any(word in lower_query for word in [
        "remote",
        "wfh",
        "work from home"
    ]):
        result["remote"] = True

    # ----------------------------
    # Experience Detection
    # ----------------------------

    exp = re.search(
        r"(\d+)\s*(year|years|yr|yrs)",
        lower_query
    )

    if exp:
        result["experience"] = exp.group(1)

    elif "fresher" in lower_query:
        result["experience"] = "0"

    # ----------------------------
    # Location Detection
    # ----------------------------

    for city in [

        "hyderabad",
        "bangalore",
        "bengaluru",
        "chennai",
        "pune",
        "mumbai",
        "delhi",
        "noida",
        "gurgaon",
        "gurugram",
        "visakhapatnam",
        "vizag",
        "vijayawada",
        "kochi",
        "kolkata"

    ]:

        if city in lower_query:

            result["location"] = city

            break

    # ----------------------------
    # Keyword Detection
    # ----------------------------

    cleaned = lower_query

    words_to_remove = [

        "jobs",
        "job",
        "for",
        "in",
        "at",
        "remote",
        "wfh",
        "work",
        "from",
        "home",
        "fresher"

    ]

    if result["location"]:
        cleaned = cleaned.replace(
            result["location"],
            ""
        )

    for word in words_to_remove:
        cleaned = cleaned.replace(word, "")

    cleaned = " ".join(cleaned.split())

    result["keyword"] = cleaned

    return result