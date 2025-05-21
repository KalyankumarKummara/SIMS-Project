from fastapi import APIRouter
from pydantic import BaseModel
import random
import pymongo
from email_utils import send_email

# Database Setup
myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
users_collection = DB["Users"]

verification_router = APIRouter()

# ✅ Define Request Model
class VerifyEmailRequest(BaseModel):
    email: str
    token: int

class ResendVerificationRequest(BaseModel):
    email: str

# ✅ Verify Email API
@verification_router.post("/verify-email")
async def verify_email(request: VerifyEmailRequest):
    email = request.email.lower()
    token = request.token

    user = users_collection.find_one({"email": email})

    if not user:
        print("DEBUG: Email not found in database")
        return {"message": "Email not found", "status": "failed"}

    print(f"DEBUG: Found user: {user}")

    if user.get("is_verified", False):
        print("DEBUG: Email already verified")
        return {"message": "Email already verified", "status": "success"}

    stored_token = user.get("verification_token")

    # Debugging - Log token values
    print(f"DEBUG: Stored Token = {stored_token} ({type(stored_token)}), Received Token = {token} ({type(token)})")

    # Ensure both tokens are integers before comparison
    if int(stored_token) != int(token):
        print("DEBUG: Token mismatch! Verification failed.")
        return {"message": "Invalid verification code", "status": "failed"}

    # ✅ Update database - Mark email as verified
    users_collection.update_one({"email": email}, {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}})

    print("DEBUG: Email verified successfully!")
    return {"message": "Email verified successfully", "status": "success"}

# ✅ Resend Verification Email API
@verification_router.post("/resend-verification-email")
async def resend_verification_email(request: ResendVerificationRequest):
    email = request.email.lower()
    user = users_collection.find_one({"email": email})

    if not user:
        return {"message": "Email not found", "status": "failed"}

    if user.get("is_verified", False):
        return {"message": "Email is already verified", "status": "success"}

    # Generate new verification token
    new_token = random.randint(100000, 999999)

    users_collection.update_one({"email": email}, {"$set": {"verification_token": new_token}})

    subject = "Resend: Verify Your Email"
    body = f"""
    <html>
    <body style="text-align: center; color: red; font-size: 18px;">
        <h2>Email Verification</h2>
        <p>Your new verification code is: <strong>{new_token}</strong></p>
        <p>Please use this code to verify your email and activate your account.</p>
    </body>
    </html>
    """

    send_email(email, subject, body, is_html=True)

    return {"message": "Verification email resent successfully", "status": "success"}
