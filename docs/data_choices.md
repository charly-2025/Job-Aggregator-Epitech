# Data Choices

## 1. Primary Data Source Choice

### Why
The project requirements explicitly required the use of the WeLoveDevs API as the primary data source.

WeLoveDevs was selected because:
- it provides structured developer-oriented job offers;
- it exposes a public API;
- it focuses on the French tech ecosystem;
- it reduces the need for unreliable scraping techniques.

### How
Job offers are retrieved through the WeLoveDevs API using authenticated HTTP requests.

Example:

```python
WLD_URL = "https://epi-api.welovedevs.com/v1"

response = requests.get(
    url,
    headers=headers,
    params=params
)
```

Authentication is performed through an API key stored inside environment variables.

### Trade-off
Using a single source limits dataset diversity compared to multi-source aggregation platforms.

However, this approach:
- respects project requirements;
- simplifies data normalization;
- avoids inconsistencies between providers.

### Rejected Alternative
Full web scraping from external platforms was rejected because:
- scraping may violate platform terms of service;
- scraping introduces unstable HTML parsing;
- WeLoveDevs was required as the main source by the project instructions.

### Evidence
- `1_data_scrapping/main.py`
- `WLD_API_KEY`
- `requests.get()` implementation

---

# 2. Rate-Limit Handling

### Why
The WeLoveDevs API enforces a rate limit of:
- 1 request per second per student.

Requests exceeding the limit could result in API blocking or failed requests.

### How
The pipeline explicitly pauses between requests using:

```python
time.sleep(1)
```

inside the pagination loop:

```python
while True:
    time.sleep(1)
```

### Trade-off
The pipeline execution becomes slower for large datasets, but ensures:
- API compliance;
- stable ingestion;
- reduced risk of temporary bans.

### Evidence
- `wld_fetch_all_pages()`
- `time.sleep(1)`

---

# 3. Pipeline Architecture Choice

### Why
The ingestion system was designed as multiple independent pipeline stages to:
- simplify debugging;
- isolate failures;
- improve maintainability;
- allow partial reruns.

### How
The pipeline is divided into:
1. data scraping;
2. data cleaning;
3. data storage;
4. data correction.

Intermediate JSON files are used between steps:

- `wld_output.json`
- `clean_output.json`

This creates a decoupled workflow between independent programs.

### Trade-off
Intermediate JSON storage introduces temporary duplicated data files and additional disk I/O.

However, it significantly improves:
- traceability;
- debugging;
- pipeline reliability.

### Rejected Alternative
Direct database ingestion immediately after API retrieval was rejected because raw API responses may contain:
- malformed fields;
- HTML content;
- duplicated offers;
- inconsistent structures.

Cleaning before insertion ensures database consistency.

### Evidence
- `run_pipeline.py`
- `wld_output.json`
- `clean_output.json`
- project folder structure

---

# 4. Data Cleaning Choice

### Why
Raw API responses contain:
- HTML tags;
- unnecessary fields;
- inconsistent formatting;
- duplicated content.

Unprocessed data would reduce database quality and negatively impact recommendations.

### How
The cleaning pipeline:
- extracts only relevant fields;
- removes HTML tags;
- formats timestamps;
- normalizes salary values;
- extracts skills;
- creates simplified offer objects.

Example:

```python
remove_html_tags(text)
```

and:

```python
salary = (
    salary_data["min"] +
    salary_data["max"]
) / 2 * 1000
```

### Trade-off
Cleaning operations slightly increase preprocessing time but dramatically improve:
- data consistency;
- search quality;
- recommendation quality.

### Evidence
- `2_data_cleaning/main.py`
- `4_data_correction/main.py`
- `remove_html_tags()`

---

# 5. Duplicate Prevention Strategy

### Why
The API may return duplicated or previously stored offers.

Without duplicate handling:
- database quality decreases;
- recommendations become biased;
- storage becomes inefficient.

### How
Offers are uniquely identified using:

| Field |
|---|
| title |
| company |
| published_at |

Duplicates are removed both:
- before insertion;
- during database correction.

Example:

```python
unique_key = (
    offer.get("title"),
    offer.get("company"),
    str(offer.get("published_at"))
)
```

### Trade-off
This strategy may occasionally merge very similar offers published simultaneously by the same company.

However, it provides a lightweight and efficient deduplication mechanism.

### Evidence
- `json_offers`
- `clean_duplicate_offer()`
- UNIQUE key strategy

---

# 6. Database Choice

### Why
MySQL was selected because:
- it is lightweight;
- widely documented;
- easy to deploy locally;
- well-suited for relational job offer data.

The project data model contains strongly related entities:
- offers;
- companies;
- skills;
- users.

### How
The pipeline inserts normalized relational data into MySQL tables using:
- foreign keys;
- many-to-many relations;
- prepared SQL queries.

### Trade-off
Relational databases require stricter schemas compared to NoSQL solutions.

However, they provide:
- stronger consistency;
- easier joins;
- better structured relationships.

### Rejected Alternative
MongoDB was considered but rejected because:
- relational joins are central to the recommendation system;
- the project data is highly structured;
- SQL relationships simplify analytics and filtering.

### Evidence
- `jobagg.sql`
- `INSERT INTO job_offers`
- `job_offer_skills`
