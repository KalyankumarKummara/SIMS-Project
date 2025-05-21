
from pydantic import BaseModel, field_validator, EmailStr
from typing import List, Optional
from datetime import datetime
from pydantic_core.core_schema import ValidationInfo
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Internship(BaseModel):
    company_id: str
    company_name: str
    title: str
    type_of_internship: str
    description: str
    required_skills: List[str]
    location: str
    duration: str
    mode_of_internship: str
    open_positions: int
    application_deadline: str
    created_date: str
    benefits: List[str]
    application_process: str
    stipend_type: str
    stipend_min: Optional[float] = Field(default=0.0)  # Default to 0 if not provided
    stipend_max: Optional[float] = Field(default=0.0)  # Default to 0 if not provided
    internship_status: str = "Pending"
    contact_email: str
    internship_domain: str 

    @field_validator("stipend_min", "stipend_max", mode="before")
    def validate_stipend(cls, v, info: ValidationInfo):
        stipend_types = info.data.get("stipend_type", [])
        if "Unpaid" in stipend_types:
            return None  # ✅ Ensures stipend values are None if unpaid
        return v
