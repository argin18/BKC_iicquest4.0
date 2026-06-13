from pydantic import BaseModel
from app.models.infrastructure import DeviceTypeEnum, DeviceStatusEnum
from app.schemas.base import SchemaBase, TimestampSchema

class DeviceBase(SchemaBase):
    name: str
    type: DeviceTypeEnum
    room_id: str
    status: DeviceStatusEnum = DeviceStatusEnum.offline
    mac_address: str | None = None
    firmware_version: str | None = None
    baseline_consumption: float = 0.0

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: str | None = None
    status: DeviceStatusEnum | None = None
    firmware_version: str | None = None
    health_score: float | None = None

class DeviceResponse(DeviceBase, TimestampSchema):
    id: str
    health_score: float
