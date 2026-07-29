CATEGORIES = {
    "Cloud": [
        "AWS",
        "Azure",
        "GCP",
        "Google Cloud",
        "CloudWatch",
        "IAM",
        "VPC",
        "EC2",
        "S3",
        "RDS",
        "Route53",
        "EKS",
        "AKS",
    ],

    "Containers & Orchestration": [
        "Docker",
        "Docker Compose",
        "Docker Swarm",
        "Kubernetes",
        "Helm",
        "Kind",
        "Minikube",
        "OpenShift",
        "ArgoCD",
    ],

    "CI/CD": [
        "Jenkins",
        "GitHub Actions",
        "GitLab CI",
        "Azure DevOps",
        "CircleCI",
        "TeamCity",
    ],

    "Infrastructure as Code": [
        "Terraform",
        "CloudFormation",
        "Ansible",
        "Pulumi",
    ],

    "Monitoring": [
        "Prometheus",
        "Grafana",
        "ELK",
        "Elasticsearch",
        "Kibana",
        "CloudWatch",
    ],

    "Programming": [
        "Python",
        "Bash",
        "Shell",
        "Java",
        "Go",
    ],

    "Version Control": [
        "Git",
        "GitHub",
        "Bitbucket",
    ],

    "Databases": [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Redis",
    ],
}

def classify_skills(skills):

    grouped = {}

    remaining = []

    for skill in skills:

        found = False

        for category, values in CATEGORIES.items():

            if any(v.lower() in skill.lower() for v in values):

                grouped.setdefault(category, []).append(skill)

                found = True

                break

        if not found:

            remaining.append(skill)

    if remaining:

        grouped["Other"] = remaining

    return grouped