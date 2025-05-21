def LoginEntity(item) -> dict:
    return {
        "id" : str(item["_id"]),
        "email" : str(item["email"]),
        "password" : str(item["password"]),
    }
