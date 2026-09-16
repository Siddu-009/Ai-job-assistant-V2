ROLE_MAPPING = {

    # =====================================================
    # DEVOPS
    # =====================================================

    "devops": [
        "DevOps",
        "DevOps Engineer",
        "Senior DevOps Engineer",
        "Junior DevOps Engineer",
        "AWS DevOps Engineer",
        "Azure DevOps Engineer",
        "Cloud Engineer",
        "Cloud Infrastructure Engineer",
        "Infrastructure Engineer",
        "Infrastructure Automation Engineer",
        "Platform Engineer",
        "Platform Reliability Engineer",
        "Site Reliability Engineer",
        "SRE",
        "Systems Engineer",
        "Linux Engineer",
        "Cloud Operations Engineer",
        "Build Engineer",
        "Release Engineer",
        "CI/CD Engineer",
        "Kubernetes Engineer",
        "Docker Engineer",
        "Automation Engineer"
    ],

    "aws": [
        "AWS Engineer",
        "AWS Administrator",
        "Cloud Engineer",
        "Cloud Administrator",
        "Cloud Support Engineer",
        "Infrastructure Engineer",
        "DevOps Engineer"
    ],

    "azure": [
        "Azure Engineer",
        "Azure Administrator",
        "Cloud Engineer",
        "DevOps Engineer"
    ],

    "gcp": [
        "Google Cloud Engineer",
        "GCP Engineer",
        "Cloud Engineer"
    ],

    "docker": [
        "Docker Engineer",
        "Container Engineer",
        "DevOps Engineer",
        "Platform Engineer"
    ],

    "kubernetes": [
        "Kubernetes Engineer",
        "Container Platform Engineer",
        "Platform Engineer",
        "SRE",
        "DevOps Engineer"
    ],

    "terraform": [
        "Terraform Engineer",
        "Infrastructure Engineer",
        "Cloud Engineer",
        "DevOps Engineer"
    ],

    "ansible": [
        "Automation Engineer",
        "Configuration Engineer",
        "DevOps Engineer"
    ],

    "linux": [
        "Linux Engineer",
        "System Administrator",
        "Systems Engineer",
        "DevOps Engineer"
    ],

    # =====================================================
    # PYTHON
    # =====================================================

    "python": [
        "Python Developer",
        "Backend Developer",
        "Backend Engineer",
        "Software Engineer",
        "Django Developer",
        "Flask Developer",
        "FastAPI Developer",
        "API Developer",
        "Machine Learning Engineer",
        "AI Engineer"
    ],

    # =====================================================
    # JAVA
    # =====================================================

    "java": [
        "Java Developer",
        "Spring Boot Developer",
        "Backend Java Developer",
        "Java Software Engineer",
        "Backend Engineer"
    ],

    # =====================================================
    # FRONTEND
    # =====================================================

    "react": [
        "React Developer",
        "Frontend Developer",
        "Frontend Engineer",
        "ReactJS Developer",
        "Next.js Developer",
        "UI Developer"
    ],

    # =====================================================
    # FULL STACK
    # =====================================================

    "full stack": [
        "Full Stack Developer",
        "Software Engineer",
        "Backend Developer",
        "Frontend Developer"
    ],

    # =====================================================
    # DATA
    # =====================================================

    "data science": [
        "Data Scientist",
        "Machine Learning Engineer",
        "AI Engineer",
        "Data Analyst",
        "Business Intelligence Engineer"
    ],

    "data engineer": [
        "Data Engineer",
        "Big Data Engineer",
        "ETL Engineer",
        "Spark Engineer",
        "Analytics Engineer"
    ],

    # =====================================================
    # TESTING
    # =====================================================

    "testing": [
        "QA Engineer",
        "Software Tester",
        "Automation Tester",
        "SDET",
        "QA Analyst"
    ],

    # =====================================================
    # NETWORK
    # =====================================================

    "network": [
        "Network Engineer",
        "Network Administrator",
        "Infrastructure Engineer"
    ],

    # =====================================================
    # SECURITY
    # =====================================================

    "security": [
        "Security Engineer",
        "Cyber Security Engineer",
        "Cloud Security Engineer",
        "SOC Analyst"
    ],

    # =====================================================
    # MECHANICAL
    # =====================================================

    "mechanical": [
        "Mechanical Engineer",
        "Design Engineer",
        "Production Engineer",
        "Maintenance Engineer",
        "Quality Engineer",
        "CAD Engineer"
    ],

    # =====================================================
    # CIVIL
    # =====================================================

    "civil": [
        "Civil Engineer",
        "Site Engineer",
        "Construction Engineer",
        "Structural Engineer"
    ],

    # =====================================================
    # ELECTRICAL
    # =====================================================

    "electrical": [
        "Electrical Engineer",
        "Electronics Engineer",
        "Power Systems Engineer",
        "Control Engineer"
    ]
}


def expand_role(role: str):

    if not role:
        return []

    role = role.lower().strip()

    if role in ROLE_MAPPING:
        return ROLE_MAPPING[role]

    return [role]