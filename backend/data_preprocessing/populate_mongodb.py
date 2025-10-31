import os
import json
import requests
from PIL import Image
from io import BytesIO
import re


from urllib.parse import quote_plus

# username = quote_plus("gaurip29899")
# password = quote_plus("Gauri@1234")

# # === MongoDB Atlas Setup ===
# MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.yinqo.mongodb.net/tamu_orgs?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"

# try:
#     client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
#     # Force a call to test the connection
#     client.server_info()
#     print("✅ Connected to MongoDB Atlas!")
# except errors.ServerSelectionTimeoutError as err:
#     print("❌ Failed to connect to MongoDB Atlas:")
#     print(err)
#     exit(1)


# username = quote_plus("gaurip29899")
# password = quote_plus("Gauri@1234")

# MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.yinqo.mongodb.net/?retryWrites=true&w=majority"

# try:
#     client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
#     client.server_info()  # Force connection on a request
#     print("Connected to MongoDB")
# except errors.ServerSelectionTimeoutError as err:
#     print("Failed to connect to MongoDB Atlas:")
#     print(err)

# # client = MongoClient(MONGO_URI)

# db = client["tamu_orgs"]
# collection = db["organizations"]

# === Create image storage folder ===

import pandas as pd
csv_data = pd.read_csv("../data/Organisations_Master.csv")
org2key = dict(zip(csv_data["title"], csv_data["primary_key"]))


os.makedirs("images", exist_ok=True)

# === Load JSON ===
with open("tamu_organizations.json", "r") as f:
    data = json.load(f)

def sanitize_filename(name):
    # Replace all non-alphanumeric characters with underscore
    return re.sub(r'[^a-zA-Z0-9]', '_', name.lower())

# === Image processing helper ===
def download_and_resize_image(url, name_slug):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            img = Image.open(BytesIO(r.content))
            img = img.convert("RGB")  # For consistent format
            img = img.resize((200, 200))  # Resize to 200x200 px

            local_path = f"images/{org2key[name_slug]}.jpg"
            img.save(local_path, format="JPEG", quality=85)
            return local_path
    except Exception as e:
        print(f"Failed to process image for {name_slug}: {e}")
    return None

# === Preprocess, Resize, Store ===
cleaned = []

for org in data:
    org.pop("categories", None)
    org.pop("socials", None)

    # name_slug = org["name"].lower().replace(" ", "_") or "unnamed"
    # name_slug = sanitize_filename(org["name"]) or "unnamed"
    name_slug = org["name"] or "unnamed"
    image_url = org.get("thumbnail", "")

    local_img = download_and_resize_image(image_url, name_slug) if image_url else None
    if local_img:
        org["local_thumbnail"] = local_img

    # Remove bad default URLs
    if org["contact"].get("website", "").endswith("/login"):
        org["contact"].pop("website")

    cleaned.append(org)

# Optional: Clear existing DB
# collection.delete_many({})

# # Insert
# collection.insert_many(cleaned)
# print(f"Inserted {len(cleaned)} organizations into MongoDB Atlas!")
