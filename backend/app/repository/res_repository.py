from sqlalchemy.orm import Session
from app.db.models import Reservation, BookingStatus


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


def get_reservations_by_vehicle(db: Session, vehicle_id: int):
    return db.query(Reservation).filter(Reservation.vehicle_id == vehicle_id).all()


def get_active_reservations(db: Session):
    return (
        db.query(Reservation)
        .filter(Reservation.status == BookingStatus.confirmed)
        .all()
    )


def get_reservations_by_status(db: Session, status: BookingStatus):
    return db.query(Reservation).filter(Reservation.status == status).all()


def update_reservation(db: Session, reservation_id: int, updates: dict):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        return None
    for key, value in updates.items():
        setattr(reservation, key, value)
    db.commit()
    db.refresh(reservation)
    return reservation


def cancel_reservation(db: Session, reservation_id: int):
    return update_reservation(
        db, reservation_id, {"status": BookingStatus.cancelled}
    )


def complete_reservation(db: Session, reservation_id: int):
    return update_reservation(
        db, reservation_id, {"status": BookingStatus.completed}
    )
