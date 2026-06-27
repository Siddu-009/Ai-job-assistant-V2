import os

from dotenv import load_dotenv

load_dotenv()


class Settings:

    SECRET_KEY = os.getenv("SECRET_KEY")

    DATABASE_URL = os.getenv("DATABASE_URL")

    OLLAMA_URL = os.getenv("OLLAMA_URL")

    MODEL_NAME = os.getenv("MODEL_NAME")

    SMTP_HOST = os.getenv("SMTP_HOST")

    SMTP_PORT = int(

        os.getenv(

            "SMTP_PORT",

            587

        )

    )


settings = Settings()
