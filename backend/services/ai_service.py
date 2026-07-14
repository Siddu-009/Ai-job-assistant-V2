import os
import requests

OLLAMA_URL = (
    os.getenv(
        "OLLAMA_URL",
        "http://host.docker.internal:11434"
    ).rstrip("/") + "/api/chat"
)

MODEL = os.getenv(
    "MODEL_NAME",
    "gemma3:1b"
)


def ai_chat(prompt: str, history=None) -> str:

    if history is None:
        history = []

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert AI Job Assistant and ATS Resume Expert.\n"
                "You help users rewrite, tailor, improve and optimize resumes, "
                "cover letters, interview answers and job applications.\n\n"
                "The resume content provided belongs to the user who submitted it "
                "and they have requested it to be rewritten or improved.\n"
                "Do NOT refuse because the resume contains names, emails, phone numbers "
                "or other personal information supplied by the user.\n"
                "Rewrite and improve the content professionally while preserving the user's information.\n"
                "Return only the requested result without explanations."
            )
        }
    ]

    messages.extend(history)

    messages.append(
        {
            "role": "user",
            "content": prompt
        }
    )

    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "keep_alive": "30m",
        "options": {
            "temperature": 0.1,
            "top_p": 0.9,
            "top_k": 40,
            "num_ctx": 4096,
            "num_predict": 4096,
            "repeat_penalty": 1.05
        }
    }

    try:

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=300
        )

        response.raise_for_status()

        data = response.json()

        if "message" in data:
            return data["message"]["content"].strip()

        return str(data)

    except requests.exceptions.Timeout:
        return "The AI model took too long to respond."

    except requests.exceptions.ConnectionError:
        return "Unable to connect to Ollama."

    except Exception as e:
        return f"AI Error: {str(e)}"