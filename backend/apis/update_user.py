from fastapi import APIRouter, Query
from pydantic import BaseModel
import pandas as pd
import os

router = APIRouter()

CSV_PATH = "./data/Users_Master.csv"

class ProfileUpdate(BaseModel):
    Email: str
    Name: str
    Interest1: str
    Interest2: str
    Interest3: str
    Clubs: list[str]

@router.post("/api/update-profile")
def update_profile(profile: ProfileUpdate):
    data = profile.dict()
    data["Clubs"] = ", ".join(data["Clubs"])

    if not os.path.exists(CSV_PATH):
        return {"error": "User data file not found."}

    df = pd.read_csv(CSV_PATH)
    updated = False

    for idx, row in df.iterrows():
        if row["Email"].strip().lower() == data["Email"].strip().lower():
            for key in data:
                df.at[idx, key] = data[key]
            updated = True
            break

    if not updated:
        df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

    df.to_csv(CSV_PATH, index=False)
    return {"message": "Profile updated successfully."}


@router.get("/api/user-profile")
def get_user_profile(email: str = Query(...)):
    if not os.path.exists(CSV_PATH):
        raise HTTPException(status_code=404, detail="User data file not found.")

    df = pd.read_csv(CSV_PATH)
    user_row = df[df['Email'].str.strip().str.lower() == email.strip().lower()]

    if user_row.empty:
        raise HTTPException(status_code=404, detail="User not found.")

    user_data = user_row.iloc[0].to_dict()

    import math
    user_clubs = user_data.get("Clubs", "")
    if isinstance(user_clubs, float) and math.isnan(user_clubs):
        user_data["Clubs"] = []
    else:
        user_data["Clubs"] = [c.strip() for c in str(user_clubs).split(",") if c.strip()]

    return user_data
