import json
import requests
import time
from dotenv import load_dotenv
from pathlib import Path
import os

parent_path = Path(__file__).parent.parent

load_dotenv()
WLD_API_KEY = os.getenv("WLD_API_KEY")


WLD_URL= "https://epi-api.welovedevs.com/v1"
WLD_HEADERS = {
    'X-API-Key': WLD_API_KEY,
    'Content-Type': 'application/json',
    }
WLD_PARAMS = {"page":0,"size":100}


def make_get_request(url:str,headers={},params={}):
    response = requests.get(url,headers=headers,params=params)
    status_code = response.status_code
    if status_code == 200 :
        return response.json()
    return {"Error code":status_code}


def save_in_json(name:str,data:dict) :
    with open(f"{name}", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, sort_keys=True, ensure_ascii=False)
    return True

def wld_fetch_all_pages(url,headers,params):
    all_data =[]
    while True:
        
        data = make_get_request(url,headers,params).get("values", [])
        
        if not data:
            if  all_data :
                print(f"We get page content")
            else :
                print("No content found")
            break
            
        all_data.extend(data)
        print(f"We get page  content")
        params["page"] += 1
        time.sleep(1)

    print(f"Retrieved {len(all_data)} items")
    return all_data


if __name__ == "__main__" :
    data = wld_fetch_all_pages(WLD_URL,WLD_HEADERS,WLD_PARAMS)
    save_in_json("wld_output.json",{"content":data})

