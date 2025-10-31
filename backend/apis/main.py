from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .utils import SBERTRecommender
from .utils import BM25Helper
from .register import router as register_router
from .update_user import router as update_profile_router  # ✅ import here
import pandas as pd
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(register_router)
app.include_router(update_profile_router)

# BM25 setup
bmobj = BM25Helper()
bmobj.load_data()
bmobj.store_corpus()

with open("./data_preprocessing/tamu_organizations_img.json", "r") as f:
    fallback_data = json.load(f)

class Item(BaseModel):
    user: str
    query: str

@app.post("/backend/bm25")
async def create_item(item: Item):
    item_dict = item.dict()
    if item.user is not None:
        query = item.query
        top_n = bmobj.get_ranks(query)
        item_dict.update({"ranked_docs": top_n})
    return item_dict

@app.get("/org/{org_id}")
def get_org(org_id: int):
    for org in bmobj.data:
        if "logo" in org and org["logo"].startswith(f"{org_id}_"):
            return JSONResponse(content=org)
    raise HTTPException(status_code=404, detail="Organization not found")

@app.get("/sbert-org/{primary_key}")
def get_sbert_org(primary_key: str):
    for org in fallback_data:
        logo = org.get("logo", "")
        logo_prefix = logo.split('_')[0]
        if logo_prefix == primary_key:
            print("MATCH FOUND:", org)
            return org
    raise HTTPException(status_code=404, detail="Organization not found")


# SBERT setup
sbert_obj = SBERTRecommender()
sbert_obj.load_data()

class EmailRequest(BaseModel):
    email: str

@app.post("/backend/sbert")
async def get_sbert_ranked_user_by_email(request: EmailRequest):
    try:
        result = sbert_obj.get_ranked_orgs_by_email(request.email)
        return result.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/backend/orgs-list")
def get_organizations():
    csv_path = "./data/Organisations_Master.csv"
    df = pd.read_csv(csv_path)
    data = df.fillna('').to_dict(orient="records")
    return data

@app.get("/backend/users-list")
def get_users():
    csv_path = "./data/Users_Master.csv"
    try:
        df = pd.read_csv(csv_path, quotechar='"')
        data = df.fillna('').to_dict(orient="records")
        return data
    except Exception as e:
        print("Error loading Users_Master.csv:", e)
        raise HTTPException(status_code=500, detail=str(e))
