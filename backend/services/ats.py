COMMON_KEYWORDS = [

    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "linux",
    "ansible",
    "git",
    "python",
    "java",
    "react",
    "node",
    "sql",
    "azure",
    "gcp",
    "helm",
    "argocd",
    "prometheus",
    "grafana"

]


def calculate_ats_score(
    resume_text,
    job
):

    resume = (resume_text or "").lower()

    job_text = " ".join([

        str(job.get("title","")),
        str(job.get("description","")),
        str(job.get("skills",""))

    ]).lower()

    total = 0
    found = 0

    missing = []

    for keyword in COMMON_KEYWORDS:

        if keyword in job_text:

            total += 1

            if keyword in resume:

                found += 1

            else:

                missing.append(keyword)

    if total == 0:

        score = 60

    else:

        score = int(found / total * 100)

    return {

        "score": score,

        "missing": missing

    }