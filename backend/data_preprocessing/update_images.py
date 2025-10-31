import json
import pandas as pd
import shutil
import os


def link2path():
    path = r"C:\Users\sukan\Documents\sem2\isr\project\new\Howdy-Orgs\backend\data\Organisations_Master.csv"
    csv_data = pd.read_csv(path)
    title2img = dict(zip(csv_data["title"], csv_data["primary_key"]))
    
    with open("tamu_organizations_img.json", "r") as f:
        data = json.load(f)
        for element in data:
            title = element["name"]
            element["logo"] = f"{title2img[title]}.jpg"
    
        with open("tamu_organizations_img.json", "w") as f:
            json.dump(data, f, indent=4)

    return
        

# link2path()



# Paths
json_path = r'C:\Users\sukan\Documents\sem2\isr\project\new\Howdy-Orgs\backend\data_preprocessing\tamu_organizations_img.json'
red_logo_path = r'C:\Users\sukan\Documents\sem2\isr\project\new\Howdy-Orgs\frontend\public\org_images\tamu-red-logo2.jpg'
logo_folder = r'C:\Users\sukan\Documents\sem2\isr\project\new\Howdy-Orgs\frontend\public\org_images'  # folder where logos like 2_12thLawMan.jpg are stored

# Load JSON
with open(json_path, 'r') as f:
    data = json.load(f)

# Process and overwrite logos
for entry in data:
    if 'thumbnail' in entry and 'tamu-logo-white.png' in entry['thumbnail']:
        if 'logo' in entry:
            dest_path = os.path.join(logo_folder, entry['logo'])
            # print(dest_path)
            shutil.copy(red_logo_path, dest_path)
            print(f"Replaced: {dest_path}")
