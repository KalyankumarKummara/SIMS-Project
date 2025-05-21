from fastapi import APIRouter, Depends
import pymongo
from bson import ObjectId
from Dependencies import get_User
from fastapi.responses import JSONResponse

# Database connection
myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
internships_col = DB["Internships"]

# Define router
admin_internship_router = APIRouter()


def admin_only(current_user):
    """Ensure only admins can access."""
    if not current_user or current_user.get("role") != "admin":
        return JSONResponse(status_code=403, content={"status": "failed", "message": "Unauthorized access"})
    return None


@admin_internship_router.get("/admin/internships")
async def get_all_internships(current_user: dict = Depends(get_User)):
    """Admin fetches all internships."""
    if response := admin_only(current_user):
        return response

    internships = list(internships_col.find({}))
    for internship in internships:
        internship["_id"] = str(internship["_id"])

    return {"status": "success", "data": internships}


@admin_internship_router.delete("/admin/internship/{internship_id}")
async def delete_internship(internship_id: str, current_user: dict = Depends(get_User)):
    """Admin deletes an internship."""
    if response := admin_only(current_user):
        return response

    result = internships_col.delete_one({"_id": ObjectId(internship_id)})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"status": "failed", "message": "Internship not found"})

    return {"status": "success", "message": "Internship deleted successfully"}


@admin_internship_router.put("/admin/internship/{internship_id}/{status}")
async def update_internship_status(
    internship_id: str,
    status: str,
    current_user: dict = Depends(get_User)
):
    """Admin updates internship status (active/inactive)."""

    if response := admin_only(current_user):
        return response

    result = internships_col.update_one(
        {"_id": ObjectId(internship_id)}, 
        {"$set": {"internship_status": status}}  
    )
    
    if result.matched_count == 0:
        return JSONResponse(status_code=404, content={"status": "failed", "message": "Internship not found"})
    if result.modified_count == 0:
        return{"status": "failed", "message": "No changes done"}

    return {"status": "success", "message": "Internship status updated successfully"}

