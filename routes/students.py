from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import List, Optional
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import shutil
import os
import json
from pydantic import BaseModel
from dotenv import load_dotenv
from config import cloudinary
import cloudinary.uploader
load_dotenv()

student_router = APIRouter()


MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
myclient = MongoClient(MONGODB_URI)
DB = myclient["InternshipManagement"]
students_collection = DB["Students"]
users_collection = DB["Users"]


class UpdateProfileResponse(BaseModel):
    message: str
    status: str
    profile_complete: bool


class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

import cloudinary.uploader

@student_router.put("/Students/{student_id}", response_model=UpdateProfileResponse)
async def update_student_profile(
    student_id: str,
    name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    dob: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    about: Optional[str] = Form(None),
    college: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    registration_number: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),    
    social_links: Optional[str] = Form(None), 
    profile_img: Optional[UploadFile] = File(None),  
    resume_link: Optional[UploadFile] = File(None),
):
    existing_student = students_collection.find_one({"student_id": student_id})
    if not existing_student:
        return {"message": "Student not found", "status": "failed", "profile_complete": False}

    try:
        skills_data = json.loads(skills) if skills else []
        social_links_data = json.loads(social_links) if social_links else {}
    except json.JSONDecodeError as e:
        return {"message": f"Invalid JSON data: {str(e)}", "status": "failed", "profile_complete": False}

    update_data = {
        "name": name,
        "phone": phone,
        "dob": dob,
        "gender": gender,
        "location": location,
        "about": about,
        "college": college,
        "department": department,
        "registration_number": registration_number,
        "skills": skills_data,
        "social_links": social_links_data,
        "updated_at": datetime.utcnow(),
    }

    ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png","image/jpg"]
    ALLOWED_RESUME_TYPE = "application/pdf"

    if profile_img:
        if profile_img.content_type not in ALLOWED_IMAGE_TYPES:
            return {"message": "Profile image must be JPEG or PNG or JPG", "status": "failed", "profile_complete": False}
        
        try:
            cloudinary_response = cloudinary.uploader.upload(profile_img.file, folder="profile_images", public_id=f"{student_id}_profile")
            update_data["profile_img"] = cloudinary_response["secure_url"]
        except Exception as e:
            return {"message": f"Cloudinary upload failed: {str(e)}", "status": "failed", "profile_complete": False}

  
    if resume_link:
        if resume_link.content_type != ALLOWED_RESUME_TYPE:
            return {"message": "Resume must be a PDF file", "status": "failed", "profile_complete": False}
        
        try:
            cloudinary_response = cloudinary.uploader.upload(resume_link.file, resource_type="raw", folder="resumes", public_id=f"{student_id}_resume")
            update_data["resume_link"] = cloudinary_response["secure_url"]
        except Exception as e:
            return {"message": f"Cloudinary upload failed: {str(e)}", "status": "failed", "profile_complete": False}

    # Profile Completion Check
    required_fields = ["name", "phone", "dob", "gender", "location", "college", "skills"]
    profile_complete = all(existing_student.get(field) or update_data.get(field) for field in required_fields)
    update_data["profile_complete"] = profile_complete

    # Update MongoDB
    students_collection.update_one({"student_id": student_id}, {"$set": update_data})
    users_collection.update_one({"_id": ObjectId(student_id)}, {"$set": {"profile_complete": profile_complete}})

    return UpdateProfileResponse(
        message="Profile updated successfully",
        status="success",
        profile_complete=profile_complete,
    )
