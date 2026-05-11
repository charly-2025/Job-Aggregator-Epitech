import json
import time
from pathlib import Path

from main import wld_fetch_all_pages,save_in_json,make_get_request,WLD_HEADERS,WLD_URL,WLD_PARAMS

parent_path = Path(__file__).parent.parent


with open(parent_path/'wld_output.json', 'r', encoding='utf-8') as f:
    wld_outpout = json.load(f)

first_request = make_get_request(WLD_URL,WLD_HEADERS)
total_count = first_request.get("totalCount")

if total_count and total_count != len(wld_outpout.get("content",[])) :
    time.sleep(1)
    save_in_json("wld_output.json",{"content":wld_fetch_all_pages(WLD_URL,WLD_HEADERS,WLD_PARAMS)})

else :
    print("no update found")