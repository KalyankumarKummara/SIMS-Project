from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"
    profile_complete: bool = False 
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
