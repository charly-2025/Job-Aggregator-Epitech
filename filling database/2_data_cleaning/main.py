import json
from pathlib import Path
from datetime import datetime, timezone

parent_path = Path(__file__).parent.parent

def save_in_json(name:str,data:dict) :
    with open(f"{name}", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, sort_keys=True, ensure_ascii=False)
    return True


def load_data_from_json(name:str):
    with open(parent_path/name, 'r', encoding='utf-8') as f:
        return json.load(f)


list_offers = load_data_from_json("wld_output.json").get("content",[])


def cleaning_offers(offers:list) -> list:
    clean_list_offers = []
    for offer in offers :

        title = offer.get("title")
        company = offer.get("smallCompany", {}).get("companyName")
        location = offer.get("formattedPlaces", [None])[0]

        job_type = None
        if offer.get("contractTypes"):
            job_type = offer["contractTypes"][0]

        work_type = offer.get("details", {}).get("remotePolicy", {}).get("frequency")

        timestamp = offer.get("publishDate")
        published_at = None
        if timestamp:
            published_at = str(datetime.fromtimestamp(timestamp / 1000000))

        about = offer.get("descriptionPreview")

        requirements = f"Experience: {offer.get('details', {}).get('requiredExperience', 'N/A')} years"

        salary_data = offer.get("details", {}).get("salary", {})
        salary = None
        if salary_data.get("min") and salary_data.get("max"):
            salary = (salary_data["min"] + salary_data["max"]) / 2 * 1000

        skills = []
        for skill in offer.get("skillsList", []):
            skills.append(skill.get("name"))

        clean_list_offers.append({
            "title": title,
            "company": company,
            "location": location,
            "job_type": job_type,
            "work_type": work_type,
            "published_at": published_at,
            "about": about,
            "requirements": requirements,
            "salary": salary,
            "skills": skills
        })

    return clean_list_offers


        
save_in_json("clean_output.json",{"content":cleaning_offers(list_offers)})