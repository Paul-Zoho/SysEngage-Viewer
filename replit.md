# SysEngage POC 5 - Systems Engineering Canonical Ledger Tool

## Overview
SysEngage is a Systems Engineering tool that implements the Canonical Ledger Specification (v1.0). It provides a structured dashboard for viewing, navigating, and managing SE artifacts across 60+ element types defined in the ledger specification. Supports multi-project workspaces with markdown ledger file upload.

## Architecture

### Frontend
- **Framework**: React + TypeScript with Vite
- **Routing**: wouter
- **State**: TanStack React Query
- **UI**: shadcn/ui components + Tailwind CSS
- **Fonts**: IBM Plex Sans (body), Source Code Pro (mono)
- **Design**: Engineering blue (#0066CC) primary, enterprise technical aesthetic

### Backend
- **Server**: Express.js
- **Storage**: Single Neon PostgreSQL database (NEON_DATABASE_URL)
  - `n_projects` table: project metadata + JSONB ledger blobs
  - 40 relational tables for normalized element data (`n_sources`, `n_requirements`, `n_traces`, etc.)
  - `n_element_refs`: universal cross-reference table
  - `n_registers`: register metadata
- **API**: RESTful endpoints under `/api/ledger/*` (active project scoped) and `/api/projects/*`
  - Collection endpoints read from normalized Neon tables with JSONB fallback
  - Project CRUD hits `n_projects` in Neon
- **Ledger Parser**: `server/ledgerParser.ts` — parses markdown and JSON ledger files into CanonicalLedger objects
- **Neon Integration**: `server/neonDb.ts` (connection, required), `shared/neonSchema.ts` (Drizzle schema), `server/neonImport.ts` (ledger→relational import + append mode), `server/neonStorage.ts` (relational query layer)
- **Append Mode**: `POST /api/projects/:id/ledger?mode=append&stepLabel=...` merges new elements into existing data (skipping duplicates by element ID). Auto-creates a `LedgerStep` baseline marking each step. JSONB blob in `n_projects` is also merged. Default mode is `replace` (full delete+replace, existing behavior).
- **Running**: Production build via `NODE_ENV=production node dist/index.cjs` for stability; run `npm run build` after code changes
- **Note**: The `process.exit(1)` in `server/vite.ts` is suppressed by an override in `server/index.ts` (dev mode only) to prevent Vite errors from crashing the server

### Key Files
- `shared/schema.ts` - TypeScript interfaces for all ledger element types + Project/ProjectSummary types (no pgTable definitions)
- `shared/neonSchema.ts` - Drizzle schema for all tables including `n_projects` and 40 relational element tables
- `server/storage.ts` - IStorage interface and NeonProjectStorage class (reads/writes `n_projects` in Neon)
- `server/neonDb.ts` - Neon PostgreSQL connection manager (NEON_DATABASE_URL required)
- `server/neonImport.ts` - Imports CanonicalLedger into Neon relational tables
- `server/neonStorage.ts` - Query layer for Neon relational tables
- `server/ledgerParser.ts` - Markdown-to-CanonicalLedger parser (handles ## sections, ### elements, yaml blocks)
- `server/seedData.ts` - Realistic seed data for a defense/avionics system engineering ledger
- `server/routes.ts` - API routes
- `drizzle-neon.config.ts` - Drizzle Kit config for Neon schema push (permanent admin utility)
- `drizzle.config.ts` - Also points to Neon (same as drizzle-neon.config.ts)
- `client/src/App.tsx` - Root component with sidebar layout and routing
- `client/src/components/app-sidebar.tsx` - Navigation sidebar with project selector dropdown
- `client/src/pages/projects.tsx` - Project management page (create, upload, select, delete)
- `client/src/pages/` - Page components for each view

### Environment
- **Required Secret**: `NEON_DATABASE_URL` — sole database connection (Neon PostgreSQL)
- **No longer used**: `DATABASE_URL` (Replit PostgreSQL) — removed in consolidation

### Multi-Project System
- Projects contain a name, description, and an optional CanonicalLedger
- Users can create projects, upload ledger files (.md markdown or .json canonical format), switch between projects
- A "Demo Project" with sample seed data is created by default on startup
- All `/api/ledger/*` endpoints are scoped to the currently active project
- Project switching invalidates all query caches to refresh views
- Sidebar has a project selector dropdown for quick switching

### Ledger File Formats
Two formats are supported for upload:

**1. Markdown (`.md`)**:
- `## SectionName` headers define collections (Sources, Requirements, Traces, etc.)
- `### ElementType ID` headers define individual elements
- YAML fenced code blocks or plain bullet-list format contain element data
- Sections map to CanonicalLedger fields (Sources→sources, Registers→*_register by register_type, etc.)
- Parser handles large files (tested with 59K lines, 4,733 elements)

**2. JSON Canonical (`.json` / `.ledger.json`) — v2.2 spec**:
- Flat `elements[]` array with `{ element_type, element_id, payload }` envelopes
- Top-level metadata: `sysengage_ledger_version`, `schema_id`, `row_target`, `run_id`, `created_utc`, `generator`
- `register_index[]` for fast register lookup
- `content_hash` for integrity verification (accepted but not validated)
- `parseJsonLedger()` dispatches each element by type into CanonicalLedger arrays/registers
- Frontend detects `.json` extension and sends with `application/json` content type

### Ledger Data Model (from spec v2.2)
The ledger contains these element types with their registers:
- **Provenance**: Source, Segment, SourceAtom, Domain
- **Requirements**: Requirement, CandidateRequirement, Constraint
- **Analysis**: AnalysisPass, Finding, Gap, Evaluation, Rule, Checklist
- **Governance**: Risk, Issue, Decision, Violation, Stakeholder
- **Coverage**: CoverageItem, CoverageRegister
- **Traceability**: Trace (ST/DT/GT/AT types)
- **Framework**: ZachmanCell, CellContentItem, CellRelationship
- **Narrative**: NarrativeSummary, StructuralRepresentation
- **Control**: ControlArtefact, Signal, Concern, ClosureMatrix
- **Configuration**: Baseline, ChangeRecord
- **Supplementary**: Question, Answer, Assumption, Suggestion

Each element type has a corresponding Register that tracks all member IDs for completeness validation. Total: 33 registers across all element types.

### Pages
1. **Dashboard** - Overview stats, distribution charts, executive summary
2. **Projects** - Create, manage, upload ledger files (with mode toggle: replace/append + step label), switch active project, download GitHub Actions template
3. **Ledger Explorer** - Hierarchical register browser with metadata
4. **Baselines** - Timeline view of LedgerStep baselines from append uploads, showing step counts and new element contributions
5. **Sources** - Source excerpts table with provenance data
6. **Segments** - Logical groupings of source text with titles, descriptions, and source references
7. **Domains** - Domain classification cards
8. **Traceability** - Trace relationships with flat/grouped views, type filtering, and search
9. **Relationships** - Relationship matrix showing cross-type element connections with interactive filtering
10. **Requirements** - Requirements with type, priority, verification
11. **Coverage** - Coverage analysis with state distribution
12. **Findings** - Analysis findings with severity and related items
13. **Gaps** - Gap cards with impact, resolution state, affected cells
14. **Risks** - Risk register with likelihood/impact/exposure matrix
15. **Issues** - Issue tracking with severity and status
16. **Decisions** - Architectural/governance decisions
17. **Stakeholders** - Stakeholder profiles with domain associations

### Relationship Visualization System
Three interconnected features for exploring element relationships:

1. **Relationship Matrix** (`/relationships`): Interactive matrix/grid showing edge counts between element type pairs. Click cells to filter the edge list. Summary stats cards, relationship type distribution, and searchable edge table.

2. **Grouped Trace Tables** (`/traces`): Enhanced traceability page with flat/grouped view toggle. Grouped view organizes traces by from→to element type pairs in collapsible cards. Includes trace type filter (ST/DT/GT/AT) and text search.

3. **Full-Screen Element Detail** (`/element/:id`): Clicking any ElementId badge navigates to a dedicated full-screen page showing all element attributes in a table, plus all outgoing/incoming relationships with full details of related elements (type, description, confidence, etc.). Supports direction/type filtering, search, and clicking through to related elements.

Key components:
- `client/src/pages/relationships.tsx` - Relationship matrix page
- `client/src/pages/element-detail.tsx` - Full-screen element detail page with attributes and relationships
- `client/src/components/element-id.tsx` - Clickable ElementId that navigates to `/element/:id`
- `client/src/components/element-detail-panel.tsx` - Legacy slide-over panel (unused, replaced by full-screen page)
- `GET /api/ledger/relationships` - Computes unified relationship graph from all element cross-references
- `GET /api/ledger/element/:id` - Returns full element data with all attributes
- `GET /api/ledger/elements/batch?ids=...` - Batch fetch full element data for multiple IDs

### API Endpoints
- `GET /api/projects` - List all projects with summary info
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/active` - Get active project ID
- `PUT /api/projects/active` - Set active project
- `POST /api/projects/:id/ledger` - Upload ledger file (markdown or JSON) to project. Supports `?mode=append&stepLabel=StepName` for incremental appends
- `GET /api/ledger/baselines` - Baselines for active project (includes auto-created LedgerStep baselines)
- `GET /api/ledger` - Full ledger for active project
- `GET /api/ledger/stats` - Computed statistics for active project
- `GET /api/ledger/relationships` - Unified relationship graph (nodes + edges) for active project
- `GET /api/ledger/element/:id` - Full element data by ID
- `GET /api/ledger/elements/batch?ids=...` - Batch element lookup
- `GET /api/ledger/sources|requirements|...` - Individual collections
- `GET /api/actions-template` - Download GitHub Actions YAML template for CI/CD ledger uploads
- `GET /api/neon/status` - Neon connection status, has-data checks
- `POST /api/neon/migrate` - Force re-import all project ledgers into Neon relational tables
