# Job Aggregator

> Built at **Epitech Rennes** · B-YEP-200 · Year-end project · April to May 2026

## Overview

A real product, not just a school demo: a platform that **collects job and internship offers** from external sources, standardizes the data and helps users make better decisions with a recommendation engine. It brings together product thinking, full-stack engineering, deployment, automation, security and data.

## Features

- Python pipeline collecting and normalizing offers (`filling_database/`)
- Node.js / Express REST API documented with Swagger: auth, offers, companies, skills, users
- Offer recommendation engine
- React frontend
- MySQL, Docker Compose, GitHub Actions CI, Husky + ESLint / Prettier hooks
- Figma mockups and product documentation

## Tech stack

`React` · `Node.js` · `Express` · `MySQL` · `Python` · `Docker` · `GitHub Actions`

## Team

- Baptiste Mesnager
- Charly Richard-Fromont
- gabriel
- Noa Loussouarn

---

## Technical documentation

## Job-Aggregator-Epitech

### Project Overview

The **Job Aggregator** is a full-stack platform designed to centralize job and internship offers from multiple sources.

---

### Installation and Local Run

```
Clone the project:
git clone https://github.com/charly-2025/Job-Aggregator-Epitech.git
cd Job-Aggregator-Epitech.git
```

#### :bangbang: Prerequisites

#### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env files

You must check the two README in `app/backend/README` and `filling_database/README` to setup the two mandatory .env files.

### :toolbox: Getting Started

#### :running: Run Locally

Clone the project:

```bash
    git clone https://github.com/charly-2025/Job-Aggregator-Epitech.git
    cd Job-Aggregator-Epitech.git
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

---

More of my work on my [portfolio](https://charly-2025.github.io/myPortfolio/).
