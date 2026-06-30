import requests

LLAMA_URL = "http://host.docker.internal:8080/v1/chat/completions"


def ai_chat(prompt: str):

    payload = {
        "model": "local",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 800
    }

    response = requests.post(
        LLAMA_URL,
        json=payload,
        timeout=180
    )

    response.raise_for_status()

    data = response.json()

    return data["choices"][0]["message"]["content"]
