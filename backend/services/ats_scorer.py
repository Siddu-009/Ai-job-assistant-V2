KNOWN_SKILLS = [
    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "ansible",
    "linux",
    "github actions",
    "git",
    "python",
    "prometheus",
    "grafana",
    "eks",
    "ec2",
    "s3",
    "iam",
    "route53",
    "rds",
    "argocd",
    "helm",
    "devops"
]


def calculate_ats_score(
    resume_text,
    job_description
):

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    matched = []
    missing = []

    for skill in KNOWN_SKILLS:

        if skill in job_description:

            if skill in resume_text:
                matched.append(skill)
            else:
                missing.append(skill)

    total = len(matched) + len(missing)

    score = 0

    if total > 0:
        score = int(
            (len(matched) / total) * 100
        )

    improvements = []

    for skill in missing:
        improvements.append(
            f"Add project experience with {skill}"
        )

    return {
        "ats_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "improvements": improvements,
        "total_matched": len(matched),
        "total_missing": len(missing)
    }
