from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from fastapi.responses import JSONResponse

# Define OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Your secret key for decoding the JWT (make sure this is consistent)
SECRET_KEY = "b22c432bc44361f3c478b067cef4f853ebb644ba976be653ae6c118f85890bbf"
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")

        if user_id is None or role is None:
            return {"message": "User not authenticated or role missing", "status": "failed"}

        return {"user_id": user_id, "role": role, "status": "success"}
    
    except jwt.PyJWTError:
        return {"message": "Invalid token or expired token", "status": "failed"}

def get_User(token: str = Depends(oauth2_scheme)):
    try:
        print("Token received:", token)  # Debug log
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded payload:", payload)  # Debug log
        email = payload.get("sub")
        role = payload.get("role")

        if not email or not role:
            return JSONResponse(status_code=401, content={"status": "failed", "message": "Unauthorized access"})

        return {"email": email, "role": role}
    except jwt.ExpiredSignatureError:
        return JSONResponse(status_code=401, content={"status": "failed", "message": "Token expired"})
    except jwt.PyJWTError:
        return JSONResponse(status_code=401, content={"status": "failed", "message": "Invalid token"})

def get_Admin_User(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")

        if not email or not role:
            raise HTTPException(status_code=401, detail="Unauthorized access")

        if role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")

        return {"email": email, "role": role}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")