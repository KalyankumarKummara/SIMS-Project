def InternshipEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "company": item["company"],
        "description": item["description"],
        "requirements": item["requirements"],
        "location": item["location"],
        "duration": item["duration"],
    }

