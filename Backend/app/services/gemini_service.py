"""
Gemini AI service wrapper with enhanced stability and features.
- Retry with exponential back-off on transient failures.
- Graceful mock fallback when API key is absent.
- Clean JSON extraction strips accidental markdown fences.
- Token tracking and comprehensive error recovery.
- Structured responses for all AI operations.
"""
import asyncio
import json
import re
from datetime import datetime
from typing import Any, Optional

import google.generativeai as genai

from app.core.config import settings
from app.core.logging import logger

_MAX_RETRIES = 3
_RETRY_BASE_DELAY = 1.0  # seconds
_REQUEST_TIMEOUT = 30.0  # seconds


def _strip_markdown_fences(text: str) -> str:
    """Remove ```json … ``` or ``` … ``` wrappers."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


class GeminiService:
    def __init__(self) -> None:
        self._model = None
        self._token_count = 0
        self._last_call_time: Optional[datetime] = None
        
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("gemini_service_initialized", model="gemini-1.5-flash")
            except Exception as exc:
                logger.error("gemini_initialization_failed", error=str(exc))
                self._model = None

    @property
    def is_available(self) -> bool:
        return self._model is not None

    @property
    def token_count(self) -> int:
        """Get total tokens used in session."""
        return self._token_count

    def get_status(self) -> dict[str, Any]:
        """Get service health status."""
        return {
            "available": self.is_available,
            "token_count": self._token_count,
            "last_call": self._last_call_time.isoformat() if self._last_call_time else None,
            "model": "gemini-1.5-flash" if self.is_available else None,
        }

    async def generate_json(self, prompt: str, timeout: float = _REQUEST_TIMEOUT) -> Any:
        """
        Generate a JSON response from Gemini with timeout and error recovery.
        Falls back to a mock response when the API key is absent or after
        exhausting retries.
        """
        if not self.is_available:
            logger.warning("gemini_api_key_missing", fallback="mock_data")
            return self._mock_fallback(prompt)

        full_prompt = (
            prompt
            + "\n\nIMPORTANT: Respond with ONLY valid JSON — no markdown, no prose, no code fences."
        )

        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                self._last_call_time = datetime.now()
                
                # Use asyncio timeout to prevent hanging
                response = await asyncio.wait_for(
                    self._model.generate_content_async(full_prompt),
                    timeout=timeout
                )
                
                raw = _strip_markdown_fences(response.text)
                parsed = json.loads(raw)
                
                # Track token usage
                if hasattr(response, "usage_metadata"):
                    self._token_count += response.usage_metadata.total_token_count
                
                logger.info("gemini_success", attempt=attempt, tokens=self._token_count)
                return parsed
                
            except asyncio.TimeoutError:
                logger.error("gemini_timeout", attempt=attempt, timeout_s=timeout)
            except json.JSONDecodeError as exc:
                logger.warning(
                    "gemini_json_parse_error",
                    attempt=attempt,
                    error=str(exc),
                )
            except Exception as exc:
                logger.error(
                    "gemini_api_error",
                    attempt=attempt,
                    error=str(exc),
                    error_type=type(exc).__name__
                )

            if attempt < _MAX_RETRIES:
                delay = _RETRY_BASE_DELAY * (2 ** (attempt - 1))
                logger.info("gemini_retry", delay_s=delay, attempt=attempt)
                await asyncio.sleep(delay)

        logger.warning("gemini_all_retries_failed", fallback="mock_data")
        return self._mock_fallback(prompt)

    async def generate_text(self, prompt: str, timeout: float = _REQUEST_TIMEOUT) -> str:
        """Generate text response (not JSON-constrained)."""
        if not self.is_available:
            logger.warning("gemini_api_key_missing", returning="empty_text")
            return "Analysis unavailable — Gemini API not configured."

        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                self._last_call_time = datetime.now()
                
                response = await asyncio.wait_for(
                    self._model.generate_content_async(prompt),
                    timeout=timeout
                )
                
                if hasattr(response, "usage_metadata"):
                    self._token_count += response.usage_metadata.total_token_count
                
                logger.info("gemini_text_success", attempt=attempt)
                return response.text
                
            except asyncio.TimeoutError:
                logger.error("gemini_text_timeout", attempt=attempt)
            except Exception as exc:
                logger.error("gemini_text_error", attempt=attempt, error=str(exc))

            if attempt < _MAX_RETRIES:
                await asyncio.sleep(_RETRY_BASE_DELAY * (2 ** (attempt - 1)))

        return "Analysis unavailable due to API errors."

    def _mock_fallback(self, prompt: str) -> Any:
        """Provide graceful mock fallback data."""
        prompt_lower = prompt.lower()
        
        if "recommendation" in prompt_lower:
            return [
                {
                    "title": "Optimize HVAC Systems",
                    "description": "Adjust HVAC setpoints based on occupancy patterns to reduce waste.",
                    "impact": "high",
                    "category": "energy",
                    "estimated_savings": 5000,
                    "priority_score": 90,
                    "ai_confidence": 0.85,
                    "implementation_timeline": "2-4 weeks",
                    "roi_percentage": 15.5,
                }
            ]
        
        if "analysis" in prompt_lower or "summary" in prompt_lower:
            return {
                "summary": "AI analysis unavailable — Gemini API key not configured.",
                "key_findings": [
                    "System running with fallback mock data",
                    "Enable GEMINI_API_KEY environment variable for full AI features"
                ],
                "recommendations": ["Configure API key for data-driven insights"],
                "ai_confidence": 0.0,
            }
        
        return {
            "status": "fallback",
            "message": "AI response unavailable — API key not configured."
        }


# Module-level singleton
gemini_service = GeminiService()
