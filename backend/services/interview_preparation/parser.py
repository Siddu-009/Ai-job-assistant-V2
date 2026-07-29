import json
import re


def parse_questions(response):

    match = re.search(
        r"\{.*\}",
        response,
        re.DOTALL
    )

    if not match:
        raise ValueError(
            "AI did not return valid JSON."
        )

    return json.loads(match.group())