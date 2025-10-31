from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import requests
import json
import time

BASE_URL = "https://getinvolved.tamu.edu"
LIST_URL = f"{BASE_URL}/organizations"

headers = {
    "User-Agent": "Mozilla/5.0"
}

# === Setup Chrome Browser ===
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")  # Open Chrome in full screen
# DO NOT add headless if you want to see the browser

# If ChromeDriver is installed via Homebrew or on your PATH, this is enough:
driver = webdriver.Chrome(options=options)

# def get_org_links():
#     links = []
#     page = 1
#     while True:
#         url = f"{LIST_URL}?page={page}"
#         print(f"Loading {url}")
#         driver.get(url)

#         try:
#             # Wait until at least one org "View Details" link appears
#             WebDriverWait(driver, 10).until(
#                 EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href^='https://getinvolved.tamu.edu/org/']"))
#             )
#         except:
#             print(f"No orgs found on page {page}. Ending pagination.")
#             break

#         soup = BeautifulSoup(driver.page_source, "html.parser")
#         orgs = soup.select("a[href^='https://getinvolved.tamu.edu/org/']")
#         if not orgs:
#             break

#         for org in orgs:
#             link = org.get("href")
#             if link and link.startswith("https://getinvolved.tamu.edu/org/"):
#                 if link not in links:
#                     links.append(link)

#         page += 1

#     return links

# def get_org_links():
#     org_entries = []
#     page = 1
#     while True:
#         url = f"{LIST_URL}?page={page}"
#         print(f"Loading {url}")
#         driver.get(url)

#         try:
#             WebDriverWait(driver, 10).until(
#                 EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href^='https://getinvolved.tamu.edu/org/']"))
#             )
#         except:
#             print(f"No orgs found on page {page}. Ending pagination.")
#             break

#         soup = BeautifulSoup(driver.page_source, "html.parser")
#         cards = soup.select("div.relative.border.rounded-sm.shadow-sm.text-center")

#         if not cards:
#             break

#         for card in cards:
#             link_tag = card.select_one("a[href^='https://getinvolved.tamu.edu/org/']")
#             img_tag = card.select_one("img")

#             if link_tag:
#                 org_url = link_tag.get("href")
#                 image_url = img_tag.get("src") if img_tag else None

#                 org_entries.append({
#                     "url": org_url,
#                     "image": image_url
#                 })

#         page += 1

#     return org_entries


def get_org_links():
    org_entries = []
    page = 1
    while True:
        url = f"{LIST_URL}?page={page}"
        print(f"Loading {url}")
        driver.get(url)

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href^='https://getinvolved.tamu.edu/org/']"))
            )
        except:
            print(f"No orgs found on page {page}. Ending pagination.")
            break

        soup = BeautifulSoup(driver.page_source, "html.parser")
        cards = soup.select("div.relative.border.rounded-sm.shadow-sm.text-center")

        if not cards:
            break

        for card in cards:
            link_tag = card.select_one("a[href^='https://getinvolved.tamu.edu/org/']")
            img_tag = card.select_one("img")
            name_tag = card.select_one("h3.font-semibold")

            if link_tag:
                org_url = link_tag.get("href")
                image_url = img_tag.get("src") if img_tag else None
                name = name_tag.text.strip() if name_tag else ""

                org_entries.append({
                    "url": org_url,
                    "image": image_url,
                    "name": name
                })

        page += 1

    return org_entries

def scrape_org_page(url):
    print(f"  Scraping: {url}")
    try:
        res = requests.get(url, headers=headers)
        soup = BeautifulSoup(res.text, "html.parser")

        name = soup.select_one("h1.font-semibold")
        description = soup.select_one("section.mx-auto p")

        contact = {}

        # Extract email, phone, address, and website
        for a in soup.select("footer a"):
            href = a.get("href", "")
            if "mailto:" in href:
                contact["email"] = href.replace("mailto:", "").strip()
            elif "tel:" in href:
                contact["phone"] = href.replace("tel:", "").strip()
            elif "http" in href:
                contact["website"] = href.strip()

        address_dd = soup.select_one("footer dd")
        if address_dd and "email" not in contact:
            contact["address"] = address_dd.text.strip()

        return {
            "name": name.text.strip() if name else "",
            "description": description.text.strip() if description else "",
            "contact": contact,
            "categories": [],  # can be filled from tags or skipped
            "socials": {},     # if you find social icons later
            "url": url
        }

    except Exception as e:
        print(f"    Error scraping {url}: {e}")
        return None

def main():
    all_orgs = []
    org_entries = get_org_links()  # returns list of dicts with 'url' and 'image'
    print(f"\nFound {len(org_entries)} organizations.\n")

    for i, entry in enumerate(org_entries):
        print(f"[{i+1}/{len(org_entries)}] Scraping: {entry['url']}")
        org_data = scrape_org_page(entry['url'])
        if org_data:
            # Attach the thumbnail image from the listing page
            org_data["thumbnail"] = entry.get("image")
            org_data["name"] = entry.get("name") or org_data.get("name", "")
            all_orgs.append(org_data)
        time.sleep(0.5)  # Be kind to the server

    with open("tamu_organizations.json", "w") as f:
        json.dump(all_orgs, f, indent=2)

    print("\n✅ Data saved to tamu_organizations.json")
    driver.quit()

if __name__ == "__main__":
    main()
