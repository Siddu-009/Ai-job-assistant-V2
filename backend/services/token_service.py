from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError

SECRET_KEY = "siddu-devops-ai-job-assistant"
ALGORITHM = "HS256"

def decode_token(token):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None