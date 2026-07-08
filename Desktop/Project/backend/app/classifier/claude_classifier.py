"""Waste classifier backed by the Anthropic Claude vision API."""
import json
import os
import re

import anthropic

from app.classifier.base import WasteClassifier
from app.config import MATERIAL_TYPES, CONDITIONS
from app.schemas import ClassificationResult

CLAUDE_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

SYSTEM_PROMPT = (
    "You are an expert industrial waste auditor. You examine photos of waste "
    "material from factories and classify them for an industrial-symbiosis "
    "marketplace, where one factory's waste becomes another factory's raw "
    "material. Always respond with strict, valid JSON only — no markdown, no "
    "commentary, no code fences."
)

USER_PROMPT = f"""Look at this image of waste material and classify it.

Respond with ONLY a JSON object in exactly this shape:
{{
  "material_type": one of {MATERIAL_TYPES},
  "sub_type": string, a more specific material name (e.g. "PET plastic", "aluminum", "HDPE plastic"),
  "condition": one of {CONDITIONS},
  "confidence": integer 0-100,
  "reuse_suggestions": array of 2-3 short strings suggesting how another factory could reuse this material,
  "estimated_value_note": short string, e.g. "Moderate value if baled and sorted"
}}

Return ONLY the JSON object, nothing else."""


class ClaudeClassifierError(Exception):
    """Raised when the Claude API call or response parsing fails."""


def _extract_json(text: str) -> dict:
    """Pull a JSON object out of a model response, tolerating stray text/fences."""
    text = text.strip()
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence_match:
        text = fence_match.group(1)
    else:
        brace_match = re.search(r"\{.*\}", text, re.DOTALL)
        if brace_match:
            text = brace_match.group(0)
    return json.loads(text)


class ClaudeWasteClassifier(WasteClassifier):
    def __init__(self):
        self._client = None

    @property
    def client(self) -> anthropic.Anthropic:
        if self._client is None:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ClaudeClassifierError(
                    "ANTHROPIC_API_KEY is not set. Add it to your backend .env file."
                )
            self._client = anthropic.Anthropic(api_key=api_key)
        return self._client

    def classify(self, image_bytes: bytes, media_type: str) -> ClassificationResult:
        import base64

        encoded = base64.standard_b64encode(image_bytes).decode("utf-8")

        try:
            response = self.client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": media_type,
                                    "data": encoded,
                                },
                            },
                            {"type": "text", "text": USER_PROMPT},
                        ],
                    }
                ],
            )
        except anthropic.AuthenticationError as exc:
            raise ClaudeClassifierError("Invalid or missing Anthropic API key.") from exc
        except anthropic.APIConnectionError as exc:
            raise ClaudeClassifierError("Could not reach the Anthropic API. Check your network connection.") from exc
        except anthropic.RateLimitError as exc:
            raise ClaudeClassifierError("Anthropic API rate limit exceeded. Please try again shortly.") from exc
        except anthropic.APIStatusError as exc:
            raise ClaudeClassifierError(f"Anthropic API error: {exc.status_code}") from exc

        raw_text = "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        )

        try:
            data = _extract_json(raw_text)
        except (json.JSONDecodeError, AttributeError) as exc:
            raise ClaudeClassifierError("Could not parse a valid classification from the AI response.") from exc

        try:
            return ClassificationResult(
                material_type=data["material_type"],
                sub_type=data["sub_type"],
                condition=data["condition"],
                confidence=int(data["confidence"]),
                reuse_suggestions=data["reuse_suggestions"],
                estimated_value_note=data["estimated_value_note"],
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise ClaudeClassifierError("The AI response was missing expected fields.") from exc
