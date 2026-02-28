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
- **Storage**: In-memory (MemStorage) with multi-project support (Map<string, Project>)
- **API**: RESTful endpoints under `/api/ledger/*` (active project scoped) and `/api/projects/*`
- **Ledger Parser**: `server/ledgerParser.ts` — parses markdown ledger files with embedded YAML blocks into CanonicalLedger objects
- **Running**: Production build via `NODE_ENV=production node dist/index.cjs` for stability; run `npm run build` after code changes
- **Note**: The `process.exit(1)` in `server/vite.ts` is suppressed by an override in `server/index.ts` (dev mode only) to prevent Vite errors from crashing the server

### Key Files
- `shared/schema.ts` - TypeScript interfaces for all ledger element types + Project/ProjectSummary types
- `server/ledgerParser.ts` - Markdown-to-CanonicalLedger parser (handles ## sections, ### elements, yaml blocks)
- `server/seedData.ts` - Realistic seed data for a defense/avionics system engineering ledger
- `server/storage.ts` - Storage interface and multi-project in-memory implementation
- `server/routes.ts` - API routes for ledger data and project management
- `client/src/App.tsx` - Root component with sidebar layout and routing
- `client/src/components/app-sidebar.tsx` - Navigation sidebar with project selector dropdown
- `client/src/pages/projects.tsx` - Project management page (create, upload, select, delete)
- `client/src/pages/` - Page components for each view

### Multi-Project System
- Projects contain a name, description, and an optional CanonicalLedger
- Users can create projects, upload markdown ledger files (.md), switch between projects
- A "Demo Project" with sample seed data is created by default on startup
- All `/api/ledger/*` endpoints are scoped to the currently active project
- Project switching invalidates all query caches to refresh views
- Sidebar has a project selector dropdown for quick switching

### Ledger File Format
Markdown with embedded YAML code blocks:
- `## SectionName` headers define collections (Sources, Requirements, Traces, etc.)
- `### ElementType ID` headers define individual elements
- YAML fenced code blocks contain element data
- Sections map to CanonicalLedger fields (Sources→sources, Registers→*_register by register_type, etc.)
- Parser handles large files (tested with 59K lines, 4,733 elements)

### Ledger Data Model (from spec v1.0)
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
6. **Traceability** - Trace relationships (ST/DT/GT/AT) table
7. **Requirements** - Requirements with type, priority, verification
8. **Coverage** - Coverage analysis with state distribution
9. **Findings** - Analysis findings with severity and related items
10. **Gaps** - Gap cards with impact, resolution state, affected cells
11. **Risks** - Risk register with likelihood/impact/exposure matrix
12. **Issues** - Issue tracking with severity and status
13. **Decisions** - Architectural/governance decisions
14. **Stakeholders** - Stakeholder profiles with domain associations

### API Endpoints
- `GET /api/projects` - List all projects with summary info
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/active` - Get active project ID
- `PUT /api/projects/active` - Set active project
- `POST /api/projects/:id/ledger` - Upload markdown ledger file to project
- `GET /api/ledger` - Full ledger for active project
- `GET /api/ledger/stats` - Computed statistics for active project
- `GET /api/ledger/sources|requirements|...` - Individual collections
