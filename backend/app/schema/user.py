from pydantic import BaseModel, EmailStr, ConfigDict
from app.db.models import UserRole
import datetime
 
 
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
 
 
class UserCreate(UserBase):
    password: str
 
 
class UserLogin(BaseModel):
    email: EmailStr
    password: str
 
 
class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
 
    model_config = ConfigDict(from_attributes=True)
 
 
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut