from pydantic import BaseModel, ConfigDict
from typing import Optional


class LocationBase(BaseModel):
    address: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LocationOut(LocationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)