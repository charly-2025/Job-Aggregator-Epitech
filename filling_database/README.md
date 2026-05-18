# Database Filling

Automatic pipeline to collect, clean, and store job offers from multiple sources into a MySQL database.

---

## Requirements

- Python 3.8+
- MySQL 8.0+
- Required Python packages (see `requirements.txt`)

---

### Create the Database Schema
```bash
cd .../app/database
mysql -u root -p < jobagg.sql
```
---
## Configuration

Create a `.env` file in **this folder** with the following variables:

```env
MYSQL_PASSWORD=your_password
```

This file is used to connect the pipeline to your MySQL database.

---

## Project Structure

```
job-aggregator/
|--/filling_database/
    |-- 1_data_scrapping/       # Fetch job offers from external sources
    |-- 2_data_cleaning/        # Clean and normalize raw data
    |-- 3_data_storage/         # Insert processed data into the database
    |-- 4_data_correction/      # Fix and optimize stored data
    |-- run_pipeline.py       # Full pipeline runner
    |-- .env                  # Environment configuration (not committed)
```

---

## Running the Pipeline

### Full pipeline

Run all steps automatically in the correct order:

```bash
python3 run_pipeline.py
```

The pipeline executes the following steps:

| Step | Module            | Description                            |
| ---- | ----------------- | -------------------------------------- |
| 1    | `data_scrapping`  | Fetch job offers from external sources |
| 2    | `data_cleaning`   | Clean and normalize data               |
| 3    | `data_storage`    | Insert data into the database          |
| 4    | `data_correction` | Fix and optimize stored data           |

### Run modules individually

Each step can also be run manually in order:

```bash
python3 data_scrapping/main.py
python3 data_cleaning/main.py
python3 data_storage/main.py
python3 data_correction/main.py
```

---

## Database Behavior

**Insertion**

- New job offers are automatically inserted.
- Existing offers are ignored or updated depending on configuration.

**Duplicate prevention**  
Duplicates are detected using a `UNIQUE` constraint on the combination of:

- `title`
- `company`
- `published_at`

---

## Notes

- Make sure your MySQL server is running before launching the pipeline and you create the database.
- `wld_output.json` and `clean_output.json` acts as a data interface between programs:
