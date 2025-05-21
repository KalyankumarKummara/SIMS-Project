from fastapi import APIRouter, Depends, Security
from fastapi.security import OAuth2PasswordBearer
import pymongo
from jose import jwt, JWTError
import os
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="student/login")

client = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["InternshipManagement"]
applications_collection = db["Applications"]
internships_collection = db["Internships"]
notifications_collection = db["Notifications"]
saved_internships_collection = db["SavedInternships"]
companies_collection = db["Companies"]
students_collection = db["Students"]

student_dashboard_router = APIRouter()

def verify_student(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "student":
            return {"message": "Access denied", "status": "failed"}
        return payload
    except JWTError:
        return {"message": "Invalid or expired token", "status": "failed"}

@student_dashboard_router.get("/student/dashboard")
async def student_dashboard(user: dict = Depends(verify_student)):
    if "status" in user and user["status"] == "failed":
        return user

    # Use student_id from the token
    student_id = user.get("student_id")
    user_id = user.get("user_id")  # Ensure user_id is retrieved correctly
    print(f"Fetching dashboard data for student_id: {student_id}, user_id: {user_id}")  

    try:
        # Fetch the student's profile to check if it's complete
        student_profile = students_collection.find_one(
            {"student_id": student_id}, 
            {"_id": 0, "profile_complete": 1}
        )
        profile_complete = student_profile.get("profile_complete", False) if student_profile else False

        # Fetch applications for the specific student
        applications = list(applications_collection.find(
            {"student_id": student_id}, 
            {"_id": 0, "status": 1, "internship_id": 1}
        ))
        print(f"Applications found: {len(applications)}")  

        # Calculate application status counts
        application_status_counts = {
            "pending": sum(1 for app in applications if app["status"] == "pending"),
            "accepted": sum(1 for app in applications if app["status"] == "accepted"),
            "rejected": sum(1 for app in applications if app["status"] == "rejected"),
            "shortlisted": sum(1 for app in applications if app["status"] == "shortlisted")
        }

        # Fetch internships associated with the applications
        applied_internship_ids = {app["internship_id"] for app in applications}
        internships = list(internships_collection.find(
            {"internship_id": {"$in": list(applied_internship_ids)}}, 
            {"_id": 0, "internship_id": 1, "title": 1, "company_id": 1, "location": 1, "duration": 1, "mode_of_internship": 1}
        ))

        # Fetch company names for the internships
        company_ids = {intern["company_id"] for intern in internships}
        companies = {company["company_id"]: company["name"] for company in companies_collection.find(
            {"company_id": {"$in": list(company_ids)}}, {"_id": 0, "company_id": 1, "name": 1}
        )}

        # Prepare applied_internships data
        applied_internships = [
            {
                "internship_id": internship["internship_id"],
                "title": internship["title"],
                "company_name": companies.get(internship["company_id"], "Unknown"),
                "location": internship["location"],
                "duration": internship["duration"],
                "mode_of_internship": internship["mode_of_internship"],
                "status": app["status"]
            }
            for app in applications
            for internship in internships
            if internship["internship_id"] == app["internship_id"]
        ]

        # Fetch notifications for the student using user_id
        notifications = list(notifications_collection.find(
            {"user_id": user_id}, {"_id": 0, "message": 1}
        ))
        notifications_output = [{"message": notif["message"]} for notif in notifications] if notifications else []

        # Fetch saved internships for the student
        saved_internships = list(saved_internships_collection.find(
            {"student_id": student_id}, {"_id": 0, "internship_id": 1}
        ))
        saved_internship_ids = {saved["internship_id"] for saved in saved_internships}

        # Fetch details of saved internships
        saved_internships_details = list(internships_collection.find(
            {"internship_id": {"$in": list(saved_internship_ids)}}, 
            {"_id": 0, "internship_id": 1, "title": 1, "company_id": 1, "location": 1, "duration": 1, "mode_of_internship": 1, "type_of_internship": 1, "description": 1, "required_skills": 1, "open_positions": 1, "application_deadline": 1, "benefits": 1, "application_process": 1, "stipend_type": 1, "stipend_min": 1, "stipend_max": 1, "internship_status": 1, "contact_email": 1, "internship_domain": 1, "created_date": 1}
        ))

        # Prepare saved_internships data
        saved_internships_output = [
            {
                "internship_id": internship["internship_id"],
                "title": internship["title"],
                "company_name": companies.get(internship["company_id"], "Unknown"),
                "location": internship["location"],
                "duration": internship["duration"],
                "mode_of_internship": internship["mode_of_internship"],
                "type_of_internship": internship.get("type_of_internship", ""),
                "description": internship.get("description", ""),
                "required_skills": internship.get("required_skills", []),
                "open_positions": internship.get("open_positions", 0),
                "application_deadline": internship.get("application_deadline", ""),
                "benefits": internship.get("benefits", []),
                "application_process": internship.get("application_process", ""),
                "stipend_type": internship.get("stipend_type", ""),
                "stipend_min": internship.get("stipend_min", 0.0),
                "stipend_max": internship.get("stipend_max", 0.0),
                "internship_status": internship.get("internship_status", ""),
                "contact_email": internship.get("contact_email", ""),
                "internship_domain": internship.get("internship_domain", ""),
                "created_date": internship.get("created_date", "")
            }
            for internship in saved_internships_details
        ] if saved_internships_details else [
            {"message": "You have not saved any internships yet."}
        ]

        return {
            "applied_internships": applied_internships,
            "application_status_counts": application_status_counts,
            "notifications": notifications_output,
            "saved_internships": saved_internships_output,
            "profile_complete": profile_complete  
        }

    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return {"status": "failed", "message": "An error occurred while fetching dashboard data."}