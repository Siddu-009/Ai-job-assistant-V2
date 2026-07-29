import re

COMMON_WORDS = {
    "and", "or", "the", "for", "with", "of",
    "to", "in", "a", "an", "is", "are",
    "will", "should", "must", "experience"
}


def extract_keywords(job_description: str):

    words = re.findall(r"[A-Za-z0-9+#.-]+", job_description)

    keywords = []

    for word in words:

        word = word.strip()

        if len(word) < 3:
            continue

        if word.lower() in COMMON_WORDS:
            continue

        keywords.append(word)

    return list(dict.fromkeys(keywords))