"""
Database seeding — idempotent.
Safe to call on every application startup; it will only insert data
when the database is genuinely empty.
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import async_session_maker, engine
from app.database.base import Base
from app.models.infrastructure import Building, Room, Device, DeviceTypeEnum, DeviceStatusEnum
from app.models.analytics import (
    Recommendation,
    RecommendationImpactEnum,
    RecommendationCategoryEnum,
)
from app.core.logging import logger

# Fixed UUIDs so the seed is idempotent across restarts
_BUILDING_ID = "11111111-1111-1111-1111-111111111111"
_ROOM_ID = "00000000-0000-0000-0000-000000000000"

_DEVICES = [
    dict(name="HVAC Unit A — Main Hall", type=DeviceTypeEnum.hvac, status=DeviceStatusEnum.online, baseline_consumption=342, health_score=92),
    dict(name="LED Panel Array B2", type=DeviceTypeEnum.lighting, status=DeviceStatusEnum.online, baseline_consumption=45, health_score=98),
    dict(name="Server Room Cooling", type=DeviceTypeEnum.hvac, status=DeviceStatusEnum.warning, baseline_consumption=520, health_score=64),
    dict(name="Solar Inverter #1", type=DeviceTypeEnum.solar, status=DeviceStatusEnum.online, baseline_consumption=-180, health_score=96),
    dict(name="Smart Meter — West Wing", type=DeviceTypeEnum.meter, status=DeviceStatusEnum.online, baseline_consumption=267, health_score=88),
    dict(name="Lab Equipment Cluster", type=DeviceTypeEnum.equipment, status=DeviceStatusEnum.maintenance, baseline_consumption=0, health_score=35),
    dict(name="HVAC Unit C — Library", type=DeviceTypeEnum.hvac, status=DeviceStatusEnum.online, baseline_consumption=198, health_score=94),
    dict(name="Outdoor Lighting Grid", type=DeviceTypeEnum.lighting, status=DeviceStatusEnum.online, baseline_consumption=78, health_score=90),
    dict(name="Backup Generator", type=DeviceTypeEnum.equipment, status=DeviceStatusEnum.offline, baseline_consumption=0, health_score=72),
    dict(name="IoT Sensor Network", type=DeviceTypeEnum.sensor, status=DeviceStatusEnum.online, baseline_consumption=12, health_score=99),
    dict(name="Solar Inverter #2", type=DeviceTypeEnum.solar, status=DeviceStatusEnum.online, baseline_consumption=-145, health_score=93),
    dict(name="Water Heater System", type=DeviceTypeEnum.equipment, status=DeviceStatusEnum.online, baseline_consumption=156, health_score=81),
]

_RECOMMENDATIONS = [
    dict(title="Optimize HVAC scheduling during off-peak hours", description="Analysis shows HVAC units run at full capacity during unoccupied hours. Implementing smart scheduling could reduce consumption by 23%.", impact=RecommendationImpactEnum.high, category=RecommendationCategoryEnum.energy, estimated_savings=4200, priority_score=95, status="pending", ai_confidence=0.94),
    dict(title="Replace Server Room Cooling with liquid cooling", description="Server Room Cooling unit is operating at 71% efficiency. Transitioning to modern liquid cooling could improve efficiency by 25%.", impact=RecommendationImpactEnum.high, category=RecommendationCategoryEnum.cost, estimated_savings=8500, priority_score=85, status="pending", ai_confidence=0.88),
    dict(title="Install motion sensors for lighting automation", description="Outdoor and corridor lighting operates continuously. Motion-based activation would cut lighting costs by 40%.", impact=RecommendationImpactEnum.medium, category=RecommendationCategoryEnum.sustainability, estimated_savings=2100, priority_score=75, status="implemented", ai_confidence=0.98),
    dict(title="Schedule Lab Equipment maintenance cycle", description="Lab Equipment Cluster has been offline. Preventive maintenance scheduling could prevent 15% of equipment failures.", impact=RecommendationImpactEnum.medium, category=RecommendationCategoryEnum.maintenance, estimated_savings=3200, priority_score=60, status="pending", ai_confidence=0.85),
    dict(title="Expand solar panel capacity on Rooftop C", description="Current solar generation covers 18% of total consumption. Adding panels on Rooftop C could increase coverage to 32%.", impact=RecommendationImpactEnum.high, category=RecommendationCategoryEnum.sustainability, estimated_savings=12000, priority_score=90, status="pending", ai_confidence=0.91),
    dict(title="Implement demand response protocol", description="During peak grid demand (2-5 PM), shifting non-critical loads to off-peak hours could reduce peak charges by 30%.", impact=RecommendationImpactEnum.medium, category=RecommendationCategoryEnum.cost, estimated_savings=3800, priority_score=70, status="pending", ai_confidence=0.82),
]


async def seed_db() -> None:
    """Idempotent seed — only runs when the database is empty."""
    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        # Fast exit if already seeded
        device_count = await db.scalar(select(func.count()).select_from(Device))
        if device_count and device_count > 0:
            logger.info("database_already_seeded", device_count=device_count)
            return

        logger.info("seeding_database_start")
        await _seed_infrastructure(db)
        await _seed_recommendations(db)
        await db.commit()
        logger.info("seeding_database_complete")


async def _seed_infrastructure(db: AsyncSession) -> None:
    # Building
    existing_building = await db.get(Building, _BUILDING_ID)
    if not existing_building:
        db.add(Building(id=_BUILDING_ID, name="Main Facility", address="123 Tech Park"))

    # Room
    existing_room = await db.get(Room, _ROOM_ID)
    if not existing_room:
        db.add(Room(id=_ROOM_ID, building_id=_BUILDING_ID, name="Lobby", floor="1"))

    await db.flush()

    for device_data in _DEVICES:
        db.add(Device(room_id=_ROOM_ID, **device_data))


async def _seed_recommendations(db: AsyncSession) -> None:
    # Avoid duplicates by checking title uniqueness
    for rec_data in _RECOMMENDATIONS:
        existing = await db.scalar(
            select(Recommendation).where(Recommendation.title == rec_data["title"])
        )
        if not existing:
            db.add(Recommendation(**rec_data))