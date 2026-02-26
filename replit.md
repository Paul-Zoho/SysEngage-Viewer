# SysEngage POC 5 - Systems Engineering Canonical Ledger Tool

## Overview
SysEngage is a Systems Engineering tool that implements the Canonical Ledger Specification (v1.0). It provides a structured dashboard for viewing, navigating, and managing SE artifacts across 60+ element types defined in the ledger specification.

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
- **Storage**: In-memory (MemStorage) with seed data representing a sample canonical ledger
- **API**: RESTful endpoints under `/api/ledger/*`

### Key Files
- `shared/schema.ts` - TypeScript interfaces for all ledger element types
- `server/seedData.ts` - Realistic seed data for a defense/avionics system engineering ledger
- `server/storage.ts` - Storage interface and in-memory implementation
- `server/routes.ts` - API routes for all ledger data
- `client/src/App.tsx` - Root component with sidebar layout and routing
- `client/src/components/app-sidebar.tsx` - Navigation sidebar
- `client/src/pages/` - Page components for each view

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
2. **Ledger Explorer** - Hierarchical register browser with metadata
3. **Sources** - Source excerpts table with provenance data
4. **Domains** - Domain classification cards
5. **Traceability** - Trace relationships (ST/DT/GT/AT) table
6. **Requirements** - Requirements with type, priority, verification
7. **Coverage** - Coverage analysis with state distribution
8. **Findings** - Analysis findings with severity and related items
9. **Gaps** - Gap cards with impact, resolution state, affected cells
10. **Risks** - Risk register with likelihood/impact/exposure matrix
11. **Issues** - Issue tracking with severity and status
12. **Decisions** - Architectural/governance decisions
13. **Stakeholders** - Stakeholder profiles with domain associations
