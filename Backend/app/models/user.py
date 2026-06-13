from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Enum
from app.database.base import Base, TimestampMixin, generate_uuid
import enum

class RoleEnum(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    viewer = "viewer"

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    full_name: Mapped[str] = mapped_column(String)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum), default=RoleEnum.viewer)
    is_active: Mapped[bool] = mapped_column(default=True)
