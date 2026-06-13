from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Float, Enum, Boolean
from app.database.base import Base, TimestampMixin, generate_uuid
import enum
from typing import List

class DeviceTypeEnum(str, enum.Enum):
    hvac = "hvac"
    lighting = "lighting"
    equipment = "equipment"
    solar = "solar"
    meter = "meter"
    sensor = "sensor"

class DeviceStatusEnum(str, enum.Enum):
    online = "online"
    offline = "offline"
    warning = "warning"
    maintenance = "maintenance"

class Building(Base, TimestampMixin):
    __tablename__ = "buildings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, index=True)
    address: Mapped[str] = mapped_column(String)
    
    rooms: Mapped[List["Room"]] = relationship(back_populates="building", cascade="all, delete-orphan")

class Room(Base, TimestampMixin):
    __tablename__ = "rooms"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    building_id: Mapped[str] = mapped_column(ForeignKey("buildings.id"), index=True)
    name: Mapped[str] = mapped_column(String)
    floor: Mapped[str] = mapped_column(String)
    
    building: Mapped["Building"] = relationship(back_populates="rooms")
    devices: Mapped[List["Device"]] = relationship(back_populates="room", cascade="all, delete-orphan")

class Device(Base, TimestampMixin):
    __tablename__ = "devices"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    type: Mapped[DeviceTypeEnum] = mapped_column(Enum(DeviceTypeEnum), index=True)
    status: Mapped[DeviceStatusEnum] = mapped_column(Enum(DeviceStatusEnum), default=DeviceStatusEnum.offline)
    
    mac_address: Mapped[str | None] = mapped_column(String, unique=True, index=True)
    firmware_version: Mapped[str | None] = mapped_column(String)
    health_score: Mapped[float] = mapped_column(Float, default=100.0)
    baseline_consumption: Mapped[float] = mapped_column(Float, default=0.0)
    
    room: Mapped["Room"] = relationship(back_populates="devices")
    readings: Mapped[List["EnergyReading"]] = relationship(back_populates="device", cascade="all, delete-orphan")
