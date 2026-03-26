from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repository import user_repository
from app.core.security import hash_password, verify_password, create_access_token
from app.schema.user import UserCreate, UserLogin


def register(db: Session, payload: UserCreate):
    # check if email already exists
    existing_user = user_repository.get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password before storing
    hashed = hash_password(payload.password)

    # create user via repository
    user = user_repository.create_user(db, {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hashed,
        "role": payload.role
    })

    return user


def login(db: Session, payload: UserLogin):
    # find user by email
    user = user_repository.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # verify password
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # generate JWT token
    token = create_access_token(user.id, user.role)

    return {"access_token": token, "token_type": "bearer", "user": user}