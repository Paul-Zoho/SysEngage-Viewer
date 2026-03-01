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
- **Storage**: PostgreSQL via Drizzle ORM (DatabaseStorage) with multi-project support
- **Database**: PostgreSQL with `projects` table (id, project_id, name, description, created_utc, ledger JSONB, is_active)
- **API**: RESTful endpoints under `/api/ledger/*` (active project scoped) and `/api/projects/*`
- **Ledger Parser**: `server/ledgerParser.ts` — parses markdown ledger files (YAML blocks or plain bullet-list format) and JSON ledger files (v2.2 canonical format) into CanonicalLedger objects
- **Running**: Production build via `NODE_ENV=production node dist/index.cjs` for stability; run `npm run build` after code changes
- **Note**: The `process.exit(1)` in `server/vite.ts` is suppressed by an override in `server/index.ts` (dev mode only) to prevent Vite errors from crashing the server

### Key Files
- `shared/schema.ts` - TypeScript interfaces for all ledger element types + Project/ProjectSummary types
- `server/ledgerParser.ts` - Markdown-to-CanonicalLedger parser (handles ## sections, ### elements, yaml blocks)
- `server/seedData.ts` - Realistic seed data for a defense/avionics system engineering ledger
- `server/storage.ts` - Storage interface and DatabaseStorage (PostgreSQL) implementation
- `server/db.ts` - Drizzle ORM database connection (node-postgres Pool)
- `server/routes.ts` - API routes for ledger data and project management
- `client/src/App.tsx` - Root component with sidebar layout and routing
- `client/src/components/app-sidebar.tsx` - Navigation sidebar with project selector dropdown
- `client/src/pages/projects.tsx` - Project management page (create, upload, select, delete)
- `client/src/pages/` - Page components for each view

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
2. **Projects** - Create, manage, upload ledger files, switch active project
3. **Ledger Explorer** - Hierarchical register browser with metadata
4. **Sources** - Source excerpts table with provenance data
5. **Domains** - Domain classification cards
6. **Traceability** - Trace relationships with flat/grouped views, type filtering, and search
7. **Relationships** - Relationship matrix showing cross-type element connections with interactive filtering
8. **Requirements** - Requirements with type, priority, verification
9. **Coverage** - Coverage analysis with state distribution
10. **Findings** - Analysis findings with severity and related items
11. **Gaps** - Gap cards with impact, resolution state, affected cells
12. **Risks** - Risk register with likelihood/impact/exposure matrix
13. **Issues** - Issue tracking with severity and status
14. **Decisions** - Architectural/governance decisions
15. **Stakeholders** - Stakeholder profiles with domain associations

### Relationship Visualization System
Three interconnected features for exploring element relationships:

1. **Relationship Matrix** (`/relationships`): Interactive matrix/grid showing edge counts between element type pairs. Click cells to filter the edge list. Summary stats cards, relationship type distribution, and searchable edge table.

2. **Grouped Trace Tables** (`/traces`): Enhanced traceability page with flat/grouped view toggle. Grouped view organizes traces by from→to element type pairs in collapsible cards. Includes trace type filter (ST/DT/GT/AT) and text search.

3. **Element Detail Panel**: Slide-over panel triggered by clicking any ElementId badge across the app. Shows element info, outgoing relationships, and incoming relationships grouped by type. Supports navigation between related elements within the panel.

Key components:
- `client/src/pages/relationships.tsx` - Relationship matrix page
- `client/src/components/element-detail-panel.tsx` - Detail panel (Sheet)
- `client/src/components/element-id.tsx` - Clickable ElementId with context-based detail panel integration
- `GET /api/ledger/relationships` - Computes unified relationship graph from all element cross-references

### API Endpoints
- `GET /api/projects` - List all projects with summary info
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/active` - Get active project ID
- `PUT /api/projects/active` - Set active project
- `POST /api/projects/:id/ledger` - Upload ledger file (markdown or JSON) to project
- `GET /api/ledger` - Full ledger for active project
- `GET /api/ledger/stats` - Computed statistics for active project
- `GET /api/ledger/relationships` - Unified relationship graph (nodes + edges) for active project
- `GET /api/ledger/sources|requirements|...` - Individual collections
