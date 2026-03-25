from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
#TOD0: store in .env
DATABASE_URL = 'postgresql://postgres:12345abcde!!@localhost:5432/rental_db' 

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()