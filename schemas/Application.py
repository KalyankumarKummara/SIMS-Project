def ApplicationEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "user_id": item["user_id"],
        "internship_id": item["internship_id"],
        "status": item["status"],
    }

