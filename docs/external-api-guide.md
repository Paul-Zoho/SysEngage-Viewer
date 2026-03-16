# SysEngage Ledger Viewer — External App Integration Guide

This guide is for developers building apps that create, amend, or read canonical
ledger data that is then visualised in the SysEngage Ledger Viewer.

---

## Base URL

All endpoints are relative to the deployed instance root, e.g.:

```
https://<your-replit-domain>.replit.dev
```

---

## Authentication

Every request to any `/api/*` endpoint must carry a valid API key. Requests
without a key, or with an incorrect key, are rejected immediately with
`401 Unauthorized` — the request never reaches the application logic.

### How to send the key

Include the key in one of these two request headers (both are equivalent):

```
Authorization: Bearer <your-api-key>
```

or

```
X-API-Key: <your-api-key>
```

### Where the key lives

The key is stored as a secret called `API_SECRET_KEY` in the SysEngage server's
environment. Only the server reads this value — it is never returned by any API
endpoint, never committed to source code, and never visible in logs.

### How to configure an external app

The key value itself must be manually copied from whoever manages the SysEngage
deployment and then stored securely in each external app that needs API access.
Where you store it depends on how the external app is built:

| External app type | Where to store the key |
|-------------------|------------------------|
| Another Replit app | Replit Secrets panel (`API_SECRET_KEY` or any name you choose) |
| GitHub Actions pipeline | Repository → Settings → Secrets and variables → Actions |
| Python / Node.js script | `.env` file loaded via `python-dotenv` / `dotenv` package |
| Docker container | Environment variable passed via `--env` or `docker-compose.yml` |
| Any other service | That service's own secrets / environment variable system |

The key never goes in source code or config files that are committed to version
control.

### Example requests

**curl:**
```bash
curl -X POST https://<domain>.replit.dev/api/projects/ensure \
  -H "Authorization: Bearer $API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-system"}'
```

**Python (requests library):**
```python
import os, requests

API_KEY = os.environ["API_SECRET_KEY"]
BASE_URL = "https://<domain>.replit.dev"

headers = {"Authorization": f"Bearer {API_KEY}"}

# Resolve project
resp = requests.post(f"{BASE_URL}/api/projects/ensure",
                     headers=headers,
                     json={"name": "my-system"})
project = resp.json()
project_id = project["id"]

# Fetch ledger
ledger = requests.get(f"{BASE_URL}/api/projects/{project_id}/ledger",
                      headers=headers).json()
```

**Node.js / TypeScript:**
```typescript
const API_KEY = process.env.API_SECRET_KEY!;
const BASE_URL = "https://<domain>.replit.dev";

const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// Resolve project
const proj = await fetch(`${BASE_URL}/api/projects/ensure`, {
  method: "POST",
  headers,
  body: JSON.stringify({ name: "my-system" }),
}).then(r => r.json());

// Fetch ledger
const ledger = await fetch(`${BASE_URL}/api/projects/${proj.id}/ledger`, {
  headers,
}).then(r => r.json());
```

**GitHub Actions:**
```yaml
- name: Submit ledger
  env:
    API_SECRET_KEY: ${{ secrets.SYSENGAGE_API_KEY }}
  run: |
    curl -X POST https://<domain>.replit.dev/api/projects/proj_8/ledger \
      -H "Authorization: Bearer $API_SECRET_KEY" \
      -H "Content-Type: application/json" \
      --data-binary @ledger.json
```

### Authentication failure response

Any request with a missing or incorrect key returns:

```
HTTP 401 Unauthorized
```
```json
{ "message": "Unauthorized: valid API key required" }
```

### Rotating the key

To change the key (e.g. if it is suspected to be compromised):

1. Generate a new random string (32+ characters recommended)
2. Update `API_SECRET_KEY` in the SysEngage server's Replit Secrets
3. Restart the SysEngage server so it picks up the new value
4. Update the key in every external app that calls the API
5. The old key stops working immediately after the restart

---

## External App Workflow

The typical lifecycle for an external app submitting ledger data:

```
1.  POST  /api/projects/ensure          ← resolve or create the project
2.  GET   /api/projects/{id}/ledger     ← read the current ledger (if amending)
3.  POST  /api/projects/{id}/ledger     ← submit the new / updated ledger
```

Steps 2 and 3 may be repeated many times. Step 1 is idempotent — safe to call
every time the external app starts.

---

## Project Management

### Resolve or create a project by name

```
POST /api/projects/ensure
Content-Type: application/json

{
  "name": "my-system",
  "description": "Optional description"
}
```

Finds an existing project with a matching name (case-insensitive). If none
exists a new project is created.

**Response 200** — project already existed:
```json
{
  "id": "proj_8",
  "name": "my-system",
  "description": "Optional description",
  "created_utc": "2026-03-04T07:42:46.271Z",
  "created": false
}
```

**Response 201** — new project was created:
```json
{
  "id": "proj_19",
  "name": "my-system",
  "created_utc": "2026-03-16T08:01:35.453Z",
  "created": true
}
```

The `id` field is the project identifier used in all subsequent calls.

---

### Get a project by ID

```
GET /api/projects/{id}
```

Returns project metadata without the ledger payload. Use this to confirm a
project ID is valid before making further requests.

**Response 200:**
```json
{
  "id": "proj_8",
  "name": "my-system",
  "description": "...",
  "created_utc": "2026-03-04T07:42:46.271Z"
}
```

**Response 404** — project does not exist.

---

### List all projects

```
GET /api/projects
```

Returns a summary of every project — useful for discovery and project-picker UIs.

**Response 200:**
```json
[
  {
    "id": "proj_8",
    "name": "my-system",
    "elementCount": 142,
    "hasLedger": true,
    "created_utc": "2026-03-04T07:42:46.271Z"
  }
]
```

---

### Create a project (explicit)

```
POST /api/projects
Content-Type: application/json

{
  "name": "my-system",
  "description": "optional"
}
```

Always creates a new project — does not deduplicate by name. Prefer
`POST /api/projects/ensure` when the name is your stable identifier.

**Response 201** — the created project object.

---

### Delete a project

```
DELETE /api/projects/{id}
```

Permanently deletes the project and all its data. The last remaining project
cannot be deleted.

**Response 200:** `{ "success": true }`
**Response 400** — cannot delete the last project.

---

## Ledger Retrieval

### Get a project's full ledger

```
GET /api/projects/{id}/ledger
```

Returns the complete canonical ledger JSON for the specified project. This is
the payload an external app should read when it wants to amend existing content
before re-submitting.

**Response 200** — the full `CanonicalLedger` JSON object (can be large).
**Response 404** — project not found, or project exists but has no ledger yet.

---

### Get the active project's ledger

```
GET /api/ledger
```

Convenience shorthand — returns the ledger for whichever project is currently
selected as "active" in the viewer UI. Useful for quick reads; use
`GET /api/projects/{id}/ledger` when you need a specific project.

---

## Ledger Submission

### Submit or update a ledger

```
POST /api/projects/{id}/ledger?mode=replace&stepLabel=MyStep
```

| Query param | Values | Default | Description |
|-------------|--------|---------|-------------|
| `mode` | `replace` \| `append` | `replace` | How the new data relates to existing data |
| `stepLabel` | any string | `"Unnamed Step"` | Human-readable label for the step (recorded as a baseline in append mode) |

#### Replace mode

Completely replaces the project's existing ledger with the submitted content.
All existing elements are deleted and replaced by the new set. Use this for
initial loads or full re-runs.

#### Append mode

Merges new elements into the existing ledger. Elements whose ID already exists
in the project are silently skipped (dedup by canonical element ID). Useful for
multi-step pipelines where each step adds a subset of elements.

Each append call creates a `LedgerStep` baseline entry recording the step name
and timestamp, visible in the Viewer's Baselines page.

---

#### Request body — JSON format

Send `Content-Type: application/json` with the canonical ledger JSON:

```json
{
  "ledger_id": "LD-my-system-001",
  "schema_id": "sysengage.ledger.instance.v2_2",
  "sources": [...],
  "requirements": [...],
  "findings": [...],
  "gaps": [...],
  "risks": [...],
  "traces": [...],
  "coverage_items": [...],
  "zachman_cells": [...],
  ...
}
```

All array fields are optional — omit any collection that has no content in this
submission.

---

#### Request body — Markdown format

Send `Content-Type: text/plain` (or omit the header) with the ledger as a
markdown document conforming to the SysEngage ledger markdown spec:

```
POST /api/projects/proj_8/ledger?mode=append&stepLabel=AnalysisRound2
Content-Type: text/plain

# Ledger: my-system
...
```

Alternatively, wrap the markdown in JSON:
```json
{ "content": "# Ledger: my-system\n..." }
```

---

#### Response — replace mode

```json
{
  "success": true,
  "mode": "replace",
  "elementCount": 87,
  "warnings": [],
  "ledgerId": "LD-my-system-001",
  "neonImported": true
}
```

#### Response — append mode

```json
{
  "success": true,
  "mode": "append",
  "newElements": 12,
  "baselineId": "BL-2026-03-16-0801",
  "counts": {
    "requirements": 5,
    "findings": 4,
    "coverage_items": 3
  },
  "warnings": [],
  "ledgerId": "LD-my-system-001"
}
```

`newElements` is the count of elements that were not already present.
`baselineId` is the ID of the `LedgerStep` baseline created for this step.

---

## Active Project

The Viewer UI has a concept of an "active project" — the one shown when you
load the dashboard without specifying a project ID.

```
GET  /api/projects/active         → { "projectId": "proj_8" }
PUT  /api/projects/active         body: { "projectId": "proj_8" }
```

External apps do not need to interact with these endpoints unless they want to
switch what the viewer displays by default.

---

## Read-Only Ledger Endpoints (Active Project)

All of the following read from the **active project**. They are used by the
Viewer UI and are available for external consumers that want element-level
access without downloading the full ledger blob.

| Endpoint | Returns |
|----------|---------|
| `GET /api/ledger/stats` | Counts per element type for the active project |
| `GET /api/ledger/sources` | All Source elements |
| `GET /api/ledger/requirements` | All Requirement elements |
| `GET /api/ledger/findings` | All Finding elements |
| `GET /api/ledger/gaps` | All Gap elements |
| `GET /api/ledger/risks` | All Risk elements |
| `GET /api/ledger/issues` | All Issue elements |
| `GET /api/ledger/traces` | All Trace elements |
| `GET /api/ledger/decisions` | All Decision elements |
| `GET /api/ledger/domains` | All Domain elements |
| `GET /api/ledger/coverage` | All CoverageItem elements |
| `GET /api/ledger/rules` | All Rule elements |
| `GET /api/ledger/questions` | All Question elements |
| `GET /api/ledger/assumptions` | All Assumption elements |
| `GET /api/ledger/constraints` | All Constraint elements |
| `GET /api/ledger/stakeholders` | All Stakeholder elements |
| `GET /api/ledger/segments` | All Segment elements |
| `GET /api/ledger/baselines` | All Baseline / LedgerStep entries |
| `GET /api/ledger/registers` | All Register elements |
| `GET /api/ledger/relationships` | Full relationship graph (nodes + edges) |
| `GET /api/ledger/zachman-grid` | 6×6 Zachman coverage grid for active project |
| `GET /api/ledger/{projectId}/zachman-grid` | 6×6 Zachman coverage grid for a specific project |

---

## Single Element Lookup

```
GET /api/ledger/element/{elementId}
```

Returns a single element by its canonical ID from the active project, along
with its type.

**Response 200:**
```json
{
  "element": {
    "coverage_id": "COV-ROW1-WHAT",
    "coverage_type": "Cell",
    "target_ref": "ZC-R1-C-What",
    "coverage_state": "Covered",
    "confidence": 0.95
  },
  "type": "CoverageItem"
}
```

**Response 404** — element not found.

---

## Batch Element Lookup

```
GET /api/ledger/elements/batch?ids=COV-ROW1-WHAT,ZC-R1-C-What,REQ-001
```

Returns multiple elements in a single call. IDs that do not exist are silently
omitted from the response.

**Response 200:**
```json
{
  "elements": {
    "COV-ROW1-WHAT": { "element": { ... }, "type": "CoverageItem" },
    "ZC-R1-C-What":  { "element": { ... }, "type": "ZachmanCell" },
    "REQ-001":       { "element": { ... }, "type": "Requirement" }
  }
}
```

---

## Utility

### GitHub Actions template

```
GET /api/actions-template
```

Downloads a pre-built GitHub Actions workflow YAML (`ledger-upload.yml`) that
demonstrates how to POST a ledger file to this API from a CI/CD pipeline.

### Neon DB connection status

```
GET /api/neon/status
```

Returns `{ "connected": true, "hasProjectData": true, "activeProjectId": "proj_8" }`.
Useful for health checks.

---

## Ledger Format Notes

- The canonical ledger is defined by the **SysEngage Canonical Ledger Spec v2.2**.
- All element IDs within a ledger must be unique strings in the format
  `TYPE-identifier` (e.g. `REQ-001`, `ZC-R1-C-What`, `COV-ROW1-WHAT`).
- In append mode, the dedup key is the element's canonical ID field (e.g.
  `requirement_id`, `coverage_id`, `zachman_cell_id`). If an element with that
  ID is already present in the project, the incoming element is skipped.
- Zachman cell IDs follow the canonical form `ZC-R{row}-C-{column}` where row
  is 1–6 and column is one of: `What`, `How`, `Where`, `Who`, `When`, `Why`.

---

## Error Responses

All error responses use this shape:

```json
{ "message": "Human-readable error description" }
```

Common status codes:

| Code | Meaning |
|------|---------|
| 401 | Missing or incorrect API key |
| 400 | Bad request — missing or invalid input |
| 404 | Project or element not found |
| 500 | Server-side error (check the `message` field for details) |
