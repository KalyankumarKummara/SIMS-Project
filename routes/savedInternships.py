from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bson import ObjectId
import pymongo
from Dependencies import get_current_user  

savedInternships_router = APIRouter()

# ✅ MongoDB Connection
client = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["InternshipManagement"]

# ✅ Database Collections
applications_collection = db["Applications"]
internships_collection = db["Internships"]
notifications_collection = db["Notifications"]
saved_internships_collection = db["SavedInternships"]
companies_collection = db["Companies"]
students_collection = db["Students"]

# ✅ Pydantic Model for Saving an Internship
class SaveInternshipRequest(BaseModel):
    internship_id: str  

# ✅ Save an Internship
@savedInternships_router.post("/save")
async def save_internship(request: SaveInternshipRequest, user: dict = Depends(get_current_user)):
    student_id = user["user_id"]
    existing = saved_internships_collection.find_one({
        "student_id": student_id,
        "internship_id": request.internship_id
    })
    if existing:
        return JSONResponse(content={"message": "Internship already saved"}, status_code=400)
    saved_data = {
        "student_id": student_id,
        "internship_id": request.internship_id
    }
    saved_internships_collection.insert_one(saved_data)
    return {"message": "Internship saved successfully"}

# ✅ Get all saved internships for a user
@savedInternships_router.get("/saved")
async def get_saved_internships(user: dict = Depends(get_current_user)):
    student_id = user["user_id"]

    saved_internships = list(saved_internships_collection.find({"student_id": student_id}))

    internship_ids = [ObjectId(item["internship_id"]) for item in saved_internships]
    internships = list(internships_collection.find({"_id": {"$in": internship_ids}}))

    for internship in internships:
        internship["_id"] = str(internship["_id"])  

    return {"saved_internships": internships}

# ✅ Remove a saved internship
@savedInternships_router.delete("/remove/{internship_id}")
async def remove_saved_internship(internship_id: str, user: dict = Depends(get_current_user)):
    student_id = user["user_id"]

    result = saved_internships_collection.delete_one({
        "student_id": student_id,
        "internship_id": internship_id
    })

    if result.deleted_count == 0:
        return JSONResponse(content={"message": "Internship not found in saved list"}, status_code=404)

    return {"message": "Internship removed from saved list"}
