# Product Choices
**Document type:** Product Discovery & Feature Rationale  
**Status:** MVP Definition  
**Audience:** Dev team, stakeholders

---

## 1. Target Users

### Primary Persona : Active Tech Job Seeker
**Who:** Developers, students, and junior engineers actively searching for jobs online, motivated to apply at scale and maximize their chances by targeting many relevant opportunities simultaneously.

**Profile:**
- Junior to mid-level developer (0–4 years of experience)
- Comfortable with digital tools and dashboards
- Applies to 5-20+ positions per week
- Frustrated by context-switching between LinkedIn, Indeed, WeLoveDevs, etc.

**Secondary segments:**
- Students seeking internships or work-study positions (alternance)
- Junior developers comparing offers and negotiating salary
- Career changers entering the tech field

---

## 2. Prioritized Pain Points

| Priority | Pain Point                                                                           | User Impact                                  |
| -------- | ------------------------------------------------------------------------------------ | -------------------------------------------- |
| Critical | **Offer dispersion** : relevant jobs spread across 5+ platforms                      | Wastes 1-2h/day navigating tabs              |
| Critical | **Mass application friction** : no unified workflow to apply fast                    | Reduces application volume and quality       |
| High     | **Poor recommendation relevance** : generic suggestions not matched to actual skills | Candidates waste time on irrelevant listings |
| High     | **Missing salary transparency** : inconsistent or absent salary data                 | Difficulty prioritizing and negotiating      |
| Medium   | **No market visibility** : hard to know which skills are in demand                   | Candidates can't strategically upskill       |
| Medium   | **Duplicate offers** : same job posted on multiple platforms                         | Wasted clicks and confusion                  |
| Lower    | **No saved state** : re-doing searches every session                                 | Poor continuity across sessions              |

---

## 3. Selected Features & Rationale

### 3.1 AI-Powered Match Recommendations
**What:** Each offer receives a match score (0-100%) based on the candidate's declared skills vs. required skills in the job posting.

**Why:**
- Reduces time-to-first-relevant-offer, the #1 bottleneck for mass applicants
- Differentiates from all current competitors (LinkedIn's recommendations are opaque and social-graph biased)
- Directly addresses Persona 1 & 2's core frustration

**How it works:**
- User declares skills in their profile (e.g. React, TypeScript, Node.js)
- Each offer is parsed for required and nice-to-have skills
- Match score = weighted overlap between user skills and offer requirements
- Offers ranked by match score on dashboard and search

**Expected value:** Users see their top 3 best-fit offers immediately on login — zero search required to get started.

---

### 3.2 Advanced Multi-Criteria Filters
**What:** Filter panel with real-time filtering across: location, salary range, remote frequency (remote / hybrid / on-site), contract type (CDI, CDD, internship, work-study, freelance), company, skills required, publication date.

**Why:**
- Mass applicants need to narrow scope fast : filtering is the primary navigation mode
- Current platforms force sequential, single-criterion searches
- Combining location + salary + remote + skills is not natively available anywhere

**How it works:**
- Filters applied client-side for instant feedback (no reload)
- Filter state persisted in URL for shareability and session continuity
- "Clear all" resets to full list

**Expected value:** A user targeting "remote React roles, €40-65k, internship or CDI" can set this once and browse a pre-narrowed list.

---

### 3.3 Trending Skills Dashboard
**What:** A visual panel showing which skills appear most frequently across all current job listings (React 100%, TypeScript 85%, Node.js 70%, AWS 55%, Python 40%…).

**Why:**
- Candidates want to know what to learn next to maximize employability
- Recruiters embed skills inconsistently; aggregating across hundreds of offers produces a reliable signal
- No competitor surfaces this data in a candidate-facing, actionable way

**How it works:**
- Skills are extracted and normalized from all ingested offers
- Frequency ranked and displayed as a bar chart or ranked list
- Updated daily or on each data refresh

**Expected value:** A junior dev sees "TypeScript at 85%" and decides to add it to their profile, directly increasing their match scores.

---

### 3.4 Saved Jobs (Favorites)
**What:** Users can bookmark any offer with one click (heart icon). Saved jobs are accessible via a dedicated "Saved Jobs" tab.

**Why:**
- Mass applicants use multi-session workflows: browse , save, apply in batches
- Removes the need to re-search for previously seen offers
- Low build cost, high retention value

**How it works:**
- Save state stored per user
- Saved list shows current offer status (still open / expired)
- Can be filtered and sorted like the main search

**Expected value:** Users build an "apply queue" during the week and process it in one focused session.

---

### 3.5 Centralized Dashboard
**What:** A home screen showing: match-ranked AI recommendations, key stats (saved jobs, applications sent, avg match score, new jobs today), profile completeness indicator, tip of the day.

**Why:**
- Users waste time navigating between pages to get an overview of their search
- A dashboard converts the app from a search tool into a job-search command center
- Creates a daily habit loop: open app, see what's new, act

**How it works:**
- Recommendations pulled from match engine, filtered to top 5
- Stats updated in real-time
- Profile completeness drives a lightweight onboarding nudge

**Expected value:** Users open the app daily instead of once a week, increasing application volume and platform stickiness.

---

## 4. Features Explicitly Deprioritized (MVP)

| Feature | Reason deferred |
|---------|----------------|
| In-app application tracking (ATS) | High complexity; use existing tools (Notion, spreadsheet) |
| Company reviews / culture data | Requires separate data source; out of scope for MVP |
| Email alerts / notifications | Useful but not core to mass-apply flow |
| Multi-language offers | Nice to have; focus on French tech market first |
| Browser extension | Post-MVP growth lever |

---

## 5. Expected User Value (by feature)

| Feature          | Primary Value Delivered                            |
| ---------------- | -------------------------------------------------- |
| AI Match Score   | Save 1-2h/day; see only what matters               |
| Advanced Filters | Narrow 500 offers to 20 relevant ones in <30s      |
| Trending Skills  | Actionable career signal without external research |
| Saved Jobs       | Structured apply queue; no re-searching            |
| Dashboard        | Daily habit; instant situational awareness         |

---

## 6. Success Metrics (KPIs)

| KPI | Target |
|-----|--------|
| Time to first relevant offer | < 60 seconds from login |
| Average match score of clicked offers | > 75% |
| Save rate (offers saved / offers viewed) | > 15% |
| Daily active return rate | > 3 sessions/week per active user |
| User satisfaction (NPS or CSAT) | > 7/10 |

---

## 7. Key Assumptions to Validate

1. Users will invest time to fill in their skills profile if it immediately improves recommendations.
2. A match score is more actionable than a generic "recommended for you" label.
3. The mass-apply workflow (browse, save, apply in bulk) is how most active job seekers actually operate.
4. Showing trending skills increases profile completion rates.
