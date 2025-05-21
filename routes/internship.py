from fastapi import APIRouter, BackgroundTasks
from datetime import datetime
from bson import ObjectId
from typing import List
from bson.errors import InvalidId
from models.internship import Internship
import pymongo
from email_utils import send_email  

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
internship_col = DB["Internships"]
students_col = DB["Students"]
notifications_col = DB["Notifications"]
companies_col = DB["Companies"]
applications_col = DB["Applications"]

internship_router = APIRouter()

# Function to update internship status based on deadline
def update_internship_status():
    current_date = datetime.utcnow()
    internships = internship_col.find({"internship_status": "Active"})

    for internship in internships:
        deadline = internship.get("application_deadline")
        if deadline and deadline < current_date:
            internship_col.update_one(
                {"_id": internship["_id"]},
                {"$set": {"internship_status": "Inactive"}}
            )

@internship_router.post("/internships/", response_model=dict)
async def create_internship(internship: Internship, background_tasks: BackgroundTasks):
    company_id = internship.company_id  # This is coming as a string

    # Fetch company as a string instead of ObjectId
    company = companies_col.find_one({"_id": company_id})  

    if not company:
       return {"message":"company not found","status":"failed"}

    internship_dict = internship.dict(exclude={"internship_id"})
    
    internship_dict.update({
        "company_id": company_id,  
        "created_date": datetime.utcnow(),
        "internship_status": "Active",  # Default status
    })

    result = internship_col.insert_one(internship_dict)
    internship_id = str(result.inserted_id)  # Convert internship_id to string

    # Update internship document to store internship_id as a string
    internship_col.update_one(
        {"_id": result.inserted_id},
        {"$set": {"internship_id": internship_id}}
    )

    required_skills = internship_dict.get("required_skills", [])
    matching_students = students_col.find({"skills": {"$in": required_skills}})
    
    notifications = []
    for student in matching_students:
        notification = {
            "user_id": str(student["_id"]),
            "message": "A new internship matching your skills has been posted!",
            "type": "internship",
            "is_read": False,
            "created_at": datetime.utcnow(),
            "internship_id": internship_id
        }
        notifications.append(notification)
        
        # Send email to the student
        send_email(
            receiver_email=student["email"],
            subject="New Internship Opportunity",
            body="A new internship matching your skills has been posted!",
            is_html=True  
        )

    if notifications:
        notifications_col.insert_many(notifications)

    # Schedule a background task to update status
    background_tasks.add_task(update_internship_status)

    return {
        "message": "Internship created and matching students notified!",
        "status": "success",
        "internship_id": internship_id
    }

@internship_router.get("/internships", response_model=dict)
async def get_active_internships():
    try:
        pipeline = [
            {"$match": {"internship_status": "Active"}},
            {
                "$lookup": {
                    "from": "Companies",  # Case-sensitive collection name
                    "localField": "company_id",
                    "foreignField": "company_id",
                    "as": "company_info"
                }
            },
            {"$unwind": {"path": "$company_info", "preserveNullAndEmptyArrays": True}},
            {
                "$set": {
                    "company_logo": {
                        "$ifNull": ["$company_info.logo", "/default-logo.png"]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "company_info": 0,
                    "company_id": 0
                }
            }
        ]

        internships = list(internship_col.aggregate(pipeline))
        
        return {
            "message": "Internships retrieved successfully",
            "status": "success",
            "data": internships
        }
        
    except Exception as e:
        print(f"Aggregation error: {str(e)}")  # Add logging
        return {
            "message": "Error retrieving internships",
            "status": "error"
        }



@internship_router.get("/internships/{internship_id}", response_model=dict)
async def get_single_internship(internship_id: str):
    try:
        pipeline = [
            {"$match": {"internship_id": internship_id}},
            {
                "$lookup": {
                    "from": "Companies",
                    "localField": "company_id",
                    "foreignField": "company_id",
                    "as": "company_info"
                }
            },
            {"$unwind": {"path": "$company_info", "preserveNullAndEmptyArrays": True}},
            {
                "$set": {
                    "company_logo": {
                        "$ifNull": ["$company_info.logo", "/default-logo.png"]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "company_info": 0,
                    "company_id": 0
                }
            }
        ]

        internship = internship_col.aggregate(pipeline).next()
        
        return {
            "message": "Internship retrieved successfully",
            "status": "success",
            "data": internship
        }
        
    except Exception as e:
        return {
            "message": "Internship not found",
            "status": "error"
        }

@internship_router.get("/internship/", response_model=list)
async def get_internships():
    internships = internship_col.find()
    return [
        {**internship, "internship_id": str(internship["_id"]), "_id": str(internship["_id"])}
        for internship in internships
    ]


@internship_router.get("/internship/{internship_id}", response_model=dict)
async def get_internship(internship_id: str):
    try:
        obj_id = ObjectId(internship_id)
        internship = internship_col.find_one({"_id": obj_id})
        if internship:
            internship["internship_id"] = str(internship["_id"])
            internship["_id"] = str(internship["_id"])  
            return {"message": "Internship found", "status": "success", "data": internship}
        return {"message": "Internship not found", "status": "failed"}
    except InvalidId:
        return {"message": "Invalid internship_id format", "status": "failed"}


@internship_router.get("/internships/company/{company_id}", response_model=List[dict])
async def get_internships_by_company(company_id: str):
    try:
        # Fetch internships posted by the company
        internships = list(internship_col.find({"company_id": company_id}))

        if not internships:
            return []  # Return empty list if no internships found

        # Calculate application counts for each internship
        for internship in internships:
            internship_id = str(internship["_id"])
            application_count = applications_col.count_documents({"internship_id": internship_id})
            internship["application_count"] = application_count

        # Remove MongoDB ObjectId from the response
        for internship in internships:
            internship["_id"] = str(internship["_id"])

        return internships  # Return the list of internships with application_count
    except Exception as e:
        print(f"Error fetching internships: {e}")
        return []  # Return empty list in case of error
    

@internship_router.put("/internship/{internship_id}", response_model=dict)
async def update_internship(internship_id: str, internship: Internship):
    try:
        obj_id = ObjectId(internship_id)
    except InvalidId:
        return {"message": "Invalid internship_id format", "status": "failed"}

    update_data = internship.dict(exclude_unset=True)
    result = internship_col.update_one({"_id": obj_id}, {"$set": update_data})

    if result.modified_count > 0:
        updated_internship = internship_col.find_one({"_id": obj_id})
        if updated_internship:
            updated_internship["internship_id"] = str(updated_internship["_id"])
            return {"message": "Internship modified successfully", "status": "success"}
    
    return {"message": "Internship not found or no changes made", "status": "failed"}


@internship_router.delete("/internships/{internship_id}", response_model=dict)
async def delete_internship(internship_id: str):
    try:
        obj_id = ObjectId(internship_id)
    except InvalidId:
        return {"message": "Invalid internship_id format", "status": "failed"}

    result = internship_col.delete_one({"_id": obj_id})
    
    if result.deleted_count > 0:
        return {"message": "Internship deleted successfully", "status": "success"}
    
    return {"message": "Internship not found", "status": "failed"}




from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(update_internship_status, 'interval', hours=1)
scheduler.start()
