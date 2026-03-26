from pydantic import BaseModel, ConfigDict
from app.db.models import BookingStatus
from typing import Optional
import datetime


class ReservationBase(BaseModel):
    user_id: int
    vehicle_id: int
    start_time: datetime.datetime


class ReservationCreate(ReservationBase):
    pass


class ReservationOut(ReservationBase):
    id: int
    end_time: Optional[datetime.datetime] = None
    status: BookingStatus
    total_cost: Optional[float] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)