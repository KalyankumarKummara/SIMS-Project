import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()  

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_email(receiver_email: str, subject: str, body: str, is_html: bool = False):
    try:
        msg = EmailMessage()
        msg["From"] = SENDER_EMAIL
        msg["To"] = receiver_email
        msg["Subject"] = subject

        if is_html:
            msg.add_alternative(body, subtype="html")
        else:
            msg.set_content(body)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        print("Email sent successfully")
        return {"message": "Email sent successfully"}
    except Exception as e:
        print(f"Error sending email: {e}")
        return {"message": "Failed to send email"}
def send_status_update_email(receiver_email: str, status: str):
    subject = "Internship Application Status Update"
    body = f"""
    <html>
    <body>
        <h2 style="color: red;">Application Status Update</h2>
        <p>Dear Applicant,</p>
        <p>Your application status has been updated to: <strong>{status}</strong>.</p>
        <p>Thank you for applying!</p>
    </body>
    </html>
    """
    return send_email(receiver_email, subject, body, is_html=True)

