from sqlalchemy.orm import Session
from app.db.schemas import Vehicle

def create_vehicle(db: Session, vehicle_data: dict):
    vehicle = Vehicle(**vehicle_data)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def get_vehicle_by_id(db: Session, vehicle_id: int):
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def get_vehicles_by_provider(db: Session, provider_id: int):
    return db.query(Vehicle).filter(Vehicle.provider_id == provider_id).all()


def get_available_vehicles(db: Session):
    return db.query(Vehicle).filter(Vehicle.status == "available").all()


def update_vehicle(db: Session, vehicle_id: int, updates: dict):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        return None

    for key, value in updates.items():
        setattr(vehicle, key, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


def delete_vehicle(db: Session, vehicle_id: int):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        return None

    db.delete(vehicle)
    db.commit()
    return vehicle