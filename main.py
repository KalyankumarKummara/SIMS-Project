from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS middleware

from routes.users import user_router
from routes.login import login_router
from routes.forgot_password import forgot_password_router
from routes.reset_password import Reset_password_router
from routes.student_dashboard import student_dashboard_router
from routes.application import application_router
from routes.internship import internship_router
from routes.admin_internship_crud import admin_internship_router
from routes.company_dashboard import company_dashboard_router
from routes.admin import admin_router
from routes.email_verification import verification_router
from routes.students import student_router
from routes.companies import company_router
from routes.Get_Profiles import profile_router
from routes.notifications import notification_router
from routes.admin_crud import admin_crud_router
from routes.user_details import user_details_router
from routes.savedInternships import savedInternships_router
app = FastAPI()


origins = [ "https://studentinternshipmanagementsystem.netlify.app",
    "https://68398d072be405df8a6a20e8--studentinternshipmanagementsystem.netlify.app/", ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Internship Portal!"}

app.include_router(user_router)
app.include_router(login_router)
app.include_router(admin_router)
app.include_router(admin_crud_router)
app.include_router(forgot_password_router)
app.include_router(Reset_password_router)
app.include_router(student_dashboard_router)
app.include_router(company_dashboard_router)
app.include_router(application_router)
app.include_router(internship_router)
app.include_router(savedInternships_router)
app.include_router(admin_internship_router)
app.include_router(verification_router)
app.include_router(student_router)
app.include_router(company_router)
app.include_router(profile_router)
app.include_router(user_details_router)
app.include_router(notification_router)
