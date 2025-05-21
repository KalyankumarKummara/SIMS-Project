import pymongo
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

myclient = pymongo.MongoClient("mongodb+srv://kalyankumarkummaradptr:gK1oY3gXjb1jYBel@cluster0.zyo6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB = myclient["InternshipManagement"]
admin_collection = DB["Users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
admin_password = os.getenv("ADMIN_PASSWORD", "default_strong_password")

hashed_password = hash_password(admin_password)

admin_data = {
    "email": admin_email.lower(),
    "password": hashed_password,
    "role": "admin"
}

existing_admin = admin_collection.find_one({"email": admin_email})
if not existing_admin:
    admin_collection.insert_one(admin_data)
    print("✅ Admin account created successfully.")
else:
    print("⚠️ Admin account already exists.")
