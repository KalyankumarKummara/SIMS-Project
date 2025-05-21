import secrets
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import pymongo
from email_utils import send_email

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
mycol = DB["Users"]

forgot_password_router = APIRouter()

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@forgot_password_router.post("/forgot_password")
async def forgot_password(data: ForgotPasswordRequest):
    email = data.email.lower()
    user = mycol.find_one({"email": email})

    if not user:
        return {"message": "Email not found"}

    reset_token = secrets.token_urlsafe(32)  # Generate secure token
    expires_at = datetime.utcnow() + timedelta(minutes=30)  # Set expiration time

    # Save token in the database
    mycol.update_one(
        {"email": email},
        {"$set": {"reset_token": reset_token, "expires_at": expires_at}}
    )

    # Construct the reset link
    reset_link = f"https://your-site.com/reset-password/{reset_token}"

    # Send email with reset link
    subject = "Password Reset Link"
    body = f"""
    <div style="font-size: 18px; font-weight: bold; text-align: center;">
        Click the button below to reset your password:
    </div>
    <div style="text-align: center; margin-top: 20px;">
        <a href="{reset_link}" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reset Password
        </a>
    </div>
    <p style="text-align: center;">Or use this link: <br> <a href="{reset_link}">{reset_link}</a></p>
    <p style="text-align: center;">This link will expire in 30 minutes.</p>
    """

    send_email(email, subject, body, is_html=True)

    # Return the reset token for automatic redirection
    return {"message": "Password reset link sent", "reset_token": reset_token}
