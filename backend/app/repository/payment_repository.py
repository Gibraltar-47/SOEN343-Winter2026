from sqlalchemy.orm import Session
from app.db.models import Payment, Reservation, PaymentStatus



def create_payment(db: Session, payment_data: dict):
    payment = Payment(**payment_data)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_payment_by_id(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_payment_by_reservation(db: Session, reservation_id: int):
    return db.query(Payment).filter(Payment.reservation_id == reservation_id).first()


def get_payments_by_user(db: Session, user_id: int):
    return (
        db.query(Payment)
        .join(Reservation, Payment.reservation_id == Reservation.id)
        .filter(Reservation.user_id == user_id)
        .all()
    )


def get_payments_by_status(db: Session, status: PaymentStatus):
    return db.query(Payment).filter(Payment.status == status).all()


def update_payment_status(db: Session, payment_id: int, status: PaymentStatus):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return None
    payment.status = status
    db.commit()
    db.refresh(payment)
    return payment


def complete_payment(db: Session, payment_id: int):
    return update_payment_status(db, payment_id, PaymentStatus.completed)


def fail_payment(db: Session, payment_id: int):
    return update_payment_status(db, payment_id, PaymentStatus.failed)


def refund_payment(db: Session, payment_id: int):
    return update_payment_status(db, payment_id, PaymentStatus.refunded)
