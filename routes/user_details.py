from fastapi import APIRouter
import pymongo
from fastapi.responses import JSONResponse

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
students_collection = DB["Students"]
companies_collection = DB["Companies"]

user_details_router = APIRouter()

@user_details_router.get("/user-details/{user_id}")
async def get_user_details(user_id: str):
    # Check if the user is a student
    student = students_collection.find_one({"student_id": user_id}, {"_id": 0, "name": 1, "email": 1})
    if student:
        return {
            "message": "Student details retrieved successfully",
            "status": "success",
            "data": student,
        }

    # Check if the user is a company
    company = companies_collection.find_one({"company_id": user_id}, {"_id": 0, "name": 1, "email": 1, "profile_complete": 1})

    # If company not found, return a custom error response
    if not company:
        return JSONResponse(
            status_code=404,
            content={
                "message": "Company not found",
                "status": "failed",
            },
        )

    # Return the company details
    return {
        "message": "Company details retrieved successfully",
        "status": "success",
        "data": company,  # Include all fields, including profile_complete
    }