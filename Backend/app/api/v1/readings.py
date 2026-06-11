from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.analytics import EnergyReadingCreate, EnergyReadingResponse
from app.repositories.reading import reading_repo

router = APIRouter()

@router.post("/", response_model=EnergyReadingResponse, status_code=status.HTTP_201_CREATED)
async def create_reading(reading_in: EnergyReadingCreate, db: AsyncSession = Depends(get_db)):
    return await reading_repo.create(db, obj_in=reading_in)

@router.get("/latest", response_model=list[EnergyReadingResponse])
async def get_latest_readings(limit: int = 50, db: AsyncSession = Depends(get_db)):
    return await reading_repo.get_latest(db, limit=limit)

@router.get("/device/{device_id}", response_model=list[EnergyReadingResponse])
async def get_device_readings(device_id: str, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await reading_repo.get_by_device(db, device_id=device_id, limit=limit)
