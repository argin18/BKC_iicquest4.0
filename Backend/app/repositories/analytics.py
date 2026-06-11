"""Analytics repository for storing and retrieving analytics data."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_
from app.repositories.base import BaseRepository
from app.models.analytics import Recommendation, ImpactReport, AnalyticsSnapshot
from app.schemas.analytics import RecommendationBase, ImpactReportBase

class RecommendationRepository(BaseRepository[Recommendation, RecommendationBase, RecommendationBase]):
    """Repository for managing AI-generated recommendations."""
    
    async def get_by_status(
        self, db: AsyncSession, status: str, limit: int = 100
    ) -> list[Recommendation]:
        """Get recommendations by status (pending, implemented, dismissed)."""
        result = await db.execute(
            select(self.model)
            .where(self.model.status == status)
            .order_by(desc(self.model.priority_score), desc(self.model.ai_confidence))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_category(
        self, db: AsyncSession, category: str, limit: int = 100
    ) -> list[Recommendation]:
        """Get recommendations by category (cost, energy, sustainability, maintenance)."""
        result = await db.execute(
            select(self.model)
            .where(self.model.category == category)
            .order_by(desc(self.model.priority_score))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_top_recommendations(
        self, db: AsyncSession, limit: int = 10, status: str = "pending"
    ) -> list[Recommendation]:
        """Get top-priority recommendations for implementation."""
        result = await db.execute(
            select(self.model)
            .where(self.model.status == status)
            .order_by(desc(self.model.priority_score), desc(self.model.ai_confidence))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_impact(
        self, db: AsyncSession, impact: str, limit: int = 100
    ) -> list[Recommendation]:
        """Get recommendations by impact level (high, medium, low)."""
        result = await db.execute(
            select(self.model)
            .where(self.model.impact == impact)
            .order_by(desc(self.model.priority_score))
            .limit(limit)
        )
        return result.scalars().all()

class ImpactReportRepository(BaseRepository[ImpactReport, ImpactReportBase, ImpactReportBase]):
    """Repository for managing impact reports."""
    
    async def get_latest(self, db: AsyncSession, limit: int = 10) -> list[ImpactReport]:
        """Get latest impact reports."""
        result = await db.execute(
            select(self.model)
            .order_by(desc(self.model.period_end))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_period(
        self, db: AsyncSession, period_start, period_end
    ) -> list[ImpactReport]:
        """Get reports within a period."""
        result = await db.execute(
            select(self.model)
            .where(
                and_(
                    self.model.period_start >= period_start,
                    self.model.period_end <= period_end
                )
            )
            .order_by(desc(self.model.period_end))
        )
        return result.scalars().all()

class AnalyticsSnapshotRepository(BaseRepository[AnalyticsSnapshot, dict, dict]):
    """Repository for analytics snapshots."""
    
    async def get_latest(self, db: AsyncSession, limit: int = 100) -> list[AnalyticsSnapshot]:
        """Get latest analytics snapshots."""
        result = await db.execute(
            select(self.model)
            .order_by(desc(self.model.timestamp))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_by_resolution(
        self, db: AsyncSession, resolution: str, limit: int = 100
    ) -> list[AnalyticsSnapshot]:
        """Get snapshots by resolution (hourly, daily, weekly, monthly)."""
        result = await db.execute(
            select(self.model)
            .where(self.model.resolution == resolution)
            .order_by(desc(self.model.timestamp))
            .limit(limit)
        )
        return result.scalars().all()

# Module-level singletons
recommendation_repo = RecommendationRepository(Recommendation)
report_repo = ImpactReportRepository(ImpactReport)
analytics_snapshot_repo = AnalyticsSnapshotRepository(AnalyticsSnapshot)
