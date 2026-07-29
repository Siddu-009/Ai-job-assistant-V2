from services.keyword_extractor import extract_keywords


def analyze_resume(resume_text, job_description):

    keywords = extract_keywords(job_description)

    resume_lower = resume_text.lower()

    matched = []

    missing = []

    for keyword in keywords:

        if keyword.lower() in resume_lower:
            matched.append(keyword)
        else:
            missing.append(keyword)

    total = len(keywords)

    score = 0

    if total > 0:
        score = round(len(matched) / total * 100)

    recommendation = ""

    if missing:
        recommendation = (
            "Consider adding these skills where they genuinely match your experience: "
            + ", ".join(missing[:10])
        )
    else:
        recommendation = (
            "Excellent! Your resume already matches the job description well."
        )

    return {
        "score": score,
        "matchedKeywords": matched,
        "missingKeywords": missing,
        "recommendation": recommendation
    }