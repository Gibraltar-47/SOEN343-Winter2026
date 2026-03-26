from fastapi import FastAPI
from app.route import auth_route
from app.db.init_db import init_db

app = FastAPI()

# initialize database on startup
init_db()

# register routers
app.include_router(auth_route.router)