from fastapi import APIRouter, Depends, Security
from fastapi.security import OAuth2PasswordBearer
import pymongo
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="company/login")

client = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["InternshipManagement"]
applications_collection = db["Applications"]
internships_collection = db["Internships"]
notifications_collection = db["Notifications"]
companies_collection = db["Companies"]

company_dashboard_router = APIRouter()

def verify_company(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") not in ["company", "recruiter"]:
            return {"status": "failed", "message": "Access denied"}
        return payload
    except JWTError:
        return {"status": "failed", "message": "Invalid or expired token"}

@company_dashboard_router.get("/company/dashboard")
async def company_dashboard(user: dict = Depends(verify_company)):
    """Retrieve company dashboard details."""
    if not isinstance(user, dict) or "status" in user:
        return user  

    company_id = user.get("user_id")
    if not company_id:
        return {"status": "failed", "message": "Invalid token: Missing user_id"}

    # Fetch the company document including the profile_complete field
    company = companies_collection.find_one(
        {"company_id": company_id},
        {"_id": 0, "company_id": 1, "profile_complete": 1}
    )
    print("Company Record Found:", company)

    if not company:
        return {"status": "failed", "message": "Company not found"}

    # Fetch internships posted by the company
    internships = list(internships_collection.find(
        {"company_id": company_id},
        {"_id": 0, "internship_id": 1, "title": 1, "location": 1, "duration": 1, "mode_of_internship": 1,"internship_domain": 1, "type_of_internship": 1, "internship_status": 1, "application_deadline":1}
    ))

    # Get internship IDs for fetching applications
    internship_ids = [internship["internship_id"] for internship in internships]

    # Fetch applications for the internships
    applications = list(applications_collection.find(
        {"internship_id": {"$in": internship_ids}},
        {"_id": 0, "internship_id": 1, "student_email": 1, "status": 1}
    ))

    # Calculate application status counts
    application_status_counts = {
        "pending": sum(1 for app in applications if app["status"] == "pending"),
        "accepted": sum(1 for app in applications if app["status"] == "accepted"),
        "rejected": sum(1 for app in applications if app["status"] == "rejected"),
        "shortlisted": sum(1 for app in applications if app["status"] == "shortlisted")
    }

    # # Fetch notifications for the company
    # notifications = list(notifications_collection.find(
    #     {"company_id": company_id},
    #     {"_id": 0, "message": 1}
    # ))

    # if not notifications:
    #     notifications = "You have no notifications"

    # Include profile_complete in the response
    return {
        "status": "success",
        "posted_internships": internships,
        "application_status_counts": application_status_counts,
        "profile_complete": company.get("profile_complete", False)  # Default to False if not present
    }