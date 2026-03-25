from sqlalchemy.orm import Session
from app.db.schemas import Payment


def create_payment(db: Session, payment_data: dict):
    payment = Payment(**payment_data)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_payment_by_id(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_payments_by_reservation(db: Session, reservation_id: int):
    return db.query(Payment).filter(Payment.reservation_id == reservation_id).all()


def update_payment_status(db: Session, payment_id: int, status: str):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return None

    payment.status = status
    db.commit()
    db.refresh(payment)
    return payment