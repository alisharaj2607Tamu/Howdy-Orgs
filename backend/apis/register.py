from fastapi import APIRouter, FastAPI
from pydantic import BaseModel
import pandas as pd
import os

router = APIRouter()

CSV_PATH = "./data/Users_Master.csv"

class User(BaseModel):
    Email: str
    PWD: str
    Name: str
    Interest1: str
    Interest2: str
    Interest3: str
    Clubs: list[str]

@router.post("/api/register")
async def register_user(user: User):
    data = user.dict()
    data["Clubs"] = ", ".join(data["Clubs"])
    df = pd.DataFrame([data])

    if os.path.exists(CSV_PATH):
        existing_df = pd.read_csv(CSV_PATH)
        email_match = existing_df["Email"].str.strip().str.lower() == data["Email"].strip().lower()

        if email_match.any():
            idx = existing_df[email_match].index[0]
            for key in data:
                existing_df.at[idx, key] = data[key]
        else:
            existing_df = pd.concat([existing_df, df], ignore_index=True)

        existing_df.to_csv(CSV_PATH, index=False)
    else:
        df.to_csv(CSV_PATH, index=False)

    return {"message": "User registered or updated successfully"}

app = FastAPI()
app.include_router(router)
