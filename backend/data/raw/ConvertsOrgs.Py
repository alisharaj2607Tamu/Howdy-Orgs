import json
import csv

# Load JSON
with open("./tamu_organizations.json", "r") as f:
    orgs = json.load(f)

# Write CSV
with open("./tamu_organizations.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["title", "description", "email", "url", "thumbnail"])
    
    for org in orgs:
        title = org.get("name", "")
        desc = org.get("description", "")
        email = org.get("contact", {}).get("email", "")
        url = org.get("url", "")
        thumb = org.get("thumbnail", "")
        writer.writerow([title, desc, email, url, thumb])