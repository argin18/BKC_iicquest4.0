from app.repositories.base import BaseRepository
from app.models.infrastructure import Device
from app.schemas.infrastructure import DeviceCreate, DeviceUpdate

class DeviceRepository(BaseRepository[Device, DeviceCreate, DeviceUpdate]):
    pass

device_repo = DeviceRepository(Device)
