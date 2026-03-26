from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime,Enum,Float
from app.db.database import Base
from sqlalchemy.orm import relationship, Mapped, mapped_column
import datetime, enum


class UserRole(str, enum.Enum):
    customer = "customer"
    provider = "provider"
    admin = "admin"

class VehicleType(str, enum.Enum):
    car = "car"
    bike = "bike"
    scooter = "scooter"

class BookingStatus(str, enum.Enum):
    cancelled = "cancelled"
    completed = "completed"
    confirmed = "confirmed"

class VehicleStatus(str, enum.Enum):
    available = "available"
    unavailable = "unavailable"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"

#User table
class User(Base):
    __tablename__ = "users"

    id:            Mapped[int]               = mapped_column(primary_key=True, index=True)
    name:          Mapped[str]               = mapped_column(nullable=False)
    email:         Mapped[str]               = mapped_column(unique=True, index=True, nullable=False)
    password_hash: Mapped[str]               = mapped_column(nullable=False)
    role:          Mapped[UserRole]          = mapped_column(Enum(UserRole))
    created_at:    Mapped[datetime.datetime] = mapped_column(default= lambda: datetime.datetime.now(datetime.timezone.utc))

    reservations  = relationship("Reservation", back_populates="user")
    vehicles      = relationship("Vehicle", back_populates="provider") 



#Vehicle table
class Vehicle(Base):
    __tablename__ = "vehicles"

    id:            Mapped[int]              = mapped_column(primary_key=True, index=True)
    provider_id:   Mapped[int]              = mapped_column(ForeignKey("users.id"))
    location_id:   Mapped[int]              = mapped_column(ForeignKey("locations.id"))
    type:          Mapped[VehicleType]      = mapped_column(Enum(VehicleType))
    model:         Mapped[str]              = mapped_column(nullable=False)
    status:        Mapped[VehicleStatus]    = mapped_column(Enum(VehicleStatus))
    price_per_hour:Mapped[float]            = mapped_column(nullable=False)
    created_at:    Mapped[datetime.datetime]= mapped_column(default= lambda: datetime.datetime.now(datetime.timezone.utc))

    provider      = relationship("User", back_populates="vehicles")
    location      = relationship("Location", back_populates="vehicles")
    reservations  = relationship("Reservation", back_populates="vehicle")

#Reservation table
class Reservation(Base):
    __tablename__ = "reservations"

    id:         Mapped[int]                    = mapped_column(primary_key=True, index=True)
    user_id:    Mapped[int]                    = mapped_column(ForeignKey("users.id"))
    vehicle_id: Mapped[int]                    = mapped_column(ForeignKey("vehicles.id"))
    start_time: Mapped[datetime.datetime]      = mapped_column(nullable=False)
    end_time:   Mapped[datetime.datetime|None] = mapped_column(default=None)
    status:     Mapped[BookingStatus]          = mapped_column(Enum(BookingStatus))
    total_cost: Mapped[float|None]             = mapped_column(default=None)
    created_at: Mapped[datetime.datetime]      = mapped_column(default= lambda: datetime.datetime.now(datetime.timezone.utc))

    user     = relationship("User", back_populates="reservations")
    vehicle  = relationship("Vehicle", back_populates="reservations")
    payment  = relationship("Payment", back_populates="reservation", uselist=False)

#Payment table
from sqlalchemy.orm import Mapped, mapped_column

class Payment(Base):
    __tablename__ = "payments"

    id:             Mapped[int]               = mapped_column(primary_key=True, index=True)
    reservation_id: Mapped[int]               = mapped_column(ForeignKey("reservations.id"))
    amount:         Mapped[float]             = mapped_column(nullable=False)
    status:         Mapped[PaymentStatus]     = mapped_column(Enum(PaymentStatus), default=PaymentStatus.pending)
    payment_method: Mapped[str | None]        = mapped_column(default=None)
    created_at:     Mapped[datetime.datetime] = mapped_column(default= lambda: datetime.datetime.now(datetime.timezone.utc))

    reservation: Mapped["Reservation"] = relationship(back_populates="payment")


#Location table
class Location(Base):
    __tablename__ = "locations"

    id:             Mapped[int]                = mapped_column(primary_key=True, index=True)
    address:        Mapped[str]                = mapped_column(nullable=False)
    city:           Mapped[str]                = mapped_column(nullable=False)
    latitude:       Mapped[float]              = mapped_column(nullable=True)
    longitude:      Mapped[float]              = mapped_column(nullable=True)

    vehicles = relationship("Vehicle", back_populates="location")