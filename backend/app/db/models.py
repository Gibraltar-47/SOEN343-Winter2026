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

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reservations  = relationship("Reservation", back_populates="user")
    vehicles      = relationship("Vehicle", back_populates="provider") 



#Vehicle table
class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    type = Column(Enum(VehicleType), nullable=False)
    model = Column(String, nullable=False)
    status = Column(Enum(VehicleStatus), nullable=False)
    price_per_hour = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    

    provider      = relationship("User", back_populates="vehicles")
    location      = relationship("Location", back_populates="vehicles")
    reservations  = relationship("Reservation", back_populates="vehicle")

#Reservation table
class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    status = Column(Enum(BookingStatus), nullable=False)
    total_cost = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

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
    created_at:     Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.utcnow)

    reservation: Mapped["Reservation"] = relationship(back_populates="payment")


#Location table
class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    vehicles = relationship("Vehicle", back_populates="location")