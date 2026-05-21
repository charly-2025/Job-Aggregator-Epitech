# AI Feature

## 1. Overview
| Field | Value |
|---|---|
| **Status** | Accepted |
| **Decision** | TF-IDF + Cosine Similarity via the `natural` library (Node.js) |
| **Feature type** | Job offer recommendation (personalized by user skills) |
| **Code path** | `app/backend/services/recommender.js` |
| **Route** | `GET /api/recommendations/by-skills` |
| **Frontend** | `app/frontend/src/home.jsx` - Dashboard component |

---

## 2. Context & Problem Statement

The platform aggregates hundreds of job offers from external sources. Without intelligent filtering, users face an overwhelming list with no personalization

The project specification requires one AI feature that must:
- Fit within **500 MB** on disk
- Produce a result in **under 5 seconds** per offer
- **Not** require fine-tuning at container startup
- **Not** rely on an external model API the team does not control

The chosen feature is a **recommendation engine** that suggests job offers matching the skills declared by the user in their profile settings (via the Settings page), results are displayed directly on the dashboard without additional navigation

---

## 3. Decision Summary

| WHY | HOW | TRADE-OFF |
|---|---|---|
| Users declare skills in Settings. Matching offers to those skills reduces noise and increases relevance. A lightweight text-similarity approach works well for structured job data where title and skills are the dominant signal. | TF-IDF vectorizes each offer (title ×3 + skills ×2 + description). A user profile vector is built from the skills stored in `user_skills`. Cosine similarity ranks all offers against that profile and returns the top-K results. | TF-IDF is less semantically rich than transformer embeddings. Two offers using different words for the same concept ("JS" vs "JavaScript") may score lower than expected. Mitigated by skill normalization in the ingestion pipeline. |

---

## 4. Selected Method: TF-IDF + Cosine Similarity

### 4.1 Why it is lightweight

The `natural` library is a pure Node.js NLP toolkit with no native binaries and no model weights to download. It installs as a standard npm package.

| Property | Value |
|---|---|
| **Library** | `natural` (npm) |
| **Disk footprint** | ~8 MB (well under the 500 MB limit) |
| **Startup time** | No model loading - first request < 200 ms |
| **Per-offer latency** | < 100 ms for 500 offers on a standard laptop |
| **External dependency** | None - fully offline, no API key required |

### 4.2 How it works

**Step 1 - Text construction** (`recommender.js` -> `buildOfferText`)

Each offer is converted to a weighted text string. Title is repeated ×3 and skills ×2 to increase their TF-IDF weight:

```
title title title  skills skills  job_type work_type location company about requirements
```

**Step 2 - Vectorization** (`recommender.js` -> `buildVectors`)

All offer texts are fed into a `TfIdf` instance from the `natural` library. The `listTerms()` method returns the TF-IDF score for each term per document, stored as a plain JS object `{ term: score }`.

**Step 3 - Ranking** (`recommendationController.js` -> `recommendationsBySkills`)

The user's skills are fetched from the `user_skills` SQL table. A profile vector is computed by inserting the skill list as a TF-IDF document alongside all offers. Offers are ranked by cosine similarity to that profile and the top-K results are returned with a `similarity_score` field (0.0–1.0).

### 4.3 Evidence

- **Core logic**: `app/backend/services/recommender.js`
- **Controller**: `app/backend/controllers/recommendationController.js` - function `recommendationsBySkills`
- **Route**: `app/backend/routes/recommendationRoutes.js` - `GET /api/recommendations/by-skills`
- **Frontend**: `app/frontend/src/home.jsx` - `Dashboard` component, `useEffect` fetching `/api/recommendations/by-skills`
- **Tested via Postman**: 200 response with array of offers each containing a `similarity_score` field

---

## 5. Expected Limitations

| Limitation | Description |
|---|---|
| **Lexical mismatch** | TF-IDF is bag-of-words: `"JS"` and `"JavaScript"` are different terms. Partially mitigated by normalization in the ingestion pipeline. |
| **Cold start** | A user with no skills set gets the most recent offers instead of recommendations. Skills must be configured in Settings. |
| **No semantic understanding** | The model does not understand that React and Vue are both frontend frameworks. A transformer-based approach would handle this better. |
| **In-memory computation** | All offers are loaded into memory per request. Acceptable for hundreds of offers; would need caching for tens of thousands. |
| **No feedback loop** | The model does not learn from user clicks or saves. Similarity is static until the user updates their skills. |

---

## 6. Rejected Alternative: `sentence-transformers` (all-MiniLM-L6-v2)

> As required by the project specification, at least one rejected alternative is documented here.

| Property | Value |
|---|---|
| **Model** | `sentence-transformers` / `all-MiniLM-L6-v2` |
| **Disk size** | ~80 MB (within the 500 MB limit) |
| **Language** | Python - would require a separate microservice |
| **Semantic quality** | Significantly better: captures synonyms and contextual meaning |
| **Reason rejected** | Requires a Python runtime alongside the Node.js backend, adding Docker complexity (an extra container). First inference is ~2-4 s depending on hardware, making it marginal against the 5 s per-offer constraint. TF-IDF was sufficient for the job-matching use case and kept the stack homogeneous in a single Node.js service. |

---

## 7. Evaluation Approach

### 7.1 Qualitative evaluation (manual)

For each test user profile with a defined skill set (e.g. `React`, `TypeScript`, `Node.js`), the top-5 recommendations are manually inspected to verify that returned offers contain at least 2 matching skills. Results observed during development confirmed relevant ranking.

### 7.2 Similarity score distribution

The `similarity_score` field (0.0 to 1.0) is returned with every recommendation. Scores above **0.70** indicate strong skill overlap.

### 7.3 Success criteria

| Metric | Target |
|---|---|
| Top-1 offer contains at least 1 user skill | >= 90% of test profiles |
| Response time (200 offers in DB) | < 500 ms |
| `similarity_score` of top result | >= 0.60 for profiles with 3+ skills |
| Cold start fallback | Returns most recent offers when skills = `[]` |

### 7.4 How to run a manual test

1. Set skills in **Settings** (e.g. `React`, `TypeScript`, `Node.js`)
2. Call the endpoint:
```
GET http://localhost:3001/api/recommendations/by-skills?top_k=5
```
3. Verify each returned offer has a `similarity_score > 0` and skills overlapping with your profile.
