from fastapi import APIRouter, Depends
import pymongo
from bson import ObjectId
from Dependencies import get_User
from Dependencies import get_Admin_User
from fastapi.responses import JSONResponse

# Database connection
myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
users_col = DB["Users"]

# Define router
admin_crud_router = APIRouter()

@admin_crud_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_User)):
    print("Current User in Admin CRUD:", current_user)  # Debugging print

    if not isinstance(current_user, dict) or "role" not in current_user:
        return JSONResponse(status_code=401, content={"status": "failed", "message": "Unauthorized access"})

    if current_user["role"] != "admin":
        return JSONResponse(status_code=403, content={"status": "failed", "message": "Access denied"})

    users = list(users_col.find({}, {"password": 0}))  # Exclude passwords
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string

    return {"status": "success", "data": users}



@admin_crud_router.get("/admin/user/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(get_User)):
    if not current_user or current_user.get("role") != "admin":  # Check None or missing role
        return JSONResponse(status_code=403, content={"status": "failed", "message": "Unauthorized access"})

    user = users_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})

    if not user:
        return JSONResponse(status_code=404, content={"status": "failed", "message": "User not found"})

    user["_id"] = str(user["_id"])
    return {"status": "success", "data": user}


@admin_crud_router.put("/admin/user/{user_id}")
async def update_user(user_id: str, status: str, current_user: dict = Depends(get_Admin_User)):
    """Update user status (Admin only)."""
    print("Current User:", current_user)

    
    if current_user["role"] != "admin":
        return {"status": "failed", "message": "Unauthorized access"}

    update_result = users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": status}} 
    )

    if update_result.matched_count == 0:
        return {"status": "failed", "message": "User not found"}
    if update_result.modified_count == 0:
        return{"status": "failed", "message": "No changes done"}
    return {"status": "success", "message": "User updated successfully"}


@admin_crud_router.delete("/admin/user/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_User)):
    """Delete a user (Admin only)."""

    if current_user["role"] != "admin":
        return JSONResponse(status_code=403, content={"status": "failed", "message": "Unauthorized access"})

    delete_result = users_col.delete_one({"_id": ObjectId(user_id)})

    if delete_result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"status": "failed", "message": "User not found"})

    return {"status": "success", "message": "User deleted successfully"}
