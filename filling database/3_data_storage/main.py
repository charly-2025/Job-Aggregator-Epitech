import mysql.connector
import os
from dotenv import load_dotenv
import json
from pathlib import Path

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


def load_data_from_json(name:str):
    with open(parent_path/name, 'r', encoding='utf-8') as f:
        return json.load(f)


clean_data = load_data_from_json("clean_output.json")

for offer in clean_data.get("content", []):

    cursor.execute("""
        SELECT offer_id FROM job_offers
        WHERE title = %s AND company = %s AND published_at = %s""",
        (offer.get("title"),offer.get("company"),offer.get("published_at"))
        )

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

        cursor.execute("""
            INSERT IGNORE INTO skills (name) VALUES (%s)""",
            (skill,)
            )
        
        cursor.execute("""
            SELECT skill_id FROM skills WHERE name = %s""", 
            (skill,)
            )
        
        skill_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT IGNORE INTO job_offer_skills (offer_id, skill_id) VALUES (%s, %s)""",
            (offer_id, skill_id)
            )

    conn.commit()