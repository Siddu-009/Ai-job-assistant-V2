from services.ai_service import ai_chat


def generate_learning_plan(
    resume_text,
    target_role,
    current_level,
    duration
):

    prompt = f"""
You are an Expert Career Coach.

The user wants to become a:

{target_role}

Current Level:
{current_level}

Available Study Duration:
{duration}

IMPORTANT RULES

1. Ignore the user's resume while creating the roadmap.
2. The roadmap MUST be based ONLY on the selected target role.
3. Do NOT recommend skills from unrelated careers.
4. If target_role is "Software Tester", generate ONLY a Software Testing roadmap.
5. If target_role is "Python Developer", generate ONLY a Python Developer roadmap.
6. If target_role is "DevOps Engineer", generate ONLY a DevOps roadmap.
7. If target_role is "Data Analyst", generate ONLY a Data Analyst roadmap.
8. If target_role is "Java Developer", generate ONLY a Java roadmap.
9. Never mix different career paths.
10. Keep the response under 350 words.

Return the response in Markdown.

# Career Overview

# Required Skills

# Weekly Learning Roadmap

# Hands-on Projects

# Recommended Certifications

# Free Learning Resources

# Best YouTube Channels

# Practice Websites

# Interview Preparation

# Expected Salary

# Career Tips
"""

    return ai_chat(prompt)