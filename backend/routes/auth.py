from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.password_service import (
    hash_password,
    verify_password
)

from services.auth_service import (
    create_access_token
)

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(req: RegisterRequest):

    db = SessionLocal()

    try:

        existing = db.execute(
            text(
                """
                SELECT id
                FROM users
                WHERE email = :email
                """
            ),
            {
                "email": req.email
            }
        ).fetchone()

        if existing:
            return {
                "error": "Email already registered"
            }

        hashed = hash_password(
            req.password
        )

        db.execute(
            text(
                """
                INSERT INTO users
                (
                    name,
                    email,
                    password
                )
                VALUES
                (
                    :name,
                    :email,
                    :password
                )
                """
            ),
            {
                "name": req.name,
                "email": req.email,
                "password": hashed
            }
        )

        db.commit()

        return {
            "message": "User registered successfully"
        }

    finally:
        db.close()


@router.post("/login")
def login(req: LoginRequest):

    db = SessionLocal()

    try:

        result = db.execute(
            text(
                """
                SELECT
                    id,
                    email,
                    password
                FROM users
                WHERE email = :email
                """
            ),
            {
                "email": req.email
            }
        )

        user = result.fetchone()

        if not user:
            return {
                "error": "User not found"
            }

        if not verify_password(
            req.password,
            user[2]
        ):
            return {
                "error": "Invalid password"
            }

        token = create_access_token(
            {
                "user_id": user[0],
                "email": user[1]
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    finally:
        db.close()
