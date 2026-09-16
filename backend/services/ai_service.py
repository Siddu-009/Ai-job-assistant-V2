import os
import requests
import asyncio


OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_URL",
    "http://host.docker.internal:11434"
).rstrip("/")


OLLAMA_URL = (
    OLLAMA_BASE_URL +
    "/api/chat"
)


MODEL = os.getenv(
    "MODEL_NAME",
    "llama3.2:latest"
)


def ai_chat(
    prompt: str,
    history=None
) -> str:

    if history is None:
        history = []

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert AI Job Assistant "
                "and ATS Resume Expert. "
                "Rewrite and optimize resumes professionally. "
                "Preserve user-provided facts. "
                "Do not invent companies, degrees, "
                "certifications, job titles, dates, "
                "or experience. "
                "Return only the requested result."
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
            "num_predict": 2048,
            "repeat_penalty": 1.05
        }
    }

    print(
        f"Calling Ollama: {OLLAMA_URL}"
    )

    print(
        f"Ollama model: {MODEL}"
    )

    try:

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=300
        )

        print(
            "Ollama HTTP status:",
            response.status_code
        )

        response.raise_for_status()

        data = response.json()

        if "message" not in data:

            raise Exception(
                "Invalid response received from Ollama."
            )

        content = data["message"].get(
            "content",
            ""
        ).strip()

        if not content:

            raise Exception(
                "Ollama returned an empty response."
            )

        return content

    except requests.exceptions.Timeout:

        print(
            "Ollama request timed out."
        )

        return (
            "The AI model took too long to respond."
        )

    except requests.exceptions.ConnectionError as e:

        print(
            "Unable to connect to Ollama:",
            str(e)
        )

        return (
            "Unable to connect to Ollama."
        )

    except requests.exceptions.HTTPError as e:

        print(
            "Ollama HTTP error:",
            str(e)
        )

        return (
            f"AI Error: Ollama returned "
            f"HTTP {response.status_code}"
        )

    except Exception as e:

        print(
            "AI Service Error:",
            str(e)
        )

        return (
            f"AI Error: {str(e)}"
        )


async def call_ai(
    prompt: str,
    history=None
):

    return await asyncio.to_thread(
        ai_chat,
        prompt,
        history
    )