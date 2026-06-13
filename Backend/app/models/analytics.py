from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Float, DateTime, JSON, Enum
from app.database.base import Base, TimestampMixin, generate_uuid
from datetime import datetime
import enum

class RecommendationImpactEnum(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"

class RecommendationCategoryEnum(str, enum.Enum):
    cost = "cost"
    energy = "energy"
    sustainability = "sustainability"
    maintenance = "maintenance"

class EnergyReading(Base):
    __tablename__ = "energy_readings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    device_id: Mapped[str] = mapped_column(ForeignKey("devices.id"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    
    consumption: Mapped[float] = mapped_column(Float, default=0.0)
    generation: Mapped[float] = mapped_column(Float, default=0.0)
    current: Mapped[float | None] = mapped_column(Float)
    voltage: Mapped[float | None] = mapped_column(Float)
    power_factor: Mapped[float | None] = mapped_column(Float)
    
    device: Mapped["Device"] = relationship(back_populates="readings")

class AnalyticsSnapshot(Base, TimestampMixin):
    __tablename__ = "analytics_snapshots"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    resolution: Mapped[str] = mapped_column(String) # hourly, daily, weekly, monthly
    
    total_consumption: Mapped[float] = mapped_column(Float)
    total_generation: Mapped[float] = mapped_column(Float)
    estimated_cost: Mapped[float] = mapped_column(Float)
    carbon_footprint: Mapped[float] = mapped_column(Float)
    
    metrics_data: Mapped[dict] = mapped_column(JSON) # Store complex aggregated data

class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    impact: Mapped[RecommendationImpactEnum] = mapped_column(Enum(RecommendationImpactEnum))
    category: Mapped[RecommendationCategoryEnum] = mapped_column(Enum(RecommendationCategoryEnum))
    
    estimated_savings: Mapped[float] = mapped_column(Float)
    implementation_cost: Mapped[float | None] = mapped_column(Float)
    priority_score: Mapped[int] = mapped_column(default=0)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, implemented, dismissed
    
    ai_confidence: Mapped[float] = mapped_column(Float)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

class ImpactReport(Base, TimestampMixin):
    __tablename__ = "impact_reports"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    executive_summary: Mapped[str] = mapped_column(String)
    total_savings: Mapped[float] = mapped_column(Float)
    carbon_reduced: Mapped[float] = mapped_column(Float)
    
    full_report_data: Mapped[dict] = mapped_column(JSON)
