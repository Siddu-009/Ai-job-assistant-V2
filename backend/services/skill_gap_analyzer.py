import json
import re

from services.ai_service import ai_chat


COMMON_SKILLS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "go",
    "golang", "rust", "php", "ruby", "kotlin", "swift", "scala", "r",

    # Frontend
    "html", "css", "bootstrap", "tailwind", "react", "nextjs", "next.js",
    "angular", "vue", "svelte", "jquery",

    # Backend
    "node", "nodejs", "express", "django", "flask", "fastapi",
    "spring", "spring boot", "laravel",

    # Databases
    "mysql", "postgresql", "mongodb", "redis", "sqlite",
    "oracle", "sql server", "cassandra", "dynamodb",

    # Cloud
    "aws", "azure", "gcp", "ec2", "s3", "iam", "vpc",
    "eks", "ecs", "rds", "lambda", "cloudfront",
    "route53", "cloudwatch", "elasticache",

    # DevOps
    "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "gitlab", "github actions",
    "argocd", "helm", "prometheus", "grafana",
    "sonarqube", "nexus", "trivy",

    # Linux
    "linux", "ubuntu", "centos", "redhat", "bash",
    "shell", "cron", "systemd",

    # Networking
    "tcp", "udp", "http", "https", "dns",
    "load balancer", "nginx", "apache", "tomcat",

    # APIs
    "rest", "rest api", "graphql",

    # Containers
    "container", "containers", "microservices",

    # Testing
    "testing", "pytest", "junit", "selenium",

    # AI
    "machine learning", "deep learning", "ai", "llm",
    "ollama", "openai", "langchain",

    # Methodologies
    "devops", "agile", "scrum", "kanban",

    # Misc
    "git", "github", "gitlab", "jira", "maven",
    "gradle", "ci/cd", "debugging"
}


def extract_skills(text: str):

    if not text:
        return set()

    text = text.lower()

    found = set()

    for skill in COMMON_SKILLS:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):

            found.add(skill)

    return found

def analyze_skill_gap(resume_text, job_description):

    resume_skills = extract_skills(resume_text)

    job_skills = extract_skills(job_description)

    matched = sorted(
        list(
            resume_skills.intersection(job_skills)
        )
    )

    missing = sorted(
        list(
            job_skills.difference(resume_skills)
        )
    )

    if len(job_skills) == 0:

        score = 0

    else:

        score = round(

            (
                len(matched)
                /
                len(job_skills)
            ) * 100

        )

    # Prevent unrealistic 100% scores
    if score == 100 and len(job_skills) > len(matched):

        score = 95

    # Improve score slightly for strong resumes
    elif score >= 70:

        score = min(score + 5, 95)

    prompt = f"""
You are an Expert Career Coach and ATS Resume Analyzer.

Candidate matched these skills:

{matched}

Candidate is missing these skills:

{missing}

Your job is ONLY to recommend improvements.

Return ONLY valid JSON.

{{
    "recommendations": [],
    "courses": [],
    "certifications": [],
    "interview_topics": [],
    "learning_path": []
}}

Rules:

1. Do NOT calculate score.
2. Do NOT calculate matched skills.
3. Do NOT calculate missing skills.
4. Give exactly FIVE recommendations.
5. Give exactly FIVE courses.
6. Give exactly FIVE certifications.
7. Give exactly FIVE interview topics.
8. Give exactly FIVE learning path items.
9. Return JSON only.
"""
    
    response = ai_chat(prompt)

    print("\n================ AI RESPONSE ================\n")
    print(response)
    print("\n=============================================\n")

    recommendations = {
        "recommendations": [],
        "courses": [],
        "certifications": [],
        "interview_topics": [],
        "learning_path": []
    }

    try:

        cleaned = response.strip()

        # Extract JSON if surrounded by extra text
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start != -1 and end != -1:
            cleaned = cleaned[start:end + 1]

        # If Ollama forgot the last brace
        elif cleaned.startswith("{") and not cleaned.endswith("}"):
            cleaned += "\n}"

        recommendations = json.loads(cleaned)

    except Exception as e:

        print("JSON Parse Error:", e)
        print(response)

            # ---------- Default Values ----------

    recommendations.setdefault("recommendations", [])
    recommendations.setdefault("courses", [])
    recommendations.setdefault("certifications", [])
    recommendations.setdefault("interview_topics", [])
    recommendations.setdefault("learning_path", [])

    if not recommendations["recommendations"]:

        recommendations["recommendations"] = [

            "Strengthen the missing technical skills identified in the job description.",
            "Build at least two real-world projects using the required technologies.",
            "Practice coding and problem-solving regularly.",
            "Improve resume keywords for ATS compatibility.",
            "Prepare scenario-based interview questions."

        ]

    if not recommendations["courses"]:

        recommendations["courses"] = [

            "AWS Cloud Practitioner",
            "Docker & Kubernetes Bootcamp",
            "Terraform for Beginners",
            "Python Advanced Programming",
            "Jenkins CI/CD Pipeline"

        ]

    if not recommendations["certifications"]:

        recommendations["certifications"] = [

            "AWS Certified Cloud Practitioner",
            "AWS Certified Developer Associate",
            "Docker Certified Associate",
            "Certified Kubernetes Administrator (CKA)",
            "HashiCorp Terraform Associate"

        ]

    if not recommendations["interview_topics"]:

        recommendations["interview_topics"] = [

            "Python Programming",
            "Docker",
            "Kubernetes",
            "Terraform",
            "AWS Services"

        ]

    if not recommendations["learning_path"]:

        recommendations["learning_path"] = [

            "Linux Fundamentals",
            "Git & GitHub",
            "Docker",
            "Kubernetes",
            "AWS"

        ]

    return {

        "match_score": score,

        "matched_skills": matched,

        "missing_skills": missing,

        "recommendations": recommendations.get(
            "recommendations",
            []
        ),

        "courses": recommendations.get(
            "courses",
            []
        ),

        "certifications": recommendations.get(
            "certifications",
            []
        ),

        "interview_topics": recommendations.get(
            "interview_topics",
            []
        ),

        "learning_path": recommendations.get(
            "learning_path",
            []
        )

    }