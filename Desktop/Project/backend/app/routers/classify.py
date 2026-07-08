"""Endpoint for AI-based waste image classification."""
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.classifier import classifier
from app.classifier.claude_classifier import ClaudeClassifierError
from app.schemas import ClassificationResult

router = APIRouter(prefix="/api/classify", tags=["classify"])

ALLOWED_MEDIA_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("", response_model=ClassificationResult)
async def classify_waste_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_MEDIA_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type. Please upload a JPEG, PNG, WEBP, or GIF image.",
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image is too large. Max size is 10MB.")

    try:
        result = classifier.classify(image_bytes, file.content_type)
    except ClaudeClassifierError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 - surface unexpected errors safely
        raise HTTPException(status_code=500, detail="Unexpected error while classifying the image.") from exc

    return result
