from pydantic import BaseModel,EmailStr
from typing import Optional,List,Dict
from datetime import datetime,date
from typing_extensions import Literal

class Students(BaseModel):
 student_id : str
 name : str
 email : EmailStr
 college: str  
 department: str
 registration_number: str
 phone : str
 dob : date
 gender : Literal["Male","Female","Other"]
 location : str
 profile_img :Optional[str] = None
 about : Optional[str] = None
 skills : List[str]
 education : List[Dict[str,str]]
 experience : List[Dict[str,str]]
 certifications : List[Dict[str,str]]
 projects : List[Dict[str,str]]
 resume_link : Optional[str] = None
 social_links : Optional[Dict[str,str]]
 created_at : datetime
 updated_at : datetime
