"""Abstract interface for waste-image classifiers.

Any classifier implementation (cloud vision LLM, local YOLO model, etc.)
should implement this interface so it can be swapped in without changing
the API layer.
"""
from abc import ABC, abstractmethod

from app.schemas import ClassificationResult


class WasteClassifier(ABC):
    @abstractmethod
    def classify(self, image_bytes: bytes, media_type: str) -> ClassificationResult:
        """Classify a waste image and return a structured result."""
        raise NotImplementedError
