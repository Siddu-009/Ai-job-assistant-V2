import requests

OLLAMA_URL = "http://host.docker.internal:11434/api/generate"
MODEL = "gemma3:1b"


def chat(prompt: str):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=300
    )

    response.raise_for_status()

    return response.json()["response"]
