from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime
from typing_extensions import Literal

class Companies(BaseModel):
    company_id: str
    name: str
    email: EmailStr
    phone: str
    industry: str
    location: str
    website: Optional[str] = None 
    description: Optional[str] = None  
    logo: Optional[str] = None  
    size: Optional[Literal["Startup", "Small", "Medium", "Large"]] = None  
    social_links: Optional[Dict[str, str]] = None  
    created_at: datetime
    updated_at: datetime

