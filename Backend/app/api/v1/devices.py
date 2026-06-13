from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.infrastructure import DeviceCreate, DeviceUpdate, DeviceResponse
from app.repositories.device import device_repo

router = APIRouter()


@router.get("/", response_model=list[DeviceResponse])
async def list_devices(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    return await device_repo.get_multi(db, skip=skip, limit=limit)


@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(device_id: str, db: AsyncSession = Depends(get_db)):
    device = await device_repo.get(db, id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    return device


@router.post("/", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def create_device(device_in: DeviceCreate, db: AsyncSession = Depends(get_db)):
    return await device_repo.create(db, obj_in=device_in)


@router.patch("/{device_id}", response_model=DeviceResponse)
async def update_device(
    device_id: str, device_in: DeviceUpdate, db: AsyncSession = Depends(get_db)
):
    device = await device_repo.get(db, id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    return await device_repo.update(db, db_obj=device, obj_in=device_in)


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(device_id: str, db: AsyncSession = Depends(get_db)):
    device = await device_repo.remove(db, id=device_id)
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")