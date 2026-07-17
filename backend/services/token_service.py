from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError

SECRET_KEY = "siddu-devops-ai-job-assistant"
ALGORITHM = "HS256"


def decode_token(token):

    print("Token received:", token)

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("Decoded payload:", payload)

        return payload

    except ExpiredSignatureError as e:

        print("Expired:", e)

        return None

    except JWTError as e:

        print("JWT Error:", e)

        return None