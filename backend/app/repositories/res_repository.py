from sqlalchemy.orm import Session
from app.db.schemas import Reservation


def create_reservation(db: Session, reservation_data: dict):
    reservation = Reservation(**reservation_data)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def get_reservation_by_id(db: Session, reservation_id: int):
    return db.query(Reservation).filter(Reservation.id == reservation_id).first()


def get_reservations_by_user(db: Session, user_id: int):
    return db.query(Reservation).filter(Reservation.user_id == user_id).all()


def get_active_reservations(db: Session):
    return db.query(Reservation).filter(Reservation.status == "confirmed").all()


def update_reservation(db: Session, reservation_id: int, updates: dict):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        return None

    for key, value in updates.items():
        setattr(reservation, key, value)

    db.commit()
    db.refresh(reservation)
    return reservation