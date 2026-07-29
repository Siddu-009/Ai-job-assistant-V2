import json
import re


def parse_ai_resume(response):

    match = re.search(
        r"\{.*\}",
        response,
        re.DOTALL
    )

    if not match:
        raise ValueError(
            "AI did not return JSON."
        )

    return json.loads(match.group())