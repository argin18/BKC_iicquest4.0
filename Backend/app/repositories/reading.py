from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.analytics import EnergyReading
from app.schemas.analytics import EnergyReadingCreate

class EnergyReadingRepository(BaseRepository[EnergyReading, EnergyReadingCreate, EnergyReadingCreate]):
    async def get_by_device(self, db: AsyncSession, device_id: str, limit: int = 100) -> list[EnergyReading]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.device_id == device_id)
            .order_by(self.model.timestamp.desc())
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_latest(self, db: AsyncSession, limit: int = 50) -> list[EnergyReading]:
        result = await db.execute(
            select(self.model)
            .order_by(self.model.timestamp.desc())
            .limit(limit)
        )
        return result.scalars().all()

reading_repo = EnergyReadingRepository(EnergyReading)
