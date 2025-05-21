from fastapi import APIRouter, Depends, Query
from bson import ObjectId, errors
from datetime import datetime
from Dependencies import get_current_user 
from email_utils import send_status_update_email
from models.application import Application, ApplicationResponse  
import pymongo

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
applications_col = DB["Applications"]
students_col = DB["Students"]
companies_col = DB["Companies"]
internships_col = DB["Internships"]
notification_col = DB["Notifications"]
application_router = APIRouter()

@application_router.post("/applications/", response_model=ApplicationResponse)
async def apply_for_internship(
    internship_id: str = Query(..., description="The ID of the internship to apply for"),  
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "student":
        return {"message": "Only students can apply for internships", "status": "failed"}

    if current_user["status"] == "failed":
        return current_user

    student_id = current_user["user_id"]

    try:
        student = students_col.find_one({"_id": student_id})
    except Exception as e:
        return {"message": f"Error fetching student: {str(e)}", "status": "failed"}

    if not student:
        return {"message": "Student not found", "status": "failed"}

    internship = internships_col.find_one({"_id": ObjectId(internship_id)})
    if not internship:
        return {"message": "Internship not found", "status": "failed"}

    existing_application = applications_col.find_one({"student_id": student_id, "internship_id": internship_id})
    if existing_application:
        return {"message": "You have already applied for this internship", "status": "failed"}

    # Remove profile_img from required fields
    required_fields = ["college", "department", "registration_number", "phone", "about", 
                      "dob", "gender", "location", "skills", "social_links"]
    missing_fields = [field for field in required_fields if field not in student or not student[field]]

    if missing_fields:
        return {"message": f"Missing required fields in profile: {', '.join(missing_fields)}", "status": "failed"}

    application = Application(
        student_id=student_id,
        internship_id=internship_id,
        college=student["college"],
        department=student["department"],
        registration_number=student["registration_number"],
        phone=student["phone"],
        full_name=student["name"],
        email=student["email"],
        about=student["about"],
        dob=student["dob"],
        gender=student["gender"],
        location=student["location"],
        skills=student["skills"],
        social_links=student["social_links"],
        profile_img=student.get("profile_img"),  # Use get() with default None
        resume_link=student.get("resume_link", ""), 
        date_applied=datetime.utcnow().isoformat(),
        status="pending"
    )

    inserted_application = applications_col.insert_one(application.dict())
    application_id = str(inserted_application.inserted_id)

    return {"message": "Application submitted successfully!", "status": "success", "application_id": application_id}

# Rest of the routes remain the same as in original code
@application_router.get("/students/{student_id}/applied-internships")
async def get_applied_internships(student_id: str):
    """
    Retrieve applied internships for a student with details like company name, title, domain, etc.
    """
    try:
        # Fetch applications for the student
        applications = list(applications_col.find({"student_id": student_id}))

        if not applications:
            return {"status": "no_data", "message": "No applications found for this student."}

        # Fetch internship and company details for each application
        applied_internships = []
        for app in applications:
            internship = internships_col.find_one({"_id": ObjectId(app["internship_id"])})
            if not internship:
                continue  # Skip if internship not found

            company = companies_col.find_one({"company_id": internship["company_id"]})
            if not company:
                continue  # Skip if company not found

            applied_internships.append({
                "application_id": str(app["_id"]),  # Convert ObjectId to string
                "company_name": company.get("name", "N/A"),
                "title": internship.get("title", "N/A"),
                "domain": internship.get("internship_domain", "N/A"),
                "type": internship.get("type_of_internship", "N/A"),
                "location": internship.get("location", "N/A"),
                "duration": internship.get("duration", "N/A"),
                "applied_date": app.get("date_applied", "N/A"),
                "status": app.get("status", "N/A"),
            })

        if not applied_internships:
            return {"status": "no_data", "message": "No internship details found for the applications."}

        return {"status": "success", "data": applied_internships}

    except Exception as e:
        return {"status": "failed", "message": f"An error occurred: {str(e)}"}
    
@application_router.get("/companies/{company_id}/applications")
async def get_company_applications(company_id: str):
    """Retrieve all applications for internships posted by a company, filtered by status."""
    
    # Find internships posted by the company
    internships = list(internships_col.find({"company_id": company_id}))  # Convert cursor to list
    internship_ids = [str(internship["_id"]) for internship in internships]

    if not internship_ids:
        return {"status": "failed", "message": "No internships found for this company."}

    # Fetch applications for these internships
    applications = list(applications_col.find({"internship_id": {"$in": internship_ids}}))  # Convert cursor to list

    # Filter applications by status
    shortlisted_applications = [app for app in applications if app.get("status") == "shortlisted"]
    accepted_applications = [app for app in applications if app.get("status") == "accepted"]

    # Convert ObjectId fields to string for JSON serialization
    def convert_object_ids(apps):
        for app in apps:
            app["_id"] = str(app["_id"])  # Convert ObjectId to string
            app["internship_id"] = str(app["internship_id"])  # Convert internship_id to string
        return apps

    shortlisted_applications = convert_object_ids(shortlisted_applications)
    accepted_applications = convert_object_ids(accepted_applications)

    return {
        "status": "success",
        "data": {
            "shortlisted": shortlisted_applications,
            "accepted": accepted_applications
        }
    }

@application_router.get("/applications/{application_id}")
async def get_application(application_id: str):
    try:
        application = applications_col.find_one({"_id": ObjectId(application_id)})
        if not application:
            return {"status": "failed", "message": "Application not found"}
        
        application["_id"] = str(application["_id"])
        application["internship_id"] = str(application["internship_id"])
        return {"status": "success", "data": application}
    except Exception as e:
        return {"status": "failed", "message": f"An error occurred: {str(e)}"}
    
    
@application_router.get("/internships/{internship_id}/applications")
async def get_applications_for_internship(internship_id: str):
    """Retrieve all applications for a specific internship."""
    
    # Validate internship_id
    if not ObjectId.is_valid(internship_id):
        return {"status": "failed", "message": "Invalid internship ID."}

    # Fetch applications for the internship
    applications = list(applications_col.find({"internship_id": internship_id}))

    if not applications:
        return {"status": "failed", "message": "No applications found for this internship."}

    # Convert ObjectId fields to string for JSON serialization
    for app in applications:
        app["_id"] = str(app["_id"])  # Convert ObjectId to string
        app["internship_id"] = str(app["internship_id"])  # Convert internship_id to string

    return {"status": "success", "data": applications}

@application_router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: str, 
    status: str = Query(..., description="Status must be one of: accepted, rejected, shortlisted"),
    current_user: dict = Depends(get_current_user)
):
    """Company updates the status of an application."""
    
    if current_user["role"] != "recruiter":
        return {"status": "failed", "message": "You are not authorized to update the application status.", "code": 403}

    status = status.lower()

    valid_statuses = ["accepted", "rejected", "shortlisted"]
    if status not in valid_statuses:
        return {"status": "failed", "message": f"Invalid status. Valid values are: {', '.join(valid_statuses)}."}

    application = applications_col.find_one({"_id": ObjectId(application_id)})
    if not application:
        return {"status": "failed", "message": "Application not found"}

    internship = internships_col.find_one({"_id": ObjectId(application["internship_id"])})
    if not internship or internship["company_id"] != current_user["user_id"]:
        return {"status": "failed", "message": "This application does not belong to your posted internship."}

    updated_application = applications_col.find_one_and_update(
        {"_id": ObjectId(application_id)},
        {"$set": {"status": status}},
        return_document=pymongo.ReturnDocument.AFTER
    )

    if not updated_application:
        return {"status": "failed", "message": "Application not found"}

    # Send email notification
    send_status_update_email(updated_application["email"], status)

    
    notification_message = f"Your application status has been updated to: {status}."
    
    notification = {
        "user_id": updated_application["student_id"],
        "message": notification_message,
        "type": "status_update",  
        "is_read": False, 
        "created_at": datetime.utcnow()
        
    }

    notification_col.insert_one(notification)

    return {
        "status": "success",
        "message": f"Application status updated to {status}.",
        "application_id": application_id
    }



@application_router.delete("/applications/{application_id}/student/{student_id}")
async def delete_application(application_id: str, student_id: str):
    try:
        # Ensure application_id is a valid ObjectId
        application_id = application_id.strip("{}")  # Remove unwanted characters
        object_id = ObjectId(application_id)  # Convert to ObjectId

        application = applications_col.find_one({"_id": object_id, "student_id": student_id})
        
        if not application:
            return {"status": "failed", "message": "Application not found or unauthorized access."}

        # Delete the application
        applications_col.delete_one({"_id": object_id})
        return {"status": "success", "message": "Application deleted successfully."}

    except errors.InvalidId:
        return {"status": "failed", "message": "Invalid application ID format."}