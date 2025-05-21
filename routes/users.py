from fastapi import APIRouter
from models.user import User
from passlib.context import CryptContext
import pymongo
import random
from email_utils import send_email
from datetime import datetime
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
users_collection = DB["Users"]
students_collection = DB["Students"]
companies_collection = DB["Companies"]

user_router = APIRouter()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@user_router.post("/Users")
async def create_user(user: User):
    user.email = user.email.lower()  # Convert email to lowercase
    user.role = user.role.lower()  # 🔹 Convert role to lowercase for consistency

    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "Email already registered", "status": "failed"}

    hashed_password = hash_password(user.password)
    verification_token = random.randint(100000, 999999)

    user_data = user.dict(exclude_none=True)
    user_data["password"] = hashed_password
    user_data["is_verified"] = False  
    user_data["verification_token"] = verification_token  
    user_data["profile_complete"] = False  
    user_data["created_at"] = datetime.utcnow()
    user_data["updated_at"] = datetime.utcnow()

    result = users_collection.insert_one(user_data)  
    user_id = str(result.inserted_id)  

    if user.role == "student":
        students_collection.insert_one({
            "_id": user_id,   
            "student_id": user_id,  
            "name": user.name,
            "email": user.email,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
    
    elif user.role == "recruiter":  # 🔹 Ensure case insensitivity
        companies_collection.insert_one({
            "_id": user_id,   
            "company_id": user_id, 
            "name": user.name,
            "email": user.email,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })

    subject = "Verify Your Email - Internship Portal"
    body = f"""
    <html>
    <body style="text-align: center; color: red; font-size: 18px;">
        <h2>Welcome to Internship Portal!</h2>
        <p>Thank you for registering. Please verify your email using the following code:</p>
        <h3 style="color: blue;">{verification_token}</h3>
    </body>
    </html>
    """
    send_email(user.email, subject, body, is_html=True)

    return {"message": "Verification email sent. Please check your inbox.", "status": "pending"}
