from pydantic import BaseModel, ConfigDict
from app.db.models import PaymentStatus
from typing import Optional
import datetime


class PaymentBase(BaseModel):
    reservation_id: int
    amount: float


class PaymentCreate(PaymentBase):
    payment_method: Optional[str] = None


class PaymentOut(PaymentBase):
    id: int
    status: PaymentStatus
    payment_method: Optional[str] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)