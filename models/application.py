from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class Application(BaseModel):
    student_id: str
    internship_id: str
    college: str
    department: str
    registration_number: str
    phone: str
    full_name: str
    email: str
    about: str
    dob: str
    gender: str
    location: str
    skills: list
    social_links: dict
    profile_img: Optional[str] = None  # Changed to optional
    resume_link: Optional[str] = None 
    date_applied: str
    status: str

class ApplicationResponse(BaseModel):
    message: str
    status: str
    application_id: Optional[str] = None

class ApplicationListResponse(BaseModel):
    message: str
    status: str
    data: List[Application]