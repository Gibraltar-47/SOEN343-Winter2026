from sqlalchemy.orm import Session
from app.db.models import Location


def create_location(db: Session, location_data: dict):
    location = Location(**location_data)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location


def get_location_by_id(db: Session, location_id: int):
    return db.query(Location).filter(Location.id == location_id).first()


def get_all_locations(db: Session):
    return db.query(Location).all()


def get_locations_by_city(db: Session, city: str):
    return db.query(Location).filter(Location.city == city).all()


def update_location(db: Session, location_id: int, update_data: dict):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        return None

    for key, value in update_data.items():
        if hasattr(location, key):
            setattr(location, key, value)

    db.commit()
    db.refresh(location)
    return location


def delete_location(db: Session, location_id: int):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        return False

    db.delete(location)
    db.commit()
    return True