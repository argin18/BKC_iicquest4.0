from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.core.logging import logger

class CustomException(Exception):
    def __init__(self, status_code: int, message: str, details: str = None):
        self.status_code = status_code
        self.message = message
        self.details = details

async def global_exception_handler(request: Request, exc: CustomException):
    logger.error("custom_exception", status_code=exc.status_code, message=exc.message, details=exc.details, path=request.url.path)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "details": exc.details},
    )
