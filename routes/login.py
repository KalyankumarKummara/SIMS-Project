from fastapi import APIRouter
from models.login import Login
from passlib.context import CryptContext
from datetime import datetime, timedelta
import pymongo
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
users_collection = DB["Users"]
students_collection = DB["Students"]
companies_collection = DB["Companies"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

login_router = APIRouter()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def is_profile_complete(profile, required_fields):
    return bool(profile and all(profile.get(field) for field in required_fields if profile.get(field) not in [None, "", []]))

@login_router.post("/login")
async def user_login(request: Login):
    email = request.email.lower()
    password = request.password

    user_data = users_collection.find_one({"email": email})
    
    if not user_data:
        return {"message": "Invalid credentials", "status": "failed"}
    
    if not pwd_context.verify(password, user_data["password"]):
        return {"message": "Invalid credentials", "status": "failed"}
    
    if not user_data.get("is_verified", False):
        return {"message": "Email not verified. Please verify your email before logging in.", "status": "failed"}

    role = user_data["role"]
    profile_complete = False
    student_id = None
    company_id = None

    if role == "student":
        student_profile = students_collection.find_one({"student_id": str(user_data["_id"])}, {"_id": 0})
        required_fields = ["dob", "location", "skills", "education"]
        profile_complete = is_profile_complete(student_profile, required_fields)
        student_id = str(user_data["_id"])

    elif role == "recruiter":
        company_profile = companies_collection.find_one({"company_id": str(user_data["_id"])}, {"_id": 0})
        required_fields = ["industry", "location", "website", "size"]
        profile_complete = is_profile_complete(company_profile, required_fields)
        company_id = str(user_data["_id"])

    users_collection.update_one({"email": email}, {"$set": {"profile_complete": profile_complete}})

    token_data = {
        "user_id": str(user_data["_id"]),
        "role": role,
        "student_id": student_id if role == "student" else None,
        "company_id": company_id if role == "recruiter" else None
    }
    access_token = create_access_token(token_data)

    # Prepare the response data
    response_data = {
        "message": "Login successful",
        "status": "success",
        "redirect": f"/{role}/dashboard",
        "profile_complete": profile_complete,
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "email": email,
    }

    # Include student_id for students
    if role == "student":
        response_data["student_id"] = student_id

    # Include company_id for recruiters
    if role == "recruiter":
        response_data["company_id"] = company_id

    return response_data