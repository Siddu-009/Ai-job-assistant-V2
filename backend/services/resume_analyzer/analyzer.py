from .scoring import calculate_score
from .strengths import get_strengths
from .weaknesses import get_weaknesses
from .suggestions import generate_suggestions
from .section_checker import check_sections
from .ats_score import calculate_ats_score
from .ai_suggestions import generate_ai_suggestions
from .job_match import match_job_description

def analyze_resume_for_job(data, job_description):

    analysis = analyze_resume(
        data
    )

    job_match = match_job_description(
        data,
        job_description
    )

    analysis["job_match"] = job_match

    analysis["suggestions"] = generate_ai_suggestions(
        data,
        job_match
    )

    return analysis


def analyze_resume(data):

    ats = calculate_ats_score(data)

    return {
        "overall_score": calculate_score(data),
        "ats_score": ats["score"],
        "ats_breakdown": ats["details"],
        "strengths": get_strengths(data),
        "weaknesses": get_weaknesses(data),
        "suggestions": generate_ai_suggestions(data),
        "missing_sections": check_sections(data),
    }