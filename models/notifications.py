from pydantic import BaseModel
from typing import List,Optional
from datetime import datetime,date
from bson import ObjectId
class Notifications(BaseModel):
    _id : Optional[str] = None
    user_id : str
    message : str
    type : str
    is_read : bool = False
    created_at : datetime = datetime.utcnow()
