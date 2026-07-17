from services.ai_service import ai_chat


def generate_roadmap(target_role):

    prompt = f"""
You are an Expert Career Mentor.

Generate a COMPLETE career roadmap for someone who wants to become a:

{target_role}

Do NOT assume the user has any previous experience.

Create a roadmap specifically for "{target_role}" only.

Return in this exact format:

# Current Level

# Required Skills

# 30 Days

# 60 Days

# 90 Days

# Projects

# Certifications

# Interview Preparation

# Salary Range (India)

# Top Companies Hiring

Make the roadmap specific to the selected career.

Examples:

If role is MERN Stack Developer:
- MongoDB
- Express.js
- React
- Node.js
- JWT
- Redux
- REST APIs

If role is DevOps Engineer:
- Linux
- AWS
- Docker
- Kubernetes
- Terraform
- Jenkins

If role is Data Scientist:
- Python
- Pandas
- NumPy
- Machine Learning
- TensorFlow

Return ONLY the roadmap.
"""

    return ai_chat(prompt)