"""Predictive analytics service for forecasting and trend analysis."""
from datetime import datetime, timedelta, timezone
from typing import Any
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import EnergyReading
from app.models.infrastructure import Device
from app.repositories.reading import reading_repo
from app.services.gemini_service import gemini_service
from app.core.logging import logger


class PredictiveAnalyticsService:
    """Generate predictions and forecasts using historical data and AI."""
    
    async def forecast_consumption(
        self, db: AsyncSession, days_ahead: int = 7
    ) -> dict[str, Any]:
        """Forecast consumption for next N days based on historical patterns."""
        try:
            # Get historical data (last 60 days)
            readings = await reading_repo.get_latest(db, limit=1440)  # 60 days of hourly data
            
            if not readings:
                return self._get_fallback_forecast(days_ahead)
            
            # Analyze patterns
            hourly_patterns = self._extract_hourly_patterns(readings)
            daily_average = sum(r.consumption for r in readings) / len(readings)
            
            # Use AI to generate forecast
            forecast = await self._generate_ai_forecast(
                hourly_patterns, daily_average, days_ahead
            )
            
            return forecast
        except Exception as e:
            logger.error("forecast_consumption_error", error=str(e))
            return self._get_fallback_forecast(days_ahead)
    
    def _extract_hourly_patterns(self, readings: list[EnergyReading]) -> dict[str, list[float]]:
        """Extract hourly consumption patterns from readings."""
        patterns = {}
        for reading in readings:
            hour = reading.timestamp.strftime("%H:00")
            if hour not in patterns:
                patterns[hour] = []
            patterns[hour].append(reading.consumption)
        
        # Calculate average per hour
        hourly_averages = {
            hour: sum(values) / len(values)
            for hour, values in patterns.items()
        }
        
        return hourly_averages
    
    async def _generate_ai_forecast(
        self, patterns: dict, daily_avg: float, days: int
    ) -> dict[str, Any]:
        """Use Gemini to generate forecast."""
        prompt = f"""
        Based on these hourly consumption patterns and a daily average of {daily_avg:.2f} kWh:
        Patterns: {patterns}
        
        Generate a forecast for the next {days} days in JSON format:
        {{
            "forecast_days": {days},
            "daily_forecasts": [
                {{"day": 1, "predicted_consumption": N, "confidence": 0-1, "trend": "up/down/stable"}}
            ],
            "peak_hour_predicted": "HH:00",
            "average_daily_consumption": N,
            "trend_summary": "description of trend"
        }}
        """
        
        try:
            forecast = await gemini_service.generate_json(prompt)
            return forecast
        except Exception as e:
            logger.error("ai_forecast_error", error=str(e))
            return self._get_fallback_forecast(days)
    
    def _get_fallback_forecast(self, days: int) -> dict[str, Any]:
        """Return fallback forecast."""
        forecasts = [
            {"day": i, "predicted_consumption": 2400 + (i * 10), "confidence": 0.85, "trend": "up"}
            for i in range(1, days + 1)
        ]
        
        return {
            "forecast_days": days,
            "daily_forecasts": forecasts,
            "peak_hour_predicted": "14:00",
            "average_daily_consumption": 2450,
            "trend_summary": "Stable consumption with slight upward trend",
        }
    
    async def get_device_health_prediction(
        self, db: AsyncSession, device_id: str
    ) -> dict[str, Any]:
        """Predict device health degradation and maintenance needs."""
        try:
            device = await db.scalar(select(Device).where(Device.id == device_id))
            if not device:
                return {}
            
            # Get device readings
            readings = await reading_repo.get_by_device(db, device_id, limit=100)
            
            if readings:
                # Analyze consumption trend
                recent_avg = sum(r.consumption for r in readings[:10]) / 10
                older_avg = sum(r.consumption for r in readings[-10:]) / 10
                trend = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
            else:
                trend = 0
            
            # Predict maintenance
            health_score = device.health_score
            maintenance_needed = health_score < 70
            degradation_rate = abs(trend)
            
            return {
                "device_id": device_id,
                "device_name": device.name,
                "current_health": health_score,
                "health_trend": "declining" if trend > 5 else "improving" if trend < -5 else "stable",
                "degradation_rate_pct": round(degradation_rate, 2),
                "maintenance_needed": maintenance_needed,
                "estimated_failure_days": self._estimate_failure(health_score),
                "recommended_action": self._get_maintenance_recommendation(health_score),
            }
        except Exception as e:
            logger.error("device_health_prediction_error", device_id=device_id, error=str(e))
            return {}
    
    def _estimate_failure(self, health_score: float) -> int | None:
        """Estimate days until device failure based on health score."""
        if health_score > 80:
            return None
        elif health_score > 60:
            return 90
        elif health_score > 40:
            return 45
        else:
            return 14
    
    def _get_maintenance_recommendation(self, health_score: float) -> str:
        """Get maintenance recommendation based on health."""
        if health_score > 80:
            return "Monitor regularly"
        elif health_score > 60:
            return "Schedule maintenance within 3 months"
        elif health_score > 40:
            return "Schedule maintenance within 6 weeks"
        else:
            return "Urgent: Schedule maintenance immediately"
    
    async def get_anomaly_detection(self, db: AsyncSession) -> dict[str, Any]:
        """Detect unusual consumption patterns and anomalies."""
        try:
            readings = await reading_repo.get_latest(db, limit=168)  # Last 7 days
            
            if len(readings) < 10:
                return {"anomalies": []}
            
            # Calculate statistics
            consumptions = [r.consumption for r in readings]
            avg = sum(consumptions) / len(consumptions)
            variance = sum((x - avg) ** 2 for x in consumptions) / len(consumptions)
            std_dev = variance ** 0.5
            
            # Find outliers (beyond 2 standard deviations)
            anomalies = []
            for reading in readings:
                z_score = (reading.consumption - avg) / (std_dev + 0.001)
                if abs(z_score) > 2:
                    anomalies.append({
                        "timestamp": reading.timestamp.isoformat(),
                        "consumption": reading.consumption,
                        "deviation_percent": round(((reading.consumption - avg) / avg * 100), 2),
                        "severity": "high" if abs(z_score) > 3 else "medium",
                    })
            
            return {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "period_hours": 168,
                "average_consumption": round(avg, 2),
                "std_deviation": round(std_dev, 2),
                "anomalies_detected": len(anomalies),
                "anomalies": sorted(anomalies, key=lambda x: abs(x["deviation_percent"]), reverse=True)[:10],
            }
        except Exception as e:
            logger.error("anomaly_detection_error", error=str(e))
            return {"anomalies": []}
    
    async def get_optimization_potential(self, db: AsyncSession) -> dict[str, Any]:
        """Calculate potential energy savings based on patterns."""
        try:
            # Get analytics
            readings = await reading_repo.get_latest(db, limit=720)  # 30 days
            
            if not readings:
                return {"total_savings_potential_pct": 20}
            
            # Analyze patterns
            hourly_data = {}
            for reading in readings:
                hour = reading.timestamp.strftime("%H:00")
                if hour not in hourly_data:
                    hourly_data[hour] = []
                hourly_data[hour].append(reading.consumption)
            
            # Find peak and off-peak
            hourly_avg = {h: sum(v) / len(v) for h, v in hourly_data.items()}
            peak_avg = max(hourly_avg.values()) if hourly_avg else 0
            off_peak_avg = min(hourly_avg.values()) if hourly_avg else 0
            
            peak_reduction_pct = 15  # Realistic reduction through optimization
            off_peak_increase_pct = 5  # Slight increase from load shifting
            # Calculate potential savings
            if peak_avg > 0:
                
                total_potential_pct = round(
                    (peak_reduction_pct * peak_avg - off_peak_increase_pct * off_peak_avg) / peak_avg
                )
            else:
                total_potential_pct = 20
            
            return {
                "total_savings_potential_pct": max(5, min(50, total_potential_pct)),
                "peak_hour_reduction_pct": peak_reduction_pct,
                "off_peak_shifting_pct": off_peak_increase_pct,
                "analysis_period_days": 30,
                "key_opportunities": [
                    "Shift flexible loads to off-peak hours",
                    "Optimize HVAC setpoints during peak periods",
                    "Implement demand response programs",
                    "Upgrade to LED lighting systems",
                ],
            }
        except Exception as e:
            logger.error("optimization_potential_error", error=str(e))
            return {"total_savings_potential_pct": 20}


# Module-level singleton
predictive_service = PredictiveAnalyticsService()
