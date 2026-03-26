from pydantic import BaseModel, ConfigDict
from app.db.models import VehicleType, VehicleStatus
from typing import Optional
import datetime


class VehicleBase(BaseModel):
    type: VehicleType
    model: str
    status: VehicleStatus
    price_per_hour: float
    location_id: int


class VehicleCreate(VehicleBase):
    provider_id: int


class VehicleUpdate(BaseModel):
    type: Optional[VehicleType] = None
    model: Optional[str] = None
    status: Optional[VehicleStatus] = None
    price_per_hour: Optional[float] = None
    location_id: Optional[int] = None


class VehicleOut(VehicleBase):
    id: int
    provider_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)