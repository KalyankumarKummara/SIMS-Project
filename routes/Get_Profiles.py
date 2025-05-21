from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from typing import Optional, List
import pymongo
from config import cloudinary
import cloudinary.uploader
from datetime import datetime
# MongoDB connection
myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
students_collection = DB["Students"]
companies_collection = DB["Companies"]
users_collection = DB["Users"]

profile_router = APIRouter()

# Get Student Profile
@profile_router.get("/student-profile/{student_id}")
async def get_student_profile(student_id: str):
    student_profile = students_collection.find_one(
        {"student_id": student_id}, {"_id": 0}
    )

    if not student_profile:
        return {"message": "Student profile not found", "status": "failed"}

    student_profile["profile_complete"] = student_profile.get("profile_complete", False)

    return {
        "message": "Profile retrieved successfully",
        "status": "success",
        "data": student_profile,
    }

@profile_router.put("/student-profile/{student_id}")
async def update_student_profile(
    student_id: str,
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    dob: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    college: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    registration_number: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    about: Optional[str] = Form(None),
    resume_link: Optional[str] = Form(None),
    skills: Optional[List[str]] = Form(None),
    social_links_linkedin: Optional[str] = Form(None),
    social_links_github: Optional[str] = Form(None),
    social_links_portfolio: Optional[str] = Form(None),
    profile_img: Optional[UploadFile] = File(None),
    remove_profile_img: Optional[bool] = Form(False)
):
    # Get existing student data
    existing_student = students_collection.find_one({"student_id": student_id})
    if not existing_student:
        return {"message": "Student not found", "status": "failed", "data": None}

    # Merge existing data with new updates
    updated_data = existing_student.copy()
    del updated_data["_id"]  # Remove MongoDB ID

    # Only update fields that are provided in the request
    fields_to_update = {
        "name": name,
        "email": email,
        "phone": phone,
        "dob": dob,
        "gender": gender,
        "college": college,
        "department": department,
        "registration_number": registration_number,
        "location": location,
        "about": about,
        "resume_link": resume_link,
        "skills": skills,
        "social_links.linkedin": social_links_linkedin,
        "social_links.github": social_links_github,
        "social_links.portfolio": social_links_portfolio,
    }

    for key, value in fields_to_update.items():
        if value is not None:
            # Handle nested social_links using dot notation
            if "." in key:
                parent_key, child_key = key.split(".")
                updated_data.setdefault(parent_key, {})[child_key] = value
            else:
                updated_data[key] = value

    # Handle profile image updates
    try:
        if remove_profile_img:
            if existing_student.get("profile_img"):
                public_id = f"profile_images/{student_id}_profile"
                cloudinary.uploader.destroy(public_id)
                updated_data["profile_img"] = None

        if profile_img:
            if existing_student.get("profile_img"):
                public_id = f"profile_images/{student_id}_profile"
                cloudinary.uploader.destroy(public_id)
            cloudinary_response = cloudinary.uploader.upload(
                profile_img.file,
                folder="profile_images",
                public_id=f"{student_id}_profile",
                overwrite=True
            )
            updated_data["profile_img"] = cloudinary_response["secure_url"]
    except cloudinary.exceptions.Error as e:
        return {"message": f"Image processing failed: {str(e)}", "status": "failed", "data": None}

    # Update database
    students_collection.update_one(
        {"student_id": student_id},
        {"$set": updated_data}
    )

    # Get updated document
    updated_student = students_collection.find_one({"student_id": student_id}, {"_id": 0})
    return {"message": "Profile updated successfully", "status": "success", "data": updated_student}

@profile_router.get("/company-profile/{company_id}")
async def get_company_profile(company_id: str):
    company_profile = companies_collection.find_one(
        {"company_id": company_id}, {"_id": 0}
    )

    if not company_profile:
        return {"message": "Company profile not found", "status": "failed"}

    return {
        "message": "Profile retrieved successfully",
        "status": "success",
        "data": company_profile,
    }

@profile_router.put("/company-profile/{company_id}")
async def update_company_profile(
    company_id: str,
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    industry: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    company_benefits: Optional[List[str]] = Form(None),
    social_links_linkedin: Optional[str] = Form(None),
    social_links_twitter: Optional[str] = Form(None),
    social_links_facebook: Optional[str] = Form(None),
    social_links_other: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    remove_logo: Optional[bool] = Form(False)
):
    # Get existing company data
    existing_company = companies_collection.find_one({"company_id": company_id})
    if not existing_company:
        return {"message": "Company not found", "status": "failed", "data": None}

    # Merge existing data with new updates
    updated_data = existing_company.copy()
    del updated_data["_id"]  # Remove MongoDB ID

    # Update basic fields
    fields_to_update = {
        "name": name,
        "email": email,
        "description": description,
        "industry": industry,
        "location": location,
        "phone": phone,
        "size": size,
        "website": website,
        "company_benefits": company_benefits,
        "social_links.linkedin": social_links_linkedin,
        "social_links.twitter": social_links_twitter,
        "social_links.facebook": social_links_facebook,
        "social_links.other": social_links_other,
    }

    for key, value in fields_to_update.items():
        if value is not None:
            if "." in key:
                parent_key, child_key = key.split(".")
                updated_data.setdefault(parent_key, {})[child_key] = value
            else:
                updated_data[key] = value

    # Handle logo updates
    try:
        if remove_logo:
            if existing_company.get("logo"):
                public_id = f"company_logos/{company_id}_logo"
                cloudinary.uploader.destroy(public_id)
                updated_data["logo"] = None  # Set logo to null in the database

        if logo:
            if existing_company.get("logo"):
                public_id = f"company_logos/{company_id}_logo"
                cloudinary.uploader.destroy(public_id)
            cloudinary_response = cloudinary.uploader.upload(
                logo.file,
                folder="company_logos",
                public_id=f"{company_id}_logo",
                overwrite=True
            )
            updated_data["logo"] = cloudinary_response["secure_url"]
    except cloudinary.exceptions.Error as e:
        return {"message": f"Image processing failed: {str(e)}", "status": "failed", "data": None}

    # Update database
    update_time = datetime.now()
    updated_data["updated_at"] = update_time

    # Update companies collection
    companies_collection.update_one(
        {"company_id": company_id},
        {"$set": updated_data}
    )

    # Update users collection
    users_collection.update_one(
        {"company_id": company_id},
        {"$set": {
            "name": updated_data.get("name"),
            "email": updated_data.get("email"),
            "updated_at": update_time
        }}
    )

    # Get updated document
    updated_company = companies_collection.find_one({"company_id": company_id}, {"_id": 0})
    return {"message": "Profile updated successfully", "status": "success", "data": updated_company}