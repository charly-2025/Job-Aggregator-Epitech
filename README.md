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

### Prerequisites

### Running the Project
---
## Folders Structure

```
.
|-- Chatbot /
| |-- < The file for tun chabot on terminal and discord
|-- Landing_page /
  |-- < source code of the landing page website >


B-YEP-200-REN-2-1-jobaggregator-1/
|
|-- frontend/        # React / Next.js app
|--backend/         # API (Node, Python, etc)
|-- database/        # schema,
|-- data/            # scrapping scripts
|-- ai/              # AI feature
|-- docs/            # ADR + product docs
│
|-- .github/
│   └── workflows/
│       └── ci.yml   # CI pipeline
│
|-- docker-compose.yml
|-- README.md
|-- .env

```

--- 
## Commit Convention
```
Format of the commit message: KARMA GIT

  <type>(<scope>): <subject>
  <BLANK LINE>
  <body>

USEFUL <type> : 
  [FEAT] #For adding a new "feature" for the user.
  [FIX] #For fixing a "feature" relevant to the user.
  [RM] #For removing a "feature" relevant to the user.
  [REFACTOR] #For refactoring production code, e.g. renaming a variable.
  [DOCS] #For changes to the documentation/.md etc.
  [BUILD] #For updating build configuration, development tools or other changes irrelevant to the user.
  [TEST] #For adding missing tests, refactoring tests; no production code change.

USEFUL <scope>:
  - Init
  - Documentation (.md)
  - Deployment
  - Code development
  - Figma
