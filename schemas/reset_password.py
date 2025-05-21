def Reset_passwordEntity(item) -> dict:
    return{
        "id":str(item["_id"]),
        "password" : item["password"],
        "confirmpassword" : item["confirmpassword"],

    }

def Forgot_passwordEntity(item) -> dict:
    return {
        "id" : str(item["_id"]),
        "email" : item["email"],
    }
