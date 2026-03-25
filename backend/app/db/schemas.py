from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime,Enum,Float
from app.db.database import Base
from sqlalchemy.orm import relationship
import datetime
import enum

class UserRole(str, enum.Enum):
    customer = "customer"
    provider = "provider"
    admin = "admin"

class VehicleType(str, enum.Enum):
    car = "car"
    biker = "bike"
    scooter = "scooter"

class BookingStatus(str, enum.Enum):
    cancelled = "cancelled"
    completed = "completed"
    confirmed = "confirmed"

class VehicleStatus(str, enum.Enum):
    available = "available"
    unavailable = "unavailable"






#User table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)



#Vehicle table
class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(VehicleType), nullable=False)
    model = Column(String, nullable=False)
    status = Column(Enum(VehicleStatus), nullable=False)
    location = Column(String, nullable=False)
    price_per_hour = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    provider = relationship("User")

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
    user = relationship("User")
    vehicle = relationship("Vehicle")

#Payment table
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reservation = relationship("Reservation")