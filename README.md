# B-YEP-200-REN-2-1-jobaggregator-1

## Project Overview

The **Job Aggregator** is a full-stack platform designed to centralize job and internship offers from multiple sources.

---

## Installation and Local Run

```
Clone the project:
git clone https://github.com/EpitechBachelorPromo2028/B-YEP-200-REN-2-1-jobaggregator-1.git
cd B-YEP-200-REN-2-1-jobaggregator-1.git
```

### :bangbang: Prerequisites

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env files

You must check the two README in `app/backend/README` and `filling_database/README` to setup the two mandatory .env files.

## :toolbox: Getting Started

### :running: Run Locally

Clone the project:

```bash
    git clone https://github.com/EpitechBachelorPromo2028/B-YEP-200-REN-2-1-jobaggregator-1.git
    cd B-YEP-200-REN-2-1-jobaggregator-1.git
```

Start Docker :

```bash
  cd app/
  docker compose up --build
```

After the docker is started, go to a other shell window, go to `../filling_database`

Create a vENV

```bash
  python3 -m venv .venv
  source .venv/bin/activate
```

Install dependencies

```bash
  pip install -r requirements.txt
```

And fill the database with all offers with this command

```bash
  python3 run_pipeline.py
```

Now you can go on your browser and go to localhost:3000
