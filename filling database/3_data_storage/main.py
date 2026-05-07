import mysql.connector
import os
from dotenv import load_dotenv
import json
from pathlib import Path


# DB connection init
parent_path = Path(__file__).parent.parent

load_dotenv()
mysql_password = os.getenv("MYSQL_PASSWORD")


conn = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = mysql_password,
    database = "jobagg"
)

cursor = conn.cursor()

# Load Data
def load_data_from_json(name:str):
    with open(parent_path/name, 'r', encoding='utf-8') as f:
        return json.load(f)


clean_data = load_data_from_json("clean_output.json")



# Json offers unqiue key creation

json_offers = set()

for offer in clean_data.get("content", []):

    unique_key = (offer.get("title"),offer.get("company"),str(offer.get("published_at")))
    json_offers.add(unique_key)


# Get unqiue of offers in db

cursor.execute("SELECT offer_id, title, company, published_at FROM job_offers")
db_offers = cursor.fetchall()


# Detele removed offers

for offer in db_offers:

    offer_id = offer[0]
    unique_key = (offer[1],offer[2],str(offer[3]) )

    if unique_key not in json_offers:
        cursor.execute("DELETE FROM job_offers WHERE offer_id = %s", (offer_id,))

# Insert new offers

for offer in clean_data.get("content", []):

    cursor.execute("SELECT offer_id FROM job_offers WHERE title = %s AND company = %s AND published_at = %s",(offer.get("title"),offer.get("company"),offer.get("published_at")))

    existing = cursor.fetchone()

    if existing:
        continue

    cursor.execute("""
        INSERT IGNORE INTO job_offers 
        (title, company, location, job_type, work_type, published_at, about, requirements, salary)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
        offer.get("title"),
        offer.get("company"),
        offer.get("location"),
        offer.get("job_type"),
        offer.get("work_type"),
        offer.get("published_at"),
        offer.get("about"),
        offer.get("requirements"),
        offer.get("salary")
        ))

    offer_id = cursor.lastrowid

    for skill in offer.get("skills", []):

        cursor.execute("INSERT IGNORE INTO skills (name) VALUES (%s)",(skill,))
        
        cursor.execute("SELECT skill_id FROM skills WHERE name = %s",(skill,))
        
        skill_id = cursor.fetchone()[0]

        cursor.execute("INSERT IGNORE INTO job_offer_skills (offer_id, skill_id) VALUES (%s, %s)",(offer_id, skill_id))

conn.commit()