import re


def extract_skills(text: str):

    text = text.lower()

    skills = [

        "aws",
        "docker",
        "kubernetes",
        "terraform",
        "linux",
        "ansible",
        "jenkins",
        "python",
        "java",
        "react",
        "mysql",
        "postgresql",
        "git",
        "github",
        "prometheus",
        "grafana",
        "nginx",
        "apache",
        "helm",
        "argocd",
        "mongodb",
        "redis",
        "azure",
        "gcp"

    ]

    found = []

    for skill in skills:

        if re.search(rf"\b{re.escape(skill)}\b", text):
            found.append(skill)

    return sorted(set(found))