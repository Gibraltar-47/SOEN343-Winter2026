from app.db.database import engine, Base
from app.db.schemas import User, Vehicle, Reservation, Payment

#Create our database
Base.metadata.create_all(bind=engine) 

print("Tables created successfully!")