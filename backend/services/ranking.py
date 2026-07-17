SKILLS = [

    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "linux",
    "ansible",
    "python",
    "java",
    "react",
    "node",
    "sql",
    "azure",
    "gcp",
    "devops",
    "git",
    "github",
    "helm",
    "argocd",
    "prometheus",
    "grafana"

]


def rank_jobs(jobs, keyword=""):

    keyword = keyword.lower()

    ranked = []

    for job in jobs:

        score = 0

        text = " ".join([

            str(job.get("title", "")),
            str(job.get("description", "")),
            str(job.get("skills", "")),
            str(job.get("company", ""))

        ]).lower()

        if keyword:

            if keyword in text:
                score += 70

        for skill in SKILLS:

            if skill in text:
                score += 5

        job["match_score"] = min(score, 100)

        ranked.append(job)

    ranked.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return ranked