from app.db.database import engine, Base

#Create our database
Base.metadata.create_all(bind=engine) 

print("Tables created successfully!")