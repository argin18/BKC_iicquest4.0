"""Predictive analytics endpoints for forecasting and anomaly detection."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.predictive_analytics_service import predictive_service
from app.core.logging import logger

router = APIRouter()


@router.get("/forecast/consumption")
async def forecast_consumption(
    days_ahead: int = Query(default=7, ge=1, le=30),
    db: AsyncSession = Depends(get_db),
):
    """Forecast energy consumption for the next N days based on historical patterns."""
    try:
        forecast = await predictive_service.forecast_consumption(db, days_ahead=days_ahead)
        return forecast
    except Exception as e:
        logger.error("forecast_consumption_endpoint_error", error=str(e))
        return {"error": str(e)}


@router.get("/health/{device_id}")
async def predict_device_health(
    device_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Predict device health and maintenance needs."""
    try:
        prediction = await predictive_service.get_device_health_prediction(db, device_id)
        if not prediction:
            return {"error": "Device not found", "device_id": device_id}
        return prediction
    except Exception as e:
        logger.error("health_prediction_error", device_id=device_id, error=str(e))
        return {"error": str(e), "device_id": device_id}


@router.get("/anomalies")
async def detect_anomalies(db: AsyncSession = Depends(get_db)):
    """Detect anomalous consumption patterns and unusual behavior."""
    try:
        anomalies = await predictive_service.get_anomaly_detection(db)
        return anomalies
    except Exception as e:
        logger.error("anomaly_detection_endpoint_error", error=str(e))
        return {"anomalies": [], "error": str(e)}


@router.get("/optimization-potential")
async def get_optimization_potential(db: AsyncSession = Depends(get_db)):
    """Calculate potential energy savings based on consumption patterns."""
    try:
        potential = await predictive_service.get_optimization_potential(db)
        return potential
    except Exception as e:
        logger.error("optimization_potential_endpoint_error", error=str(e))
        return {
            "total_savings_potential_pct": 20,
            "error": str(e),
        }
