from pydantic import BaseModel
from fastapi import APIRouter
from passlib.context import CryptContext
import pymongo
from datetime import datetime

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
mycol = DB["Users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

Reset_password_router = APIRouter()

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str

@Reset_password_router.post("/reset_password")
async def reset_password(data: ResetPasswordRequest):
    user = mycol.find_one({"reset_token": data.reset_token})
    
    if not user:
        return {"message": "Invalid or expired reset token"}

    if data.new_password != data.confirm_password:
        return {"message": "Passwords do not match"}

    hashed_password = pwd_context.hash(data.new_password)

    mycol.update_one(
        {"reset_token": data.reset_token},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
    )

    return {"message": "Password successfully reset"}
