def generate_roadmap(skills, target_role):

    roadmap = f"""
Target Role: {target_role}

Current Skills:
{skills}

30 Days:
- Linux Administration
- Git & GitHub
- Docker Fundamentals

60 Days:
- Kubernetes
- Terraform
- Jenkins CI/CD

90 Days:
- AWS EKS
- ArgoCD
- Monitoring with Prometheus & Grafana

Certifications:
- AWS Cloud Practitioner
- AWS Solutions Architect Associate

Projects:
- CI/CD Pipeline
- Kubernetes Deployment
- Terraform Infrastructure Automation
"""

    return roadmap
