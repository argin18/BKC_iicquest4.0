import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import auth, devices, readings, analytics, recommendations, reports, websocket, predictive, analytics_analysis
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import CustomException, global_exception_handler
from app.core.seed import seed_db
from app.services.simulator.energy_simulator import simulator

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await seed_db()
    except Exception as exc:
        logger.error("seeding_failed", error=str(exc))
    await simulator.start()
    yield
    simulator.stop()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="AI-Powered Energy Infrastructure Optimization Platform API",
    lifespan=lifespan,
    # Disable docs in production
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
)

# ── CORS ────────────────────────────────────────────────────────────────────
# Use explicit origins from config instead of wildcard "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ── Timing middleware ────────────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}"
    return response


# ── Exception handlers ───────────────────────────────────────────────────────
app.add_exception_handler(CustomException, global_exception_handler)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )


# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(devices.router, prefix="/api/v1/devices", tags=["Devices"])
app.include_router(readings.router, prefix="/api/v1/readings", tags=["Readings"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(analytics_analysis.router, prefix="/api/v1/analytics/ai", tags=["AI Analysis"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(predictive.router, prefix="/api/v1/predictive", tags=["Predictive Analytics"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSockets"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "environment": settings.ENVIRONMENT}
