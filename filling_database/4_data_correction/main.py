import re
import mysql.connector
import os
from dotenv import load_dotenv
import json
from pathlib import Path

parent_path = Path(__file__).parent.parent

load_dotenv()
mysql_password = os.getenv("MYSQL_PASSWORD")


conn = mysql.connector.connect(
    host = "mysql",
    user = "root",
    password = mysql_password,
    database = "jobagg"
)

def remove_html_tags(text):
    if not text:
        return ""
    clean = re.compile(r'<.*?>')
    return re.sub(clean, '', text)


def clean_duplicate_offer(conn):
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE jo1
            FROM job_offers jo1
            JOIN job_offers jo2
              ON jo1.title = jo2.title
              AND jo1.company_id = jo2.company_id
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
        print("Error :", e)

    finally:
        cursor.close()

def clean_text(text):
    # main function that will call all the other functions responsible for cleaning up the text
    if not text:
        return ""
     
    text = remove_html_tags(text)
    return text

def clean_offer_description(conn):
    # function that will clean each line

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT offer_id,title,location,about,requirements FROM job_offers;")
        rows = cursor.fetchall()

        if not rows : 
            print("Table is empty")
        else : 
            for row in rows :
                offer_id = row[0]
                title = clean_text(row[1])
                location = clean_text(row[2])
                about = clean_text(row[3])
                requirements = clean_text(row[4])

                cursor.execute("UPDATE job_offers SET title=%s,location=%s,about=%s,requirements=%s WHERE offer_id=%s",(title,location,about,requirements,offer_id,))

            conn.commit()
            print("cleaned offers")

    except Exception as e:
        conn.rollback()
        print("Error :", e)

    finally:
        cursor.close()



clean_duplicate_offer(conn)
clean_offer_description(conn)
