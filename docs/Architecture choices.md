# JobG3tter - Architecture Decisions Document

## Overview

This document explains:
- the selected tech stack,
- how the system is structured,
- service boundaries,
- and key alternatives that were considered but rejected.

The goal is to make architectural decisions explicit and maintainable over time.

---

# 1. Selected Stack

## Frontend

### Technology
- ReactJS
- Material UI (MUI)


### Why This Stack

| Choice | Reason |
|---|---|
| React | Fast UI development, component reuse, strong ecosystem |
| MUI | Prebuilt accessible components + consistent design system |


---

## Backend 

### Technology
- REST API
- JWT-style authentication 
- Cookie-based session handling 

### Why REST API

- Simple integration with frontend

---


## Data Fetching

### Approach
- fetch
- Custom wrapper: `apiFetch()`

### Why

| Choice | Reason |
|---|---|
| fetch | Native, lightweight |
| apiFetch wrapper | Centralizes auth + refresh logic |

---

# 2. Service Boundaries

## Frontend Responsibilities

The frontend handles:

- UI rendering (jobs, dashboard, modals)
- State management (jobs, filters, saved jobs)
- API orchestration
- Session handling (via refresh token calls)
- Navigation logic (dashboard/search/saved/settings)

---

## Backend Responsibilities

The backend is responsible for:

- Authentication (login, refresh, logout)
- Job aggregation (`/allOffers`)
- User-specific data:
  - saved jobs
  - viewed jobs
- Offer interactions (like/save toggle)
- Data filtering (server-side where applicable)

---

# 3. Key System Flows

## Job Fetch Flow

User opens dashboard
    ↓
Frontend calls /allOffers?page=X
    ↓
Backend returns paginated jobs
    ↓
Frontend renders JobCards