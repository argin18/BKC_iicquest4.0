from pydantic import BaseModel
from datetime import datetime
from typing import Any
from app.schemas.base import TimestampSchema
from app.models.analytics import RecommendationImpactEnum, RecommendationCategoryEnum

class EnergyReadingBase(BaseModel):
    device_id: str
    timestamp: datetime
    consumption: float = 0.0
    generation: float = 0.0
    current: float | None = None
    voltage: float | None = None
    power_factor: float | None = None

class EnergyReadingCreate(EnergyReadingBase):
    pass

class EnergyReadingResponse(EnergyReadingBase):
    id: str

class RecommendationBase(BaseModel):
    title: str
    description: str
    impact: RecommendationImpactEnum
    category: RecommendationCategoryEnum
    estimated_savings: float
    implementation_cost: float | None = None
    priority_score: int = 0
    status: str = "pending"
    ai_confidence: float
    metadata_json: dict[str, Any] = {}

class RecommendationResponse(RecommendationBase, TimestampSchema):
    id: str

class ImpactReportBase(BaseModel):
    title: str
    period_start: datetime
    period_end: datetime
    executive_summary: str
    total_savings: float
    carbon_reduced: float
    full_report_data: dict[str, Any]

class ImpactReportResponse(ImpactReportBase, TimestampSchema):
    id: str
