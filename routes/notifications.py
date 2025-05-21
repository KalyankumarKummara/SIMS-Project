from fastapi import APIRouter
from typing import List
from datetime import datetime
from models.notifications import Notifications
from pymongo import MongoClient
from bson import ObjectId

notification_router = APIRouter()

myclient = MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
notifications_collection = DB["Notifications"]

@notification_router.get("/notifications/{user_id}")
async def get_notifications(user_id: str):
    notifications = notifications_collection.find({"user_id": user_id})
    notifications_list = [{**notif, "_id": str(notif["_id"])} for notif in notifications]
    return {"message": "Notifications retrieved successfully", "data": notifications_list}

@notification_router.put("/notifications/{notification_id}")
async def mark_notification_as_read(notification_id: str):
    result = notifications_collection.update_one(
        {"_id": ObjectId(notification_id)}, {"$set": {"is_read": True}}
    )
    if result.modified_count == 0:
        return {"message": "No changes made", "status": "warning"}
    return {"message": "Notification marked as read", "status": "success"}

@notification_router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: str):
    result = notifications_collection.delete_one({"_id": ObjectId(notification_id)})
    if result.deleted_count == 0:
        return {"message": "Notification not found", "status": "failed"}
    return {"message": "Notification deleted successfully", "status": "success"}
@notification_router.put("/notifications/mark-all-read/{user_id}")


async def mark_all_notifications_as_read(user_id: str):
    result = notifications_collection.update_many(
        {"user_id": user_id, "is_read": False}, {"$set": {"is_read": True}}
    )
    if result.modified_count == 0:
        return {"message": "No unread notifications found", "status": "warning"}
    return {"message": f"{result.modified_count} notifications marked as read", "status": "success"}


@notification_router.delete("/notifications/delete-all/{user_id}")
async def delete_all_notifications(user_id: str):
    result = notifications_collection.delete_many({"user_id": user_id})
    if result.deleted_count == 0:
        return {"message": "No notifications found", "status": "failed"}
    return {"message": f"{result.deleted_count} notifications deleted", "status": "success"}

