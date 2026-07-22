import requests

OLLAMA_URL = "http://host.docker.internal:11434/api/generate"


def generate_ats_content(resume_data, job_description):

    prompt = f"""
Rewrite ONLY the professional summary.

Job Description:
{job_description}

Candidate Skills:
{resume_data.get("skills","")}

Candidate Projects:
{resume_data.get("projects","")}

Rules:
- Maximum 4 lines
- Maximum 80 words
- ATS optimized
- No headings
- No explanations
- No markdown
- Return ONLY summary text
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3.2:latest",
            "prompt": prompt,
            "stream": False
        }
    )

    print("=" * 80)
    print("OLLAMA STATUS:", response.status_code)
    print("OLLAMA BODY:")
    print(response.text)
    print("=" * 80)

    response.raise_for_status()

    data = response.json()

    if "response" not in data:
        raise Exception(f"Ollama returned: {data}")

    return data["response"].strip()