from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from services.token_service import decode_token

router = APIRouter()


@router.get("/{document_type}/{token}")
def download_document(document_type: str, token: str):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload["user_id"]

    file_path = (
        Path(__file__).resolve().parent.parent
        / "generated"
        / f"user_{user_id}"
        / f"{document_type}.pdf"
    )

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Document not found")

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/pdf"
    )