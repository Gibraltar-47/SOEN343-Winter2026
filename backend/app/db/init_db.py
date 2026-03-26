from app.db.database import engine, Base

def init_db():
#Create our database
    Base.metadata.create_all(bind=engine) 
    print("Tables created successfully")