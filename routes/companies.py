from fastapi import APIRouter, UploadFile, File, Form
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from typing import Optional
import json
from config import cloudinary
import cloudinary.uploader
company_router = APIRouter()

myclient = MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
companies_collection = DB["Companies"]
users_collection = DB["Users"]

def parse_json_field(json_str: Optional[str]):
    if not json_str:
        return {}
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}

@company_router.put("/Companies/{company_id}")
async def update_company_profile(
    company_id: str,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    industry: str = Form(...),
    location: str = Form(...),
    website: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    social_links: Optional[str] = Form(None),  
    logo: Optional[UploadFile] = File(None),  
):
    existing_company = companies_collection.find_one({"company_id": company_id})
    if not existing_company:
        return {"message": "Company not found", "status": "failed"}

    update_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "industry": industry,
        "location": location,
        "website": website,
        "description": description,
        "size": size,
        "social_links": parse_json_field(social_links),
        "updated_at": datetime.utcnow(),
    }

    if logo:
        try:
            upload_result = cloudinary.uploader.upload(logo.file, folder="company_logos/")
            update_data["logo"] = upload_result["secure_url"]
        except Exception as e:
            return {"message": f"Failed to upload logo: {str(e)}", "status": "failed"}
    else:
        update_data["logo"] = existing_company.get("logo", "")

    required_fields = ["name", "email", "location", "phone"]
    if all(field in update_data and update_data[field] for field in required_fields):
        update_data["profile_complete"] = True
        users_collection.update_one(
            {"_id": ObjectId(company_id)}, {"$set": {"profile_complete": True}}
        )

    result = companies_collection.update_one(
        {"company_id": company_id}, {"$set": update_data}
    )

    if result.modified_count == 0:
        return {"message": "No changes made", "status": "warning"}

    return {"message": "Profile updated successfully", "status": "success", "logo_url": update_data["logo"]}
