import mysql.connector
import os
from dotenv import load_dotenv
import json
from pathlib import Path

# DB connection init
parent_path = Path(__file__).parent.parent

load_dotenv()
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_user = os.getenv("MYSQL_USER")
mysql_database = os.getenv("MYSQL_DATABASE")
mysql_host = os.getenv("MYSQL_HOST")
mysql_port = os.getenv("MYSQL_PORT")

conn = mysql.connector.connect(
    host = mysql_host,
    port = mysql_port,
    user = mysql_user,
    password = mysql_password,
    database = mysql_database
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

cursor.execute("SELECT offer_id, title, company_id, published_at FROM job_offers")
db_offers = cursor.fetchall()


# Detele removed offers

for offer in db_offers:

    offer_id = offer[0]
    unique_key = (offer[1],offer[2],str(offer[3]) )

    if unique_key not in json_offers:
        cursor.execute("DELETE FROM job_offers WHERE offer_id = %s", (offer_id,))

# Insert new offers

for offer in clean_data.get("content", []):

    cursor.execute("SELECT offer_id FROM job_offers jo JOIN companies c ON jo.company_id = c.company_id WHERE jo.title = %s AND c.name = %s AND jo.published_at = %s",(offer.get("title"),offer.get("company"),offer.get("published_at")))

    existing = cursor.fetchone()

    if existing:
        continue

    
    cursor.execute("INSERT IGNORE INTO companies (name) VALUES (%s)",(offer.get("company"),))

    cursor.execute("SELECT company_id FROM companies WHERE name = %s",(offer.get("company"),))
    
    company_id = cursor.fetchone()[0]

    cursor.execute("""
        INSERT IGNORE INTO job_offers 
        (title, company_id, location, job_type, work_type, published_at, about, requirements, salary)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
        offer.get("title"),
        company_id,
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