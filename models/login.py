from pydantic import BaseModel,EmailStr
from typing import Optional
from fastapi import FastAPI
class Login(BaseModel):
    email : EmailStr
    password : str

