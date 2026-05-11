from importlib.resources.readers import remove_duplicates

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


def clean_duplicate_offer(conn):
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE jo1
            FROM job_offers jo1
            JOIN job_offers jo2
              ON jo1.title = jo2.title
              AND jo1.company = jo2.company
              AND jo1.published_at = jo2.published_at
              AND jo1.offer_id > jo2.offer_id
        """)

        cursor.execute("""
            DELETE FROM skills
            WHERE skill_id NOT IN (
                SELECT DISTINCT skill_id FROM job_offer_skills
            )
        """)

        conn.commit()

    except Exception as e:
        conn.rollback()
        print("Erreur :", e)

    finally:
        cursor.close()

    
clean_duplicate_offer(conn)