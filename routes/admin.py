from fastapi import APIRouter, Depends, Security
from fastapi.security import OAuth2PasswordBearer
from models.login import Login
from passlib.context import CryptContext
from bson import ObjectId
import pymongo
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

client = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["InternshipManagement"]
users_collection = db["Users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
admin_router = APIRouter()

def create_access_token(data: dict, expires_minutes: int):
    data["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_admin(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            return {"message": "Access denied", "status": "failed"}
        return payload
    except JWTError:
        return {"message": "Invalid or expired token", "status": "failed"}

@admin_router.post("/admin/login")
async def admin_login(request: Login):
    admin = users_collection.find_one({"email": request.email.lower(), "role": "admin"}, {"_id": 1, "email": 1, "password": 1})
    
    if not admin or not pwd_context.verify(request.password, admin["password"]):
        return {"message": "Unauthorized access", "status": "failed"}

    # Create token with consistent payload structure
    access_token = create_access_token({
        "user_id": str(admin["_id"]),  
        "sub": admin["email"],        
        "role": "admin",              
        "student_id": None,            
        "company_id": None             
    }, ACCESS_TOKEN_EXPIRE_MINUTES)

    return {"message": "Admin login successful", "access_token": access_token, "token_type": "bearer"}
@admin_router.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(verify_admin)):
    if "status" in user and user["status"] == "failed":
        return user

    # Count users by role
    total_users = users_collection.aggregate([
        {"$group": {"_id": "$role", "count": {"$sum": 1}}}
    ])
    users_count = {user["_id"]: user["count"] for user in total_users}

    # Count internships
    internships_collection = db["Internships"]
    total_internships = internships_collection.count_documents({})
    
    # Count active internships (case-insensitive)
    active_internships = internships_collection.count_documents({
        "$or": [
            {"internship_status": {"$regex": "^active$", "$options": "i"}},  # Case-insensitive match for "active"
            {"internship_status": {"$exists": False}}  # Include documents where the field is missing
        ]
    })
    
    # Count expired internships
    expired_internships = internships_collection.count_documents({
        "internship_status": {"$regex": "^inactive$", "$options": "i"}  # Case-insensitive match for "inactive"
    })

    # Count total applications
    applications_collection = db["Applications"]
    total_applications = applications_collection.count_documents({})

    # Count recruiter verifications
    recruiter_status_count = {
        "pending": 0,
        "approved": 0,
        "rejected": 0
    }

    recruiter_verifications = users_collection.aggregate([
        {"$match": {"role": "recruiter"}},
        {"$group": {
            "_id": {"$ifNull": ["$status", "pending"]},
            "count": {"$sum": 1}
        }}
    ])

    for status in recruiter_verifications:
        recruiter_status_count[status["_id"]] = status["count"]

    # Count user verifications
    user_verification_count = {
        "verified": 0,
        "unverified": 0
    }

    user_verifications = users_collection.aggregate([
        {"$match": {"role": {"$ne": "admin"}}},
        {"$group": {
            "_id": {"$ifNull": ["$is_verified", False]},
            "count": {"$sum": 1}
        }}
    ])

    for verification in user_verifications:
        key = "verified" if verification["_id"] else "unverified"
        user_verification_count[key] = verification["count"]

    # Fetch user details
    user_details = []
    users = users_collection.find({}, {"name": 1, "email": 1, "status": 1, "role": 1, "_id": 0})
    for user in users:
        user_details.append(user)

    # Fetch internship details
    internships_list = []
    internships = internships_collection.find({}, {
        "title": 1,
        "company_name": 1,
        "internship_domain": 1,
        "type_of_internship": 1,
        "internship_status": 1,
        "location": 1,
        "application_deadline": 1,
        "_id": 0
    })
    for internship in internships:
        internships_list.append(internship)

    # Return the dashboard data
    return {
        "users_count": users_count,
        "internships": {
            "total": total_internships,
            "active": active_internships,
            "expired": expired_internships
        },
        "applications_count": total_applications,
        "recruiter_verifications": recruiter_status_count,
        "user_verifications": user_verification_count,
        "user_details": user_details,  # Include user details in the response
        "internships_list": internships_list  # Include internship details in the response
    }