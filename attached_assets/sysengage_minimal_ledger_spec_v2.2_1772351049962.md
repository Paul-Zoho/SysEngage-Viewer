# SysEngage Minimal Canonical Ledger Specification
## Version v2.2

## 0. Permitted Element Types

The following is a list of permitted elements types within the ledger

- `Source`
- `Register`
- `SourceRegister`
- `AnalysisPass`
- `Finding`
- `FindingsRegister`
- `Gap`
- `GapRegister`
- `ZachmanCell`
- `ZachmanCellRegister`
- `CellContentItem`
- `CellRelationship`
- `Trace`
- `TraceRegister`
- `Domain`
- `DomainRegister`
- `Requirement`
- `RequirementRegister`
- `Question`
- `QuestionRegister`
- `Answer`
- `AnswerRegister`
- `Assumption`
- `AssumptionRegister`
- `Constraint`
- `ConstraintRegister`
- `Risk`
- `ActiveRiskRegister`
- `Issue`
- `IssueRegister`
- `CandidateRequirement`
- `CandidateRequirementRegister`
- `Suggestion`
- `SuggestionRegister`
- `CoverageItem`
- `CoverageRegister`
- `Rule`
- `Checklist`
- `Evaluation`
- `EvaluationRegister`
- `Segment`
- `SegmentRegister`
- `SourceAtom`
- `SourceAtomRegister`
- `ConcernCategory`
- `Concern`
- `ConcernRegister`
- `Baseline`
- `ArtefactState`
- `ChangeRecord`
- `Decision`
- `DecisionRegister`
- `Violation`
- `ViolationRegister`
- `ClosureMatrix`
- `StructuralRepresentation`
- `StructuralRepresentationRegister`
- `Stakeholder`
- `StakeholderRegister`
- `NarrativeSummary`
- `NarrativeSummaryRegister`
- `ControlArtefact`
- `ControlArtefactRegister`
- `Signal`
- `SignalRegister`

## 1. CanonicalLedger (v0.12 Constraints)

### Purpose (NORMATIVE)

- Define the authoritative container representing a valid SysEngage ledger instance.
- Provide run context (row_target) and creation metadata for governance and audit.


A `CanonicalLedger` SHALL:

1. Contain zero or more `Source` elements
2. Contain exactly one `SourceRegister`
3. Allow zero or more additional `Register` elements
4. Allow zero or more `AnalysisPass` elements
5. Allow zero or more `Finding` elements
6. Contain exactly one `FindingsRegister`
7. Allow zero or more `Gap` elements
8. Contain exactly one `GapRegister`
9. Allow zero or more `ZachmanCell` elements
10. Contain exactly one `ZachmanCellRegister`
11. Allow zero or more `CellContentItem` elements
12. Allow zero or more `CellRelationship` elements
13. Allow zero or more `Trace` elements
14. Contain exactly one `TraceRegister`
15. Allow zero or more `Domain` elements  
16. Contain exactly one `DomainRegister`
17. Allow zero or more `Requirement` elements  
18. Contain exactly one `RequirementRegister`
19. Allow zero or more `Question` elements  
20. Contain exactly one `QuestionRegister`
21. Allow zero or more `Answer` elements  
22. Contain exactly one `AnswerRegister`
23. Allow zero or more `Assumption` elements  
24. Contain exactly one `AssumptionRegister`
25. Allow zero or more `Constraint` elements  
26. Contain exactly one `ConstraintRegister`
27. Allow zero or more `Risk` elements  
28. Contain exactly one `ActiveRiskRegister`
29. Allow zero or more `Issue` elements  
30. Contain exactly one `IssueRegister`
31. Allow zero or more `CandidateRequirement` elements  
32. Contain exactly one `CandidateRequirementRegister`
33. Allow zero or more `Suggestion` elements  
34. Contain exactly one `SuggestionRegister`
35. Allow zero or more `CoverageItem` elements  
36. Contain exactly one `CoverageRegister`
37. Allow zero or more `Rule` elements  
38. Allow zero or more `Checklist` elements  
39. Allow zero or more `Evaluation` elements  
40. Contain exactly one `EvaluationRegister`
41. Allow zero or more `Segment` elements  
42. Contain exactly one `SegmentRegister`  
43. Allow zero or more `SourceAtom` elements  
44. Contain exactly one `SourceAtomRegister`  
45. Allow zero or more `ConcernCategory` elements  
46. Allow zero or more `Concern` elements  
47. Contain exactly one `ConcernRegister`
48. Allow zero or more `Baseline` elements  
49. Allow zero or more `ArtefactState` elements  
50. Allow zero or more `ChangeRecord` elements  
51. Allow zero or more `Decision` elements  
52. Contain exactly one `DecisionRegister`
53. Allow zero or more `Violation` elements  
54. Contain exactly one `ViolationRegister`  
55. Allow zero or more `ClosureMatrix` elements
56. Allow zero or more `StructuralRepresentation` elements  
57. Contain exactly one `StructuralRepresentationRegister`  
58. Allow zero or more `Stakeholder` elements  
59. Contain exactly one `StakeholderRegister`  
60. Allow zero or more `NarrativeSummary` elements  
61. Contain exactly one `NarrativeSummaryRegister`  
62. Allow zero or more `ControlArtefact` elements  
63. Contain exactly one `ControlArtefactRegister`
64. Allow zero or more `Signal` elements  

## 2. Element Type — Source

### Purpose (NORMATIVE) — Replace / Clarify
A `Source` element represents a **traceable excerpt** originating from an immutable input artefact, typically at a granularity suitable for deterministic traceability such as:
- a sentence-level statement,
- a single bullet statement,
- a single table-row assertion,
- a definition line or constraint-like statement.

A Source exists to:
- provide the primary provenance anchor for Trace relationships,
- preserve the original wording used for downstream analysis,
- enable deterministic review of what source content was used.

### Non-Purpose (NORMATIVE)

- Store paraphrases, summaries, or inferred interpretations.
- Act as a document catalogue entry without excerpt text.
- Store derived outputs such as requirements, findings, gaps, or decisions.

### Attributes (with descriptions)

- `source_id: string`` (REQUIRED, format `S###`)
  Description: Stable identifier for the Source element.
  Notes: null

- `source_text: string`` (REQUIRED)
  Description: Verbatim excerpt or anchor text from an immutable source artefact.
  Notes: null

- `segmentation_context: string`` (REQUIRED)
  Description: Classification context explaining why this excerpt exists in this ledger scope.
  Notes: null

- `parent_source_ref: string`` (OPTIONAL, format `S###`)
  Description: Optional reference to a broader Source excerpt forming a parent/child hierarchy.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `source_id` MUST be unique and match `^S\d{3}$`.
- If `parent_source_ref` is present, it MUST reference an existing Source and MUST NOT self-reference.
- A `Source` element SHOULD be the default provenance target for Trace relationships unless `SourceAtom` is explicitly used for finer-grained tracing in a specific ledger instance.
- The ledger remains conformant if all provenance tracing is performed to `Source` elements and no `SourceAtom` elements are present.

## 3. Element Type — Register (Generic)

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `(Generic)` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string`` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string`` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: string[]`` (REQUIRED, ordered)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string`` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

### Normative Rules

- `member_ids` SHALL reference valid ledger element identifiers only and contain no duplicates.

## 4. Element Type — SourceRegister

**Specialisation of:** `Register`

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Source` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Store paraphrases, summaries, or inferred interpretations.
- Act as a document catalogue entry without excerpt text.
- Store derived outputs such as requirements, findings, gaps, or decisions.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE SourceRegister SHALL exist.
- `register_type` SHALL be `Source`.
- `member_ids` SHALL contain ALL `Source.source_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Source elements present in the ledger.

## 5. Element Type — AnalysisPass

### Purpose (NORMATIVE)

- Record a discrete analytical activity executed within the SysEngage process.
- Enable attribution of analytical outputs (Findings, Gaps, Suggestions, Evaluations, Coverage).
- Support auditability and run reconstruction without embedding process logiB.

### Attributes (with descriptions)

- `pass_id: string`` (REQUIRED, format `P###`)
  Description: Stable identifier for the AnalysisPass element.
  Notes: null

- `pass_type: string`` (REQUIRED)
  Description: Classification of analysis activity.
  Notes: null

- `evaluated_scope: string`` (REQUIRED)
  Description: Statement describing what was analysed in this pass.
  Notes: null

- `evaluation_ids: string[]`` (OPTIONAL; references `Evaluation.evaluation_id`)
  Description: Optional list of Evaluations produced by this pass.
  Notes: null

- `rule_ids: string[]`` (OPTIONAL; references `Rule.rule_id`)
  Description: Optional list of Rules applied by this pass.
  Notes: null

- `checklist_ids: string[]`` (OPTIONAL; references `Checklist.checklist_id`)
  Description: Optional list of Checklists applied by this pass.
  Notes: null

- `produced_finding_ids: string[]`` (OPTIONAL; references `Finding.finding_id`)
  Description: Optional list of Findings produced by this pass.
  Notes: null

- `produced_gap_ids: string[]`` (OPTIONAL; references `Gap.gap_id`)
  Description: Optional list of Gaps produced by this pass.
  Notes: null

- `produced_suggestion_ids: string[]`` (OPTIONAL; references `Suggestion.suggestion_id`)
  Description: Optional list of Suggestions produced by this pass.
  Notes: null

- `produced_coverage_ids: string[]`` (OPTIONAL; references `CoverageItem.coverage_id`)
  Description: Optional list of Coverage items produced by this pass.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `pass_id` MUST be unique and match `^P\\d{3}$`.: string`
  Description: See element definition for semantic meaning of `pass_id` MUST be unique and match `^P\\d{3}$`.`.
  Notes: null

- `pass_type` MUST NOT be empty.: string`
  Description: See element definition for semantic meaning of `pass_type` MUST NOT be empty.`.
  Notes: null

- `evaluated_scope` MUST NOT be empty.: string`
  Description: See element definition for semantic meaning of `evaluated_scope` MUST NOT be empty.`.
  Notes: null

- `Provenance constraint: string`
  Description: See element definition for semantic meaning of `Provenance constraint`.
  Notes: null

- `At least one of `evaluation_ids`, `rule_ids`, or `checklist_ids` MUST be provided.: string`
  Description: See element definition for semantic meaning of `At least one of `evaluation_ids`, `rule_ids`, or `checklist_ids` MUST be provided.`.
  Notes: null

- `If `evaluation_ids` is present, each entry MUST reference an existing `Evaluation.evaluation_id`.: string`
  Description: See element definition for semantic meaning of `If `evaluation_ids` is present, each entry MUST reference an existing `Evaluation.evaluation_id`.`.
  Notes: null

- `If `rule_ids` is present, each entry MUST reference an existing `Rule.rule_id`.: string`
  Description: See element definition for semantic meaning of `If `rule_ids` is present, each entry MUST reference an existing `Rule.rule_id`.`.
  Notes: null

- `If `checklist_ids` is present, each entry MUST reference an existing `Checklist.checklist_id`.: string`
  Description: See element definition for semantic meaning of `If `checklist_ids` is present, each entry MUST reference an existing `Checklist.checklist_id`.`.
  Notes: null

- `For each produced_* list that is present: string`
  Description: See element definition for semantic meaning of `For each produced_* list that is present`.
  Notes: null

- `MUST contain at least one entry: string`
  Description: See element definition for semantic meaning of `MUST contain at least one entry`.
  Notes: null

- `each entry MUST reference the corresponding element identifier.: string`
  Description: See element definition for semantic meaning of `each entry MUST reference the corresponding element identifier.`.
  Notes: null

- `confidence` MUST be within 0.0..1.0.: string`
  Description: See element definition for semantic meaning of `confidence` MUST be within 0.0..1.0.`.
  Notes: null

### Normative Rules

- `pass_id` MUST be unique and match `^P\d{3}$`.
- `produced_finding_ids` MUST reference `Finding.finding_id` values in this ledger.

---

## 6. Element Type — Finding (Aligned)

### Purpose (NORMATIVE)

- Record an analytical observation or assessment result produced during evaluation.
- Support review and remediation workflows as an explicit analytical output.
- Preserve evaluation outcomes separately from Requirements and design artefacts.

### Non-Purpose (NORMATIVE)

- Store requirements or design decisions.
- Act as untraceable subjective commentary.

### Attributes (with descriptions)

- `finding_id: string`` (REQUIRED, format `F###`)
  Description: Stable identifier for the Finding element.
  Notes: null

- `type: string`` (REQUIRED)
  Description: Classification of the finding/observation category.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `severity: string`` (REQUIRED; High|Medium|Low)
  Description: Impact/criticality classification.
  Notes: null

- `related_items: string[]`` (REQUIRED)
  Description: List of element identifiers associated with or impacted by this item.
  Notes: null

- `produced_by_pass_id: string`` (REQUIRED)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `rule_triggered: string[]`` (OPTIONAL)
  Description: Optional identifier/name of the rule that triggered the finding.
  Notes: null

- `evidence: string[]`` (OPTIONAL)
  Description: Optional supporting evidence artefact or excerpt reference.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

- `source_refs: string[]`` (REQUIRED; references `Source.source_id` values)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

### Normative Rules

- `finding_id` MUST be unique and match `^F\d{3}$`.
- `produced_by_pass_id` MUST reference an existing `AnalysisPass.pass_id`.
- `related_items` MUST reference valid ledger element identifiers.
- If `rule_triggered` is present:
  - MUST contain at least one entry
  - Each entry MUST NOT be empty
- `source_refs` MUST reference valid `Source.source_id` values.

---

## 7. Element Type — FindingsRegister

**Specialisation of:** `Register`

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Findings` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE FindingsRegister SHALL exist.
- `register_type` SHALL be `Finding`.
- `member_ids` SHALL contain ALL `Finding.finding_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Finding elements present in the ledger.

---

## 8. Element Type — ZachmanCell

### Purpose (NORMATIVE)

- Represent a Zachman framework cell within a defined row/column scope.
- Provide a structural anchor for cell-scoped content and completeness checks.

### Attributes (with descriptions)

- `cell_id: string`` (REQUIRED)
  Description: Stable identifier for the ZachmanCell element.
  Notes: null

- `row: string`` (REQUIRED)
  Description: Zachman row index.
  Notes: null

- `column: string`` (REQUIRED)
  Description: Zachman column identifier.
  Notes: null

- `obligation_rules_ref: string[]`` (REQUIRED)
  Description: Optional reference(s) to rules defining obligations for this cell.
  Notes: null

### Normative Rules

- `cell_id` MUST be unique and MUST NOT be empty.
- `row` MUST NOT be empty.
- `column` MUST NOT be empty.
- `obligation_rules_ref` MUST contain at least one entry.

---
## 9. Element Type — ZachmanCellRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `ZachmanCell` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE ZachmanCellRegister SHALL exist.
- `register_type` SHALL be `ZachmanCell`.
- `member_ids` SHALL contain ALL `ZachmanCell.cell_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL ZachmanCell elements present in the ledger.

---
## 10. Element Type — Gap (Aligned)


### Purpose (NORMATIVE)

- Record a missing, incomplete, inconsistent, or unresolved condition in scope.
- Support closure tracking and mitigation workflows.
- Enable traceability to impacted elements and (where applicable) Zachman cells.

### Non-Purpose (NORMATIVE)

- Store proposed solutions (use Suggestion).
- Duplicate Findings without describing a missing/deficient condition.

### Attributes (with descriptions)

- `gap_id: string`` (REQUIRED, format `G###`)
  Description: Stable identifier for the Gap element.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `impact: string`` (REQUIRED)
  Description: Indicator of consequence/severity.
  Notes: null

- `affected_cells: string[]`` (REQUIRED; references `ZachmanCell.cell_id` values)
  Description: Optional list of impacted Zachman cell identifiers.
  Notes: null

- `proposed_resolution: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `proposed_resolution`.
  Notes: null

- `resolution_state: string`` (OPTIONAL; Open|Accepted|Mitigated|Closed)
  Description: See element definition for semantic meaning of `resolution_state`.
  Notes: null

- `domain_refs: string[]`` (REQUIRED; references `Domain.domain_id` values)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `traceability: string[]`` (REQUIRED; references `Trace.trace_id` values)
  Description: See element definition for semantic meaning of `traceability`.
  Notes: null

- `produced_from_finding_ids: string[]`` (REQUIRED; references `Finding.finding_id` values)
  Description: See element definition for semantic meaning of `produced_from_finding_ids`.
  Notes: null

### Normative Rules

- `gap_id` MUST be unique and match `^G\d{3}$`.
- `affected_cells` MUST contain at least one entry and each entry MUST reference an existing `ZachmanCell.cell_id`.
- `produced_from_finding_ids` MUST contain at least one entry and each entry MUST reference an existing `Finding.finding_id`.
- `domain_refs` MUST contain at least one entry and each entry MUST reference an existing `Domain.domain_id`.
- `traceability` MUST contain at least one entry and each entry MUST reference an existing `Trace.trace_id`.
- A `Gap` MAY be associated with one or more `Question` elements via `Question.related_gap_ids`.
- If `resolution_state` is present, it MUST be one of: Open | Accepted | Mitigated | Closed

---
## 11. Element Type — GapRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Gap` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE GapRegister SHALL exist.
- `register_type` SHALL be `Gap`.
- `member_ids` SHALL contain ALL `Gap.gap_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Gap elements present in the ledger.

---
## 12. Element Type — Trace

### Purpose (NORMATIVE)

- Represent an explicit relationship between two ledger elements.
- Support provenance, dependency navigation, and impact analysis.
- Enable auditability of linkage semantics without embedding process behaviour.

### Non-Purpose (NORMATIVE)

- Replace structured attributes already defined on elements.
- Act as free-form commentary without clear relationship semantics.

### Attributes (with descriptions)

- `trace_id: string`` (REQUIRED, format `T###`)
  Description: Stable identifier for the Trace relationship.
  Notes: null

- `from_id: string`` (REQUIRED; references a valid ledger element identifier)
  Description: Identifier of the originating element in the relationship.
  Notes: null

- `to_id: string`` (REQUIRED; references a valid ledger element identifier)
  Description: Identifier of the target element in the relationship.
  Notes: null

- `trace_type: string`` (REQUIRED; ST|DT|GT|AT)
  Description: Classification of the relationship semantics.
  Notes: null

- `rationale: string`` (REQUIRED)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

- `interpretation_magnitude: number`` (OPTIONAL; DT only)
  Description: Optional indicator of interpretive distance between related elements.
  Notes: null

### Normative Rules

- `trace_id` MUST be unique across all Trace elements.
- `trace_id` MUST match regex `^T\d{3}$`.
- `from_id` MUST reference an existing ledger element identifier.
- `to_id` MUST reference an existing ledger element identifier.
- `from_id` MUST NOT equal `to_id`.
- `trace_type` SHALL be one of: `ST`, `DT`, `GT`, `AT`.
- `rationale` MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.
- If `trace_type == DT`:
  - `interpretation_magnitude` MAY be present
  - If present, MUST be within 0.0..1.0
- If `trace_type != DT`:
  - `interpretation_magnitude` SHALL NOT be present
- `from_id` and `to_id` MAY reference `Requirement.requirement_id`.
## 13. Element Type — TraceRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Trace` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE TraceRegister SHALL exist.
- `register_type` SHALL be `Trace`.
- `member_ids` SHALL contain ALL `Trace.trace_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Trace elements present in the ledger.
## 14. Element Type — CellContentItem


### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `ci_id: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `ci_id`.
  Notes: null

- `cell_id: string`` (REQUIRED; references `ZachmanCell.cell_id`)
  Description: Stable identifier for the ZachmanCell element.
  Notes: null

- `classification_type: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `classification_type`.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `trigger_condition: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `trigger_condition`.
  Notes: null

- `justification: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `justification`.
  Notes: null

- `linked_objects: string[]`` (REQUIRED)
  Description: See element definition for semantic meaning of `linked_objects`.
  Notes: null

### Normative Rules

- `ci_id` MUST be unique.
- `cell_id` MUST reference an existing `ZachmanCell.cell_id`.
- `linked_objects` MUST contain at least one entry and each entry MUST reference a valid ledger element identifier.

---
## 15. Element Type — CellRelationship


### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `relationship_id: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `relationship_id`.
  Notes: null

- `from_ci: string`` (REQUIRED; references `CellContentItem.ci_id`)
  Description: See element definition for semantic meaning of `from_ci`.
  Notes: null

- `to_ci: string`` (REQUIRED; references `CellContentItem.ci_id`)
  Description: See element definition for semantic meaning of `to_ci`.
  Notes: null

- `relationship_type: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `relationship_type`.
  Notes: null

- `rationale: string`` (REQUIRED)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

### Normative Rules

- `relationship_id` MUST be unique.
- `from_ci` and `to_ci` MUST reference existing CellContentItems and MUST NOT be equal.

---
## 16. Element Type — Domain

### Purpose (NORMATIVE)

- Represent a classification domain used to organise and contextualise ledger elements.
- Support domain coverage analysis and structured viewpoints.

### Attributes (with descriptions)

- `domain_id: string`` (REQUIRED, format `D###`)
  Description: Stable identifier for the Domain element.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `parent_domain_ref: string`` (OPTIONAL; references `Domain.domain_id`)
  Description: Optional reference to a parent Domain for hierarchy.
  Notes: null

- `classification_type: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `classification_type`.
  Notes: null

### Normative Rules

- `domain_id` MUST be unique.
- `domain_id` MUST match regex `^D\\d{3}$`.
- `name` MUST NOT be empty.
- `description` MUST NOT be empty.
- If `parent_domain_ref` is present:
  - MUST reference an existing `Domain.domain_id`
  - MUST NOT self-reference

---
## 17. Element Type — DomainRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Domain` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE DomainRegister SHALL exist.
- `register_type` SHALL be `Domain`.
- `member_ids` SHALL contain ALL `Domain.domain_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Domain elements present in the ledger.

---
## 18. Element Type — Requirement

### Purpose (NORMATIVE)

- Represent a normative obligation/constraint within the ledger scope.
- Support verification, traceability, and cross-row elaboration.
- Preserve requirement statements independent of source document layout.

### Non-Purpose (NORMATIVE)

- Store findings, gaps, or suggestions (use their dedicated element types).
- Encode implementation decisions unless explicitly a constraint.

### Attributes (with descriptions)

- `requirement_id: string`` (REQUIRED, format `R###`)
  Description: Stable identifier for the Requirement element.
  Notes: null

- `statement: string`` (REQUIRED)
  Description: Normative requirement statement captured for this ledger scope.
  Notes: null

- `requirement_type: string`` (REQUIRED; Functional|Constraint|Performance|Suitability)
  Description: Classification of the requirement (e.g., Functional, Constraint, Environmental).
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `source_refs: string[]`` (REQUIRED; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `domain_refs: string[]`` (REQUIRED; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `fit_criteria: string`` (OPTIONAL)
  Description: Optional acceptance/satisfaction criteria defining how compliance is judged.
  Notes: null

- `verification_method: string`` (OPTIONAL; Test|Analysis|Inspection|Demonstration)
  Description: Optional description of how satisfaction is verified.
  Notes: null

- `priority: string`` (OPTIONAL; High|Medium|Low)
  Description: Optional importance/criticality indicator.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `requirement_id` MUST be unique.
- `requirement_id` MUST match regex `^R\\d{3}$`.
- `statement` MUST NOT be empty.
- If `fit_criteria` is present, it MUST NOT be empty.
- `requirement_type` MUST be one of the defined enumeration values.
- If `requirement_type == Performance`, `fit_criteria` SHOULD be present.
- `source_refs` MUST contain at least one entry referencing an existing `Source.source_id`.
- `domain_refs` MUST contain at least one entry referencing an existing `Domain.domain_id`.
- `confidence` MUST be within 0.0..1.0.
- A Requirement SHALL NOT restate a Constraint as a Requirement.statement.
- A Requirement SHOULD originate from a CandidateRequirement whose status == Promoted.

---
## 19. Element Type — RequirementRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Requirement` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE RequirementRegister SHALL exist.
- `register_type` SHALL be `Requirement`.
- `member_ids` SHALL contain ALL `Requirement.requirement_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Requirement elements present in the ledger.

---
## 20. Element Type — Question

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `question_id: string`` (REQUIRED, format `Q###`)
  Description: See element definition for semantic meaning of `question_id`.
  Notes: null

- `question_text: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `question_text`.
  Notes: null

- `expected_answer_format: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `expected_answer_format`.
  Notes: null

- `why_it_matters: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `why_it_matters`.
  Notes: null

- `priority: string`` (REQUIRED; High|Medium|Low)
  Description: Optional importance/criticality indicator.
  Notes: null

- `status: string`` (OPTIONAL; Open|Answered|Closed)
  Description: See element definition for semantic meaning of `status`.
  Notes: null

- `target_cells: string[]`` (OPTIONAL; references `ZachmanCell.cell_id`)
  Description: See element definition for semantic meaning of `target_cells`.
  Notes: null

- `related_gap_ids: string[]`` (REQUIRED; references `Gap.gap_id`)
  Description: See element definition for semantic meaning of `related_gap_ids`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `question_id` MUST be unique.
- `question_id` MUST match regex `^Q\\d{3}$`.
- `question_text` MUST NOT be empty.
- `why_it_matters` MUST NOT be empty.
- `priority` MUST be one of: High, Medium, Low.
- If `status` is present it MUST be one of: Open, Answered, Closed.
- `related_gap_ids` MUST contain at least one entry and each entry MUST reference an existing `Gap.gap_id`.
- If `target_cells` is present, each entry MUST reference an existing `ZachmanCell.cell_id`.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- `confidence` MUST be within 0.0..1.0.
- If `status == Answered`, then at least one `Answer` MUST exist referencing this `Question.question_id`.
- If `expected_answer_format` is present, it MUST NOT be empty.

---
## 21. Element Type — QuestionRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Question` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE QuestionRegister SHALL exist.
- `register_type` SHALL be `Question`.
- `member_ids` SHALL contain ALL `Question.question_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Question elements present in the ledger.

---
## 22. Element Type — Answer

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `answer_id: string`` (REQUIRED, format `A###`)
  Description: See element definition for semantic meaning of `answer_id`.
  Notes: null

- `question_id: string`` (REQUIRED; references `Question.question_id`)
  Description: See element definition for semantic meaning of `question_id`.
  Notes: null

- `response_text: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `response_text`.
  Notes: null

- `provided_by: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `provided_by`.
  Notes: null

- `provided_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `provided_utc`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `answer_id` MUST be unique.
- `answer_id` MUST match regex `^A\\d{3}$`.
- `question_id` MUST reference an existing `Question.question_id`.
- `response_text` MUST NOT be empty.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 23. Element Type — AnswerRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Answer` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE AnswerRegister SHALL exist.
- `register_type` SHALL be `Answer`.
- `member_ids` SHALL contain ALL `Answer.answer_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Answer elements present in the ledger.

---
## 24. Element Type — Assumption

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `assumption_id: string`` (REQUIRED, format `AS###`)
  Description: See element definition for semantic meaning of `assumption_id`.
  Notes: null

- `statement: string`` (REQUIRED)
  Description: Normative requirement statement captured for this ledger scope.
  Notes: null

- `scope: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `scope`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `assumption_id` MUST be unique.
- `assumption_id` MUST match regex `^AS\\d{3}$`.
- `statement` MUST NOT be empty.
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 25. Element Type — Constraint

### Purpose (NORMATIVE)

- Represent a limitation or restriction that bounds solution/design space.
- Support compliance and impact analysis as an explicit governing condition.

### Attributes (with descriptions)

- `constraint_id: string`` (REQUIRED, format `C###`)
  Description: Stable identifier for the Constraint element.
  Notes: null

- `statement: string`` (REQUIRED)
  Description: Normative requirement statement captured for this ledger scope.
  Notes: null

- `constraint_type: string`` (REQUIRED; Design|Technical|Regulatory|Environmental)
  Description: Classification of constraint nature.
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `source_refs: string[]`` (REQUIRED; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `domain_refs: string[]`` (REQUIRED; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `affected_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `affected_element_ids`.
  Notes: null

- `priority: string`` (OPTIONAL; High|Medium|Low)
  Description: Optional importance/criticality indicator.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `constraint_id` MUST be unique.
- `constraint_id` MUST match regex `^C\\d{3}$`.
- `statement` MUST NOT be empty.
- `constraint_type` MUST be one of:
  Design | Technical | Regulatory | Environmental
- `source_refs` MUST contain at least one entry referencing an existing `Source.source_id`.
- `domain_refs` MUST contain at least one entry referencing an existing `Domain.domain_id`.
- If `affected_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- `confidence` MUST be within 0.0..1.0.

---
## 26. Element Type — ConstraintRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Constraint` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE ConstraintRegister SHALL exist.
- `register_type` SHALL be `Constraint`.
- `member_ids` SHALL contain ALL `Constraint.constraint_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Constraint elements present in the ledger.

---
## 27. Element Type — AssumptionRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Assumption` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE AssumptionRegister SHALL exist.
- `register_type` SHALL be `Assumption`.
- `member_ids` SHALL contain ALL `Assumption.assumption_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Assumption elements present in the ledger.

---
## 28. Element Type — Risk

### Purpose (NORMATIVE)

- Represent a potential adverse condition or uncertainty affecting objectives.
- Support mitigation, monitoring, and governance workflows.

### Attributes (with descriptions)

- `risk_id: string`` (REQUIRED, format `K###`)
  Description: Stable identifier for the Risk element.
  Notes: null

- `title: string`` (REQUIRED)
  Description: Short title/label.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `category: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `category`.
  Notes: null

- `likelihood: string`` (REQUIRED; High|Medium|Low)
  Description: Indicator of probability/likelihood.
  Notes: null

- `impact: string`` (REQUIRED; High|Medium|Low)
  Description: Indicator of consequence/severity.
  Notes: null

- `exposure: string`` (OPTIONAL; High|Medium|Low)
  Description: See element definition for semantic meaning of `exposure`.
  Notes: null

- `mitigation: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `mitigation`.
  Notes: null

- `owner: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `owner`.
  Notes: null

- `status: string`` (REQUIRED; Active|Mitigated|Accepted|Closed)
  Description: See element definition for semantic meaning of `status`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `domain_refs: string[]`` (OPTIONAL; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `risk_id` MUST be unique.
- `risk_id` MUST match regex `^K\\d{3}$`.
- `title` MUST NOT be empty.
- `description` MUST NOT be empty.
- `likelihood` MUST be one of: High, Medium, Low.
- `impact` MUST be one of: High, Medium, Low.
- If `exposure` is present, it MUST be one of: High, Medium, Low.
- If `status` is present, it MUST be one of: Active, Mitigated, Accepted, Closed.
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- If `domain_refs` is present, each entry MUST reference an existing `Domain.domain_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 29. Element Type — ActiveRiskRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `ActiveRisk` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE ActiveRiskRegister SHALL exist.
- `register_type` SHALL be `Risk`.
- `member_ids` SHALL contain ALL `Risk.risk_id` values where `Risk.status == Active`.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Risk elements whose status is Active in the ledger.

---
## 30. Element Type — Issue

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `issue_id: string`` (REQUIRED, format `I###`)
  Description: See element definition for semantic meaning of `issue_id`.
  Notes: null

- `title: string`` (REQUIRED)
  Description: Short title/label.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `severity: string`` (REQUIRED; High|Medium|Low)
  Description: Impact/criticality classification.
  Notes: null

- `status: string`` (REQUIRED; Open|InProgress|Resolved|Closed)
  Description: See element definition for semantic meaning of `status`.
  Notes: null

- `resolution_summary: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `resolution_summary`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `domain_refs: string[]`` (OPTIONAL; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `owner: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `owner`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `issue_id` MUST be unique.
- `issue_id` MUST match regex `^I\\d{3}$`.
- `title` MUST NOT be empty.
- `description` MUST NOT be empty.
- `severity` MUST be one of: High, Medium, Low.
- `status` MUST be one of:
  Open | InProgress | Resolved | Closed
- If `resolution_summary` is present, it MUST NOT be empty.
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- If `domain_refs` is present, each entry MUST reference an existing `Domain.domain_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 31. Element Type — IssueRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Issue` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE IssueRegister SHALL exist.
- `register_type` SHALL be `Issue`.
- `member_ids` SHALL contain ALL `Issue.issue_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Issue elements present in the ledger.

---
## 32. Element Type — CandidateRequirement

### Purpose (NORMATIVE)

- Record a proposed requirement not yet validated or baselined.
- Support refinement prior to promotion to Requirement.
- Preserve traceability for requirement evolution and governance.

### Attributes (with descriptions)

- `candidate_requirement_id: string`` (REQUIRED, format `CR###`)
  Description: Stable identifier for the CandidateRequirement element.
  Notes: null

- `statement: string`` (REQUIRED)
  Description: Normative requirement statement captured for this ledger scope.
  Notes: null

- `requirement_type: string`` (REQUIRED; Functional|Constraint|Performance|Suitability)
  Description: Classification of the requirement (e.g., Functional, Constraint, Environmental).
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `source_refs: string[]`` (REQUIRED; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `domain_refs: string[]`` (REQUIRED; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `fit_criteria: string`` (OPTIONAL)
  Description: Optional acceptance/satisfaction criteria defining how compliance is judged.
  Notes: null

- `status: string`` (REQUIRED; Proposed|Accepted|Rejected|Promoted)
  Description: See element definition for semantic meaning of `status`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `candidate_requirement_id` MUST be unique.
- `candidate_requirement_id` MUST match regex `^CR\\d{3}$`.
- `statement` MUST NOT be empty.
- `requirement_type` MUST be one of:
  Functional | Constraint | Performance | Suitability
- `source_refs` MUST contain at least one entry referencing an existing `Source.source_id`.
- `domain_refs` MUST contain at least one entry referencing an existing `Domain.domain_id`.
- `status` MUST be one of:
  Proposed | Accepted | Rejected | Promoted
- If `fit_criteria` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

---
## 33. Element Type — CandidateRequirementRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `CandidateRequirement` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE CandidateRequirementRegister SHALL exist.
- `register_type` SHALL be `CandidateRequirement`.
- `member_ids` SHALL contain ALL `CandidateRequirement.candidate_requirement_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL CandidateRequirement elements present in the ledger.

---
## 34. Element Type — Suggestion

### Purpose (NORMATIVE)

- Record a proposed improvement or corrective action derived from analysis.
- Support mitigation and refinement workflows without asserting obligations.
- Preserve advisory outputs separately from Requirements.

### Attributes (with descriptions)

- `suggestion_id: string`` (REQUIRED, format `SUG###`)
  Description: Stable identifier for the Suggestion element.
  Notes: null

- `type: string`` (REQUIRED)
  Description: Classification of the finding/observation category.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `priority: string`` (REQUIRED; High|Medium|Low)
  Description: Optional importance/criticality indicator.
  Notes: null

- `target_element_ids: string[]`` (REQUIRED; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `target_element_ids`.
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `produced_by_pass_id: string`` (OPTIONAL; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `produced_from_finding_ids: string[]`` (OPTIONAL; references `Finding.finding_id`)
  Description: See element definition for semantic meaning of `produced_from_finding_ids`.
  Notes: null

- `produced_from_gap_ids: string[]`` (OPTIONAL; references `Gap.gap_id`)
  Description: See element definition for semantic meaning of `produced_from_gap_ids`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `suggestion_id` MUST be unique.
- `suggestion_id` MUST match regex `^SUG\\d{3}$`.
- `type` MUST NOT be empty.
- `description` MUST NOT be empty.
- `priority` MUST be one of: High, Medium, Low.
- `target_element_ids` MUST contain at least one entry and each entry MUST reference a valid ledger element identifier.
- If `rationale` is present, it MUST NOT be empty.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- If `produced_by_pass_id` is present, it MUST reference an existing `AnalysisPass.pass_id`.
- `confidence` MUST be within 0.0..1.0.
- If `produced_from_finding_ids` is present, it MUST contain at least one entry and each entry MUST reference an existing `Finding.finding_id`.
- If `produced_from_gap_ids` is present, it MUST contain at least one entry and each entry MUST reference an existing `Gap.gap_id`.

- Provenance constraint (Analytical Output Only):
  At least ONE of the following MUST be provided:
  - `produced_by_pass_id`
  - `produced_from_finding_ids`
  - `produced_from_gap_ids`

- A Suggestion SHALL NOT be introduced without at least one analytical provenance anchor.


---
## 35. Element Type — SuggestionRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Suggestion` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE SuggestionRegister SHALL exist.
- `register_type` SHALL be `Suggestion`.
- `member_ids` SHALL contain ALL `Suggestion.suggestion_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Suggestion elements present in the ledger.

---
## 36. Element Type — CoverageItem

### Purpose (NORMATIVE)

- Record an assessment of completeness/alignment/sufficiency for a defined scope.
- Support robustness tracking and gap discovery.
- Preserve coverage outcomes independently of Findings and Gaps.

### Attributes (with descriptions)

- `coverage_id: string`` (REQUIRED, format `CV###`)
  Description: Stable identifier for the Coverage element.
  Notes: null

- `coverage_type: string`` (REQUIRED; Cell|Domain|Requirement)
  Description: Classification of the coverage dimension assessed.
  Notes: null

- `target_id: string`` (REQUIRED; references a valid ledger element identifier)
  Description: See element definition for semantic meaning of `target_id`.
  Notes: null

- `coverage_state: string`` (REQUIRED; Covered|PartiallyCovered|NotCovered|Unknown)
  Description: See element definition for semantic meaning of `coverage_state`.
  Notes: null

- `evidence_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `evidence_ids`.
  Notes: null

- `produced_by_pass_id: string`` (REQUIRED; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `notes: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `notes`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `coverage_id` MUST be unique.
- `coverage_id` MUST match regex `^CV\\d{3}$`.
- `coverage_type` MUST be one of: Cell, Domain, Requirement.
- `target_id` MUST reference an existing ledger element identifier.
- `coverage_state` MUST be one of:
  Covered | PartiallyCovered | NotCovered | Unknown
- If `evidence_ids` is present, each entry MUST reference a valid ledger element identifier.
- `produced_by_pass_id` MUST reference an existing `AnalysisPass.pass_id`.
- If `notes` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

- Target typing constraint:
  - If `coverage_type == Cell`, `target_id` MUST reference `ZachmanCell.cell_id`.
  - If `coverage_type == Domain`, `target_id` MUST reference `Domain.domain_id`.
  - If `coverage_type == Requirement`, `target_id` MUST reference `Requirement.requirement_id` OR `CandidateRequirement.candidate_requirement_id`.

---
## 37. Element Type — CoverageRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Coverage` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE CoverageRegister SHALL exist.
- `register_type` SHALL be `CoverageItem`.
- `member_ids` SHALL contain ALL `CoverageItem.coverage_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL CoverageItem elements present in the ledger.

---
## 38. Element Type — Rule

### Purpose (NORMATIVE)

- Define a declarative evaluation/validation criterion used during analysis.
- Support repeatable and auditable assessments.
- Provide traceability for Findings/Evaluations triggered by this criterion.

### Attributes (with descriptions)

- `rule_id: string`` (REQUIRED, format `RL###`)
  Description: Stable identifier for the Rule element.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `rule_type: string`` (REQUIRED; Quality|Coverage|Consistency|Governance)
  Description: Classification of rule nature.
  Notes: null

- `severity_default: string`` (OPTIONAL; High|Medium|Low)
  Description: See element definition for semantic meaning of `severity_default`.
  Notes: null

- `applies_to_element_types: string[]`` (REQUIRED)
  Description: See element definition for semantic meaning of `applies_to_element_types`.
  Notes: null

- `version: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `version`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `rule_id` MUST be unique.
- `rule_id` MUST match regex `^RL\\d{3}$`.
- `name` MUST NOT be empty.
- `description` MUST NOT be empty.
- `rule_type` MUST be one of: Quality, Coverage, Consistency, Governance.
- If `severity_default` is present, it MUST be one of: High, Medium, Low.
- `applies_to_element_types` MUST contain at least one entry and each entry MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

---
## 39. Element Type — Checklist

### Purpose (NORMATIVE)

- Define a structured set of review/verification items used to guide evaluations.
- Standardise repeatable review activities and auditability.

### Attributes (with descriptions)

- `checklist_id: string`` (REQUIRED, format `CL###`)
  Description: Stable identifier for the Checklist element.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `rule_ids: string[]`` (REQUIRED; references `Rule.rule_id`)
  Description: Optional list of Rules applied by this pass.
  Notes: null

- `version: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `version`.
  Notes: null

### Normative Rules

- `checklist_id` MUST be unique.
- `checklist_id` MUST match regex `^CL\\d{3}$`.
- `name` MUST NOT be empty.
- `description` MUST NOT be empty.
- `rule_ids` MUST contain at least one entry and each entry MUST reference an existing `Rule.rule_id`.

---
## 40. Element Type — Evaluation

### Purpose (NORMATIVE)

- Record the outcome of a structured assessment applied to ledger elements.
- Support repeatable verification/scoring and auditability.
- Provide attribution to rules/checklists and analysis passes.

### Attributes (with descriptions)

- `evaluation_id: string`` (REQUIRED, format `EV###`)
  Description: Stable identifier for the Evaluation element.
  Notes: null

- `evaluation_type: string`` (REQUIRED)
  Description: Classification of the evaluation activity.
  Notes: null

- `scope_description: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `scope_description`.
  Notes: null

- `checklist_ids: string[]`` (OPTIONAL; references `Checklist.checklist_id`)
  Description: Optional list of Checklists applied by this pass.
  Notes: null

- `rule_ids: string[]`` (OPTIONAL; references `Rule.rule_id`)
  Description: Optional list of Rules applied by this pass.
  Notes: null

- `produced_finding_ids: string[]`` (OPTIONAL; references `Finding.finding_id`)
  Description: Optional list of Findings produced by this pass.
  Notes: null

- `produced_gap_ids: string[]`` (OPTIONAL; references `Gap.gap_id`)
  Description: Optional list of Gaps produced by this pass.
  Notes: null

- `produced_suggestion_ids: string[]`` (OPTIONAL; references `Suggestion.suggestion_id`)
  Description: Optional list of Suggestions produced by this pass.
  Notes: null

- `produced_coverage_ids: string[]`` (OPTIONAL; references `CoverageItem.coverage_id`)
  Description: Optional list of Coverage items produced by this pass.
  Notes: null

- `produced_issue_ids: string[]`` (OPTIONAL; references `Issue.issue_id`)
  Description: See element definition for semantic meaning of `produced_issue_ids`.
  Notes: null

- `produced_risk_ids: string[]`` (OPTIONAL; references `Risk.risk_id`)
  Description: See element definition for semantic meaning of `produced_risk_ids`.
  Notes: null

- `produced_trace_ids: string[]`` (OPTIONAL; references `Trace.trace_id`)
  Description: See element definition for semantic meaning of `produced_trace_ids`.
  Notes: null

- `produced_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `produced_utc`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `evaluation_id` MUST be unique.
- `evaluation_id` MUST match regex `^EV\\d{3}$`.
- `evaluation_type` MUST NOT be empty.
- `scope_description` MUST NOT be empty.
- Provenance constraint:
  - At least one of `checklist_ids` or `rule_ids` MUST be provided.
- If `checklist_ids` is present, each entry MUST reference an existing `Checklist.checklist_id`.
- If `rule_ids` is present, each entry MUST reference an existing `Rule.rule_id`.
- For each produced_* list that is present:
  - MUST contain at least one entry
  - each entry MUST reference the corresponding element identifier.
- `confidence` MUST be within 0.0..1.0.

---
## 41. Element Type — EvaluationRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Evaluation` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE EvaluationRegister SHALL exist.
- `register_type` SHALL be `Evaluation`.
- `member_ids` SHALL contain ALL `Evaluation.evaluation_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Evaluation elements present in the ledger.

---
## 42. Element Type — Segment

### Purpose (NORMATIVE) 
A `Segment` element represents a **coarse-grained, contiguous block** of an immutable input artefact that is useful as a segmentation boundary for analysis, such as:
- a paragraph,
- a bullet block,
- a table row-group or section block.

A Segment exists to:
- provide stable, human-reviewable segmentation boundaries,
- group related `Source` excerpts under a common contextual boundary,
- support deterministic review of which input blocks were considered relevant.

### Non-Purpose (NORMATIVE) — Clarify
A Segment SHALL NOT be interpreted as a fine-grained provenance anchor intended for sentence-level traceability. Sentence/statement-level provenance anchors belong to `Source` (and optionally `SourceAtom` when used).

### Attributes (with descriptions)

- `segment_id: string`` (REQUIRED, format `SEG###`)
  Description: Stable identifier for the Segment element.
  Notes: null

- `title: string`` (REQUIRED)
  Description: Short title/label.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `source_refs: string[]`` (REQUIRED; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `parent_segment_ref: string`` (OPTIONAL; references `Segment.segment_id`)
  Description: See element definition for semantic meaning of `parent_segment_ref`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules
- `segment_id` MUST be unique.
- `segment_id` MUST match regex `^SEG\\d{3}$`.
- `title` MUST NOT be empty.
- `source_refs` MUST contain at least one entry and each entry MUST reference an existing `Source.source_id`.
- If `description` is present, it MUST NOT be empty.
- If `parent_segment_ref` is present:
  - MUST reference an existing `Segment.segment_id`
  - MUST NOT self-reference
- `confidence` MUST be within 0.0..1.0.
- A Segment MAY be represented either by:
  - (a) its own descriptive metadata and references to `Source` elements (`source_refs`), or
  - (b) additional verbatim storage if and only if such an attribute exists in the governing schema.
- A Segment is conformant even if it references **no SourceAtoms** directly (Segments do not enumerate atoms).

---
## 43. Element Type — SourceAtom

### Purpose (NORMATIVE) — Replace / Clarify
A `SourceAtom` element represents an **OPTIONAL, fine-grained** verbatim fragment derived from a `Source` excerpt, intended only where sub-source granularity is required.

SourceAtom exists to:
- enable sub-sentence (or sub-row) provenance anchors where necessary,
- support highly precise traceability in advanced use cases.

### Non-Purpose (NORMATIVE)

- Store paraphrases, summaries, or inferred interpretations.
- Act as a document catalogue entry without excerpt text.
- Store derived outputs such as requirements, findings, gaps, or decisions.
- A SourceAtom SHALL NOT be treated as mandatory for ledger conformance.

### Attributes (with descriptions)

- `atom_id: string`` (REQUIRED, format `SA###`)
  Description: Stable identifier for the SourceAtom element.
  Notes: null

- `atom_text: string`` (REQUIRED)
  Description: Verbatim atomic fragment representing a fine-grained source statement.
  Notes: null

- `source_ref: string`` (REQUIRED; references `Source.source_id`)
  Description: Reference to the parent Source element providing provenance for this atom.
  Notes: null

- `segment_ref: string`` (OPTIONAL; references `Segment.segment_id`)
  Description: Reference to the Segment context in which this atom is scoped.
  Notes: null

- `parent_atom_ref: string`` (OPTIONAL; references `SourceAtom.atom_id`)
  Description: Optional reference to a broader SourceAtom in an atom hierarchy.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `atom_id` MUST be unique.
- `atom_id` MUST match regex `^SA\\d{3}$`.
- `atom_text` MUST NOT be empty.
- `source_ref` MUST reference an existing `Source.source_id`.
- If `segment_ref` is present, it MUST reference an existing `Segment.segment_id`.
- If `parent_atom_ref` is present:
  - MUST reference an existing `SourceAtom.atom_id`
  - MUST NOT self-reference
- `confidence` MUST be within 0.0..1.0.

---
## 44. Element Type — SourceAtomRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `SourceAtom` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.
- A `SourceAtomRegister` is OPTIONAL.
- If no SourceAtom elements exist in a ledger instance, a SourceAtomRegister MAY be omitted.
- If one or more SourceAtom elements exist, a SourceAtomRegister MUST exist and enumerate all SourceAtom identifiers.

### Non-Purpose (NORMATIVE)

- Store paraphrases, summaries, or inferred interpretations.
- Act as a document catalogue entry without excerpt text.
- Store derived outputs such as requirements, findings, gaps, or decisions.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE SourceAtomRegister SHALL exist.
- `register_type` SHALL be `SourceAtom`.
- `member_ids` SHALL contain ALL `SourceAtom.atom_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL SourceAtom elements present in the ledger.

---
## 45. Element Type — SegmentRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Segment` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE SegmentRegister SHALL exist.
- `register_type` SHALL be `Segment`.
- `member_ids` SHALL contain ALL `Segment.segment_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Segment elements present in the ledger.

---
## 46. Element Type — ConcernCategory

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `concern_category_id: string`` (REQUIRED, format `CC###`)
  Description: See element definition for semantic meaning of `concern_category_id`.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

### Normative Rules

- `concern_category_id` MUST be unique.
- `concern_category_id` MUST match regex `^CC\\d{3}$`.
- `name` MUST NOT be empty.
- If `description` is present, it MUST NOT be empty.

---
## 47. Element Type — Concern

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `concern_id: string`` (REQUIRED, format `CN###`)
  Description: See element definition for semantic meaning of `concern_id`.
  Notes: null

- `title: string`` (REQUIRED)
  Description: Short title/label.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `category_refs: string[]`` (OPTIONAL; references `ConcernCategory.concern_category_id`)
  Description: See element definition for semantic meaning of `category_refs`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `source_refs: string[]`` (OPTIONAL; references `Source.source_id`)
  Description: Provenance anchors supporting this element via Source identifiers.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `concern_id` MUST be unique.
- `concern_id` MUST match regex `^CN\\d{3}$`.
- `title` MUST NOT be empty.
- `description` MUST NOT be empty.
- If `category_refs` is present, each entry MUST reference an existing `ConcernCategory.concern_category_id`.
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- If `source_refs` is present, each entry MUST reference an existing `Source.source_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 48. Element Type — ConcernRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Concern` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE ConcernRegister SHALL exist.
- `register_type` SHALL be `Concern`.
- `member_ids` SHALL contain ALL `Concern.concern_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Concern elements present in the ledger.

---
## 49. Element Type — Baseline

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `baseline_id: string`` (REQUIRED, format `B###`)
  Description: See element definition for semantic meaning of `baseline_id`.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `created_utc: datetime`` (REQUIRED)
  Description: See element definition for semantic meaning of `created_utc`.
  Notes: null

- `source_ledger_id: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `source_ledger_id`.
  Notes: null

- `scope_description: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `scope_description`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `baseline_id` MUST be unique.
- `baseline_id` MUST match regex `^B\\d{3}$`.
- `name` MUST NOT be empty.
- `created_utc` MUST be present.
- `source_ledger_id` MUST NOT be empty.
- If `description` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

---
## 50. Element Type — ArtefactState

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `state_id: string`` (REQUIRED, format `ST###`)
  Description: See element definition for semantic meaning of `state_id`.
  Notes: null

- `element_id: string`` (REQUIRED; references valid ledger element identifier)
  Description: See element definition for semantic meaning of `element_id`.
  Notes: null

- `state: string`` (REQUIRED; Draft|Active|Superseded|Deprecated)
  Description: See element definition for semantic meaning of `state`.
  Notes: null

- `effective_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `effective_utc`.
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `state_id` MUST be unique.
- `state_id` MUST match regex `^ST\\d{3}$`.
- `element_id` MUST reference a valid ledger element identifier.
- `state` MUST be one of:
  Draft | Active | Superseded | Deprecated
- If `rationale` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

---
## 51. Element Type — ChangeRecord

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `change_id: string`` (REQUIRED, format `CH###`)
  Description: See element definition for semantic meaning of `change_id`.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `changed_element_ids: string[]`` (REQUIRED)
  Description: See element definition for semantic meaning of `changed_element_ids`.
  Notes: null

- `change_type: string`` (REQUIRED; Addition|Modification|Removal|Correction)
  Description: See element definition for semantic meaning of `change_type`.
  Notes: null

- `performed_by: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `performed_by`.
  Notes: null

- `performed_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `performed_utc`.
  Notes: null

- `related_decision_id: string`` (OPTIONAL; references `Decision.decision_id`)
  Description: See element definition for semantic meaning of `related_decision_id`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `change_id` MUST be unique.
- `change_id` MUST match regex `^CH\\d{3}$`.
- `description` MUST NOT be empty.
- `changed_element_ids` MUST contain at least one entry and each entry MUST reference a valid ledger element identifier.
- `change_type` MUST be one of:
  Addition | Modification | Removal | Correction
- If `related_decision_id` is present, it MUST reference an existing `Decision.decision_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 52. Element Type — Decision

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `decision_id: string`` (REQUIRED, format `DCS###`)
  Description: See element definition for semantic meaning of `decision_id`.
  Notes: null

- `title: string`` (REQUIRED)
  Description: Short title/label.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `decision_type: string`` (OPTIONAL; Architectural|Modelling|Governance|Risk|Requirement)
  Description: See element definition for semantic meaning of `decision_type`.
  Notes: null

- `status: string`` (REQUIRED; Proposed|Accepted|Rejected|Superseded)
  Description: See element definition for semantic meaning of `status`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `rationale: string`` (OPTIONAL)
  Description: Optional justification explaining why the requirement exists.
  Notes: null

- `decided_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `decided_utc`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `decision_id` MUST be unique.
- `decision_id` MUST match regex `^DCS\\d{3}$`.
- `title` MUST NOT be empty.
- `description` MUST NOT be empty.
- `status` MUST be one of:
  Proposed | Accepted | Rejected | Superseded
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- If `rationale` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

---
## 53. Element Type — DecisionRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Decision` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE DecisionRegister SHALL exist.
- `register_type` SHALL be `Decision`.
- `member_ids` SHALL contain ALL `Decision.decision_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Decision elements present in the ledger.

---
## 54. Element Type — Violation

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `violation_id: string`` (REQUIRED, format `V###`)
  Description: See element definition for semantic meaning of `violation_id`.
  Notes: null

- `rule_id: string`` (OPTIONAL; references `Rule.rule_id`)
  Description: Stable identifier for the Rule element.
  Notes: null

- `checklist_id: string`` (OPTIONAL; references `Checklist.checklist_id`)
  Description: Stable identifier for the Checklist element.
  Notes: null

- `description: string`` (REQUIRED)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `severity: string`` (REQUIRED; High|Medium|Low)
  Description: Impact/criticality classification.
  Notes: null

- `related_element_ids: string[]`` (REQUIRED; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `evidence_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `evidence_ids`.
  Notes: null

- `produced_by_evaluation_id: string`` (OPTIONAL; references `Evaluation.evaluation_id`)
  Description: See element definition for semantic meaning of `produced_by_evaluation_id`.
  Notes: null

- `produced_by_pass_id: string`` (OPTIONAL; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `violation_id` MUST be unique.
- `violation_id` MUST match regex `^V\\d{3}$`.
- `description` MUST NOT be empty.
- `severity` MUST be one of: High, Medium, Low.
- `related_element_ids` MUST contain at least one entry and each entry MUST reference a valid ledger element identifier.
- If `evidence_ids` is present, each entry MUST reference a valid ledger element identifier.
- Provenance constraint:
  - At least one of `rule_id` or `checklist_id` MUST be provided.
- If `rule_id` is present, it MUST reference an existing `Rule.rule_id`.
- If `checklist_id` is present, it MUST reference an existing `Checklist.checklist_id`.
- Analytical output constraint:
  - At least one of `produced_by_evaluation_id` or `produced_by_pass_id` MUST be provided.
- If `produced_by_evaluation_id` is present, it MUST reference an existing `Evaluation.evaluation_id`.
- If `produced_by_pass_id` is present, it MUST reference an existing `AnalysisPass.pass_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 55. Element Type — ViolationRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Violation` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE ViolationRegister SHALL exist.
- `register_type` SHALL be `Violation`.
- `member_ids` SHALL contain ALL `Violation.violation_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Violation elements present in the ledger.

---
## 56. Element Type — ClosureMatrix

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `closure_id: string`` (REQUIRED, format `CM###`)
  Description: See element definition for semantic meaning of `closure_id`.
  Notes: null

- `closure_type: string`` (REQUIRED; Gap|Question|Finding|Coverage)
  Description: See element definition for semantic meaning of `closure_type`.
  Notes: null

- `target_ids: string[]`` (REQUIRED; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `target_ids`.
  Notes: null

- `closure_state: string`` (REQUIRED; Open|Accepted|Mitigated|Closed)
  Description: Lifecycle state of the gap (e.g., Open, Accepted, Mitigated, Closed).
  Notes: null

- `closure_rationale: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `closure_rationale`.
  Notes: null

- `approved_by: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `approved_by`.
  Notes: null

- `approved_utc: datetime`` (OPTIONAL)
  Description: See element definition for semantic meaning of `approved_utc`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `closure_id` MUST be unique.
- `closure_id` MUST match regex `^CM\\d{3}$`.
- `closure_type` MUST be one of: Gap, Question, Finding, Coverage.
- `target_ids` MUST contain at least one entry and each entry MUST reference a valid ledger element identifier.
- `closure_state` MUST be one of: Open, Accepted, Mitigated, Closed.
- If `closure_rationale` is present, it MUST NOT be empty.
- `confidence` MUST be within 0.0..1.0.

- Target typing constraint:
  - If `closure_type == Gap`, each `target_id` MUST reference `Gap.gap_id`.
  - If `closure_type == Question`, each `target_id` MUST reference `Question.question_id`.
  - If `closure_type == Finding`, each `target_id` MUST reference `Finding.finding_id`.
  - If `closure_type == Coverage`, each `target_id` MUST reference `CoverageItem.coverage_id`.

---
## 57. Element Type — StructuralRepresentation

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `structure_id: string`` (REQUIRED, format `SR###`)
  Description: See element definition for semantic meaning of `structure_id`.
  Notes: null

- `structure_type: string`` (REQUIRED; Diagram|Model|Schema)
  Description: See element definition for semantic meaning of `structure_type`.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `representation_format: string`` (REQUIRED; Mermaid|PlantUML|JSON|Text)
  Description: See element definition for semantic meaning of `representation_format`.
  Notes: null

- `representation_text: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `representation_text`.
  Notes: null

- `derived_from_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `derived_from_element_ids`.
  Notes: null

- `produced_by_pass_id: string`` (OPTIONAL; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `produced_by_evaluation_id: string`` (OPTIONAL; references `Evaluation.evaluation_id`)
  Description: See element definition for semantic meaning of `produced_by_evaluation_id`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `structure_id` MUST be unique.
- `structure_id` MUST match regex `^SR\\d{3}$`.
- `structure_type` MUST be one of: Diagram, Model, Schema.
- `representation_format` MUST be one of: Mermaid, PlantUML, JSON, Text.
- `representation_text` MUST NOT be empty.
- If `description` is present, it MUST NOT be empty.
- If `derived_from_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- Analytical output constraint:
  - At least one of `produced_by_pass_id` or `produced_by_evaluation_id` MUST be provided.
- If `produced_by_pass_id` is present, it MUST reference an existing `AnalysisPass.pass_id`.
- If `produced_by_evaluation_id` is present, it MUST reference an existing `Evaluation.evaluation_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 58. Element Type — StructuralRepresentationRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `StructuralRepresentation` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE StructuralRepresentationRegister SHALL exist.
- `register_type` SHALL be `StructuralRepresentation`.
- `member_ids` SHALL contain ALL `StructuralRepresentation.structure_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL StructuralRepresentation elements present in the ledger.

---
## 59. Element Type — Stakeholder

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `stakeholder_id: string`` (REQUIRED, format `SH###`)
  Description: See element definition for semantic meaning of `stakeholder_id`.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `role: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `role`.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `concern_refs: string[]`` (OPTIONAL; references `Concern.concern_id`)
  Description: See element definition for semantic meaning of `concern_refs`.
  Notes: null

- `domain_refs: string[]`` (OPTIONAL; references `Domain.domain_id`)
  Description: Optional domain classification references relevant to this element.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `stakeholder_id` MUST be unique.
- `stakeholder_id` MUST match regex `^SH\\d{3}$`.
- `name` MUST NOT be empty.
- If `description` is present, it MUST NOT be empty.
- If `concern_refs` is present, each entry MUST reference an existing `Concern.concern_id`.
- If `domain_refs` is present, each entry MUST reference an existing `Domain.domain_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 60. Element Type — StakeholderRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Stakeholder` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE StakeholderRegister SHALL exist.
- `register_type` SHALL be `Stakeholder`.
- `member_ids` SHALL contain ALL `Stakeholder.stakeholder_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Stakeholder elements present in the ledger.

---
## 61. Element Type — NarrativeSummary

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `summary_id: string`` (REQUIRED, format `NS###`)
  Description: See element definition for semantic meaning of `summary_id`.
  Notes: null

- `viewpoint: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `viewpoint`.
  Notes: null

- `scope_description: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `scope_description`.
  Notes: null

- `summary_text: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `summary_text`.
  Notes: null

- `related_element_ids: string[]`` (OPTIONAL; references valid ledger element identifiers)
  Description: See element definition for semantic meaning of `related_element_ids`.
  Notes: null

- `produced_by_pass_id: string`` (OPTIONAL; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this element.
  Notes: null

- `produced_by_evaluation_id: string`` (OPTIONAL; references `Evaluation.evaluation_id`)
  Description: See element definition for semantic meaning of `produced_by_evaluation_id`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `summary_id` MUST be unique.
- `summary_id` MUST match regex `^NS\\d{3}$`.
- `viewpoint` MUST NOT be empty.
- `scope_description` MUST NOT be empty.
- `summary_text` MUST NOT be empty.
- If `related_element_ids` is present, each entry MUST reference a valid ledger element identifier.
- Analytical output constraint:
  - At least one of `produced_by_pass_id` or `produced_by_evaluation_id` MUST be provided.
- If `produced_by_pass_id` is present, it MUST reference an existing `AnalysisPass.pass_id`.
- If `produced_by_evaluation_id` is present, it MUST reference an existing `Evaluation.evaluation_id`.
- `confidence` MUST be within 0.0..1.0.

---
## 62. Element Type — NarrativeSummaryRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `NarrativeSummary` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE NarrativeSummaryRegister SHALL exist.
- `register_type` SHALL be `NarrativeSummary`.
- `member_ids` SHALL contain ALL `NarrativeSummary.summary_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL NarrativeSummary elements present in the ledger.

---
## 63. Element Type — ControlArtefact

### Purpose (NORMATIVE)

- Represent a defined ledger element type within the SysEngage canonical ledger.
- Support traceability, auditability, and deterministic viewpoints.

### Attributes (with descriptions)

- `control_id: string`` (REQUIRED, format `CA###`)
  Description: See element definition for semantic meaning of `control_id`.
  Notes: null

- `control_type: string`` (REQUIRED; Config|ProjectionRule|ParameterSet|RunProfile)
  Description: See element definition for semantic meaning of `control_type`.
  Notes: null

- `name: string`` (REQUIRED)
  Description: Short label/name for this element.
  Notes: null

- `description: string`` (OPTIONAL)
  Description: Human-readable statement describing the element’s content/meaning.
  Notes: null

- `payload_format: string`` (REQUIRED; JSON|YAML|Text)
  Description: See element definition for semantic meaning of `payload_format`.
  Notes: null

- `payload_text: string`` (REQUIRED)
  Description: See element definition for semantic meaning of `payload_text`.
  Notes: null

- `applies_to: string[]`` (OPTIONAL; element types or ledger scopes)
  Description: Element types or objects governed by this rule/checklist.
  Notes: null

- `version: string`` (OPTIONAL)
  Description: See element definition for semantic meaning of `version`.
  Notes: null

- `confidence: number`` (REQUIRED, 0.0..1.0)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `control_id` MUST be unique.
- `control_id` MUST match regex `^CA\\d{3}$`.
- `control_type` MUST be one of:
  Config | ProjectionRule | ParameterSet | RunProfile
- `name` MUST NOT be empty.
- `payload_format` MUST be one of: JSON, YAML, Text.
- `payload_text` MUST NOT be empty.
- If `description` is present, it MUST NOT be empty.
- If `applies_to` is present, it MUST contain at least one non-empty entry.
- `confidence` MUST be within 0.0..1.0.

---
## 64. Element Type — ControlArtefactRegister

**Specialisation of:** `Register`  

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `ControlArtefact` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules
- Exactly ONE ControlArtefactRegister SHALL exist.
- `register_type` SHALL be `ControlArtefact`.
- `member_ids` SHALL contain ALL `ControlArtefact.control_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL ControlArtefact elements present in the ledger.

# LEDGER PATCH — Add Signal Element (NEW)

> Insert these two Element Type definitions into the ledger specification at the appropriate location.
> Adjust section numbering to match your document’s sequence (the content below should be pasted verbatim).

---

## 65. Element Type — Signal

### Purpose (NORMATIVE)

- Represent a discrete, typed **evidence cue** detected in a Source (or SourceAtom) during analysis.
- Provide an auditable intermediate layer between verbatim provenance (Source/SourceAtom) and derived artefacts (e.g., Intent, Requirement, Finding, Gap, Question).
- Enable deterministic re-use of detected cues across later passes without re-interpreting raw text differently per run.

### Non-Purpose (NORMATIVE)

- Replace `Source` as the primary verbatim provenance anchor.
- Represent evaluation outcomes (use `Finding`) or deficiencies requiring closure (use `Gap` / `Question`).
- Store rewritten/paraphrased text not evidenced by Source/SourceAtom anchors.
- Act as free-form commentary without explicit type and provenance.

### Attributes (with descriptions)

- `signal_id: string` (REQUIRED, format `SG###`)
  Description: Stable identifier for the Signal element.
  Notes: null

- `signal_type: string` (REQUIRED)
  Description: Classification of the signal cue. Recommended controlled values include: Normative | Intent | Actor | Concern | Ambiguity | Quality.
  Notes: null

- `description: string` (REQUIRED)
  Description: Human-readable statement describing what was detected and how it should be interpreted as evidence (not an outcome).
  Notes: null

- `observed_text: string` (REQUIRED)
  Description: The exact observed excerpt (verbatim substring) that exhibits the signal.
  Notes: Should be a minimal span sufficient to evidence the signal.

- `source_refs: string[]` (REQUIRED; references `Source.source_id`)
  Description: Provenance anchors supporting this signal via Source identifiers.
  Notes: Usually exactly one Source; multiple permitted only when the signal is evidenced across multiple Sources.

- `sourceatom_refs: string[]` (OPTIONAL; references `SourceAtom.atom_id`)
  Description: Optional finer-grained provenance anchors when SourceAtom is used in the ledger instance.
  Notes: null

- `produced_by_pass_id: string` (REQUIRED; references `AnalysisPass.pass_id`)
  Description: Identifier of the AnalysisPass that produced this Signal.
  Notes: null

- `confidence: number` (REQUIRED, 0.0..1.0)
  Description: Confidence that this signal detection and classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- `signal_id` MUST be unique.
- `signal_id` MUST match regex `^SG\\d{3}$`.
- `signal_type` MUST NOT be empty.
- `description` MUST NOT be empty.
- `observed_text` MUST NOT be empty.
- `produced_by_pass_id` MUST reference an existing `AnalysisPass.pass_id`.
- `source_refs` MUST contain at least one entry.
- Each entry in `source_refs` MUST reference an existing `Source.source_id`.
- If `sourceatom_refs` is present:
  - MUST contain at least one entry
  - Each entry MUST reference an existing `SourceAtom.atom_id`.
- `confidence` MUST be within 0.0..1.0.

---

## 66. Element Type — SignalRegister

**Specialisation of:** `Register`

### Purpose (NORMATIVE)

- Declare the authoritative membership set for `Signal` elements.
- Enable completeness validation and prevent orphaned elements of this type.
- Support deterministic projections/views by providing a stable grouping boundary.

### Non-Purpose (NORMATIVE)

- Duplicate member element content.
- Contain inferred/implicit members not listed in member_ids.

### Attributes (with descriptions)

- `register_id: string` (REQUIRED)
  Description: Stable identifier for this register instance.
  Notes: null

- `register_type: string` (REQUIRED)
  Description: The element type governed by this register (the member identifier class).
  Notes: null

- `member_ids: list` (REQUIRED)
  Description: Explicit membership set of element identifiers governed by this register.
  Notes: null

- `completeness_rule: string` (REQUIRED)
  Description: Declarative statement defining the intended completeness semantics for the register.
  Notes: null

- `confidence: number` (REQUIRED)
  Description: Confidence that this element’s content/classification is correct (0.0..1.0).
  Notes: null

### Normative Rules

- Exactly ONE SignalRegister SHALL exist.
- `register_type` SHALL be `Signal`.
- `member_ids` SHALL contain ALL `Signal.signal_id` values.
- Canonical completeness rule:
  > This register SHALL contain the identifiers of ALL Signal elements present in the ledger.
- `confidence` MUST be within 0.0..1.0.

---

### JSON CanonicalLedger constraints (NORMATIVE)

The JSON CanonicalLedger instance MUST satisfy all of the following:

1. The ledger instance MUST be a single JSON object conforming to the Ledger Instance JSON Schema (Appendix C).
2. `ledger_id` MUST be present and MUST be globally unique across ledgers.
3. `sysengage_ledger_version` MUST equal the specification version of this ledger model (e.g., "2.2").
4. `schema_id` MUST identify the exact schema version used to validate this ledger instance.
5. `created_utc` MUST be present and MUST be an RFC 3339 / ISO 8601 date-time.
6. `elements` MUST be present and MUST be a JSON array.
7. Every entry in `elements` MUST conform to the `element_envelope` schema (Appendix C).
8. Every `elements[*].element_id` MUST be globally unique within the ledger.
9. Every `elements[*].element_type` MUST be one of the permitted element types defined in this specification.
10. For every element, `elements[*].payload` MUST contain the primary identifier that matches `elements[*].element_id` (per Appendix B.3).
11. A `SourceRegister` element MUST exist (exactly 1).
12. A `SegmentRegister` element MUST exist (exactly 1).
13. A `SourceAtomRegister` element MUST exist (exactly 1).
14. A `DomainRegister` element MUST exist (exactly 1).
15. A `ZachmanCellRegister` element MUST exist (exactly 1).
16. A `RequirementRegister` element MUST exist (exactly 1).
17. A `TraceRegister` element MUST exist (exactly 1).
18. A `SignalRegister` element MUST exist (exactly 1).
19. A `GapRegister` element MUST exist (exactly 1).
20. A `FindingsRegister` element MUST exist (exactly 1).
21. Registers MUST list all element IDs of their governed element type in `member_ids` (completeness rule), unless the register definition explicitly allows partial membership.
22. No `member_ids` entry may reference an element_id that does not exist in `elements`.
23. Every `Trace` MUST reference valid `from_element_id` and `to_element_id` that exist in `elements`.
24. Where an element has `source_refs`, each referenced Source ID MUST exist and MUST correspond to an element of type `Source`.
25. Where an element has `domain_refs`, each referenced Domain ID MUST exist and MUST correspond to an element of type `Domain`.
26. If `Question` elements are present, a `QuestionRegister` SHOULD exist and MUST be complete (lists all Questions).
27. If `Answer` elements are present, an `AnswerRegister` SHOULD exist and MUST be complete (lists all Answers).
28. If `Risk` elements are present, an `ActiveRiskRegister` SHOULD exist and MUST be complete (lists all Risks).
29. If `Issue` elements are present, an `IssueRegister` SHOULD exist and MUST be complete (lists all Issues).
30. If `Decision` elements are present, a `DecisionRegister` SHOULD exist and MUST be complete (lists all Decisions).
31. If `Violation` elements are present, a `ViolationRegister` SHOULD exist and MUST be complete (lists all Violations).
32. The ledger MUST NOT include element types that are not permitted by this specification.

---

## Appendices

### Purpose

This appendix hardens the ledger output by defining a **single canonical ledger instance file format** and the **rules** that MUST be followed to generate deterministic, parser-friendly outputs across multiple runs.

This appendix is intended to be pasted directly into the ledger specification.

## Appendix A

### A. Canonical output artefact (NORMATIVE)

#### A.1 Required canonical file type
- A SysEngage ledger instance **MUST** be emitted as **JSON**.
- The canonical ledger file **MUST** use the extension: `*.ledger.json`
- Any Markdown outputs (if produced) **MUST** be treated as **projections/views** and **MUST NOT** be used as the canonical machine-readable ledger.

#### A.2 JSON Schema version
- The canonical ledger instance **MUST** validate against the JSON Schema in section **B**.
- The JSON Schema herein conforms to **JSON Schema 2020-12**.

---

## Appendix B

### B. Output generation rules (NORMATIVE)

These rules MUST be followed by any generator (human or AI) producing a canonical ledger instance.

#### B.1 Canonical file emission rules
1. Output MUST be **UTF-8** encoded.
2. Output MUST use **LF** newlines.
3. Output MUST be valid JSON (RFC 8259); trailing commas are forbidden.
4. Output MUST be a **single JSON object** that validates against the schema in section D.

#### B.2 Canonicalization and determinism rules
To ensure two runs producing identical content yield identical diffs and hashes:

1. **No prose/view sections**  
   The canonical JSON MUST NOT contain Markdown headings, narrative “sections”, or view wrappers. Human views must be separate artefacts.

2. **Stable key naming**  
   All keys in `payload` MUST be **snake_case** and MUST match the attribute names defined for that element in the ledger speB.

3. **Deterministic ordering**
   - `elements[]` MUST be sorted deterministically:
     1) by `element_type` using the exact order listed in the schema enum; then  
     2) by `element_id` in lexicographic order.
   - `register_index[]` MUST be sorted by (`register_type`, `register_id`) lexicographically.

4. **Deterministic ordering inside payload**
   - For any `payload` arrays whose order is not semantically meaningful (e.g., `member_ids`, `linked_*_ids`), the generator MUST sort them lexicographically.
   - If an array’s order **is** semantically meaningful, the ledger spec MUST explicitly declare it as ordered; otherwise it SHALL be treated as unordered and sorted.

5. **Uniqueness constraints**
   - Every `element_id` MUST be globally unique across `elements[]`.
   - Every register referenced in `register_index[]` MUST correspond to exactly one element with `element_type` equal to that register’s type (e.g., `SourceRegister`) and matching `element_id`.

#### B.3 Required ID mapping rules (bridging to existing per-element IDs)
Because the underlying ledger spec defines per-element identifiers (e.g., `source_id`, `segment_id`, etB.), the canonical JSON serialization SHALL follow these mapping rules:

1. `element_id` MUST equal the element’s primary identifier from its payload, using the following precedence:
   - If payload contains `<type>_id` (e.g., `source_id`, `segment_id`, `requirement_id`), then `element_id` MUST equal that value.
   - If the element is a register and contains `register_id`, then `element_id` MUST equal `register_id`.
2. The payload MUST still retain the original identifier field (e.g., `source_id`), unchanged.

This ensures parsers can rely on a single field (`element_id`) for cross-element references while preserving the ledger spec’s element-native IDs.

#### B.4 Allowed fields and forward-compatibility rules
1. `payload` MAY include additional fields beyond those currently specified **ONLY IF** the ledger spec version explicitly permits extensions for that element type.
2. If extensions are permitted:
   - They MUST be namespaced using a stable prefix, e.g., `ext_*` or `x_*`.
3. If extensions are not permitted, generators MUST NOT emit extra keys.

#### B.5 Content hashing rules
1. `content_hash.hash` MUST be computed over a canonicalized form of the ledger instance:
   - Remove `content_hash` from the object.
   - Ensure deterministic ordering (per B.2).
   - Serialize the resulting object using:
     - UTF-8
     - LF
     - 2-space indentation
     - No trailing whitespace
2. Apply SHA-256 to the resulting byte stream and hex-encode the digest.

#### B.6 Strictness rules for multi-format outputs
1. A run MAY emit additional files (Markdown projections, CSV exports, etB.).
2. If additional files are emitted, the run MUST still emit the canonical JSON ledger, and all other files MUST be derivable from it.
3. If any non-JSON artefact contradicts the JSON ledger, the JSON ledger is authoritative.

---

## Appendix C

## C. Ledger instance JSON Schema (NORMATIVE)

{
   "$schema":"https://json-schema.org/draft/2020-12/schema",
   "$id":"sysengage.ledger.instance.v2_2.schema.json",
   "title":"SysEngage Ledger Instance (v2.2) — Canonical Serialization",
   "type":"object",
   "additionalProperties":false,
   "required":[
      "sysengage_ledger_version",
      "schema_id",
      "row_target",
      "run_id",
      "created_utc",
      "generator",
      "elements",
      "register_index",
      "content_hash"
   ],
   "properties":{
      "sysengage_ledger_version":{
         "type":"string",
         "const":"2.2",
         "description":"Ledger specification version that this instance claims conformance to."
      },
      "schema_id":{
         "type":"string",
         "const":"sysengage.ledger.instance.v2_2",
         "description":"Stable schema identifier for parser routing and validation selection."
      },
      "row_target":{
         "type":"string",
         "minLength":1,
         "description":"Row/viewpoint target identifier, e.g., 'Row1.Planner', 'Row4.Builder'."
      },
      "run_id":{
         "type":"string",
         "minLength":1,
         "description":"Stable run identifier (deterministic if randomness controls are deterministic)."
      },
      "created_utc":{
         "type":"string",
         "format":"date-time",
         "description":"UTC timestamp when this canonical ledger instance was generated."
      },
      "generator":{
         "type":"object",
         "additionalProperties":false,
         "required":[
            "name",
            "version"
         ],
         "properties":{
            "name":{
               "type":"string",
               "minLength":1
            },
            "version":{
               "type":"string",
               "minLength":1
            },
            "build":{
               "type":"string"
            },
            "execution_model":{
               "type":"string",
               "description":"Operational specification / execution model identifier used for the run."
            }
         }
      },
      "elements":{
         "type":"array",
         "minItems":1,
         "description":"All ledger elements as a single deterministic list (canonical).",
         "items":{
            "$ref":"#/$defs/element_envelope"
         }
      },
      "register_index":{
         "type":"array",
         "minItems":1,
         "description":"Deterministic index of registers for fast parser lookup (type → register_id).",
         "items":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "register_type",
               "register_id"
            ],
            "properties":{
               "register_type":{
                  "$ref":"#/$defs/element_type"
               },
               "register_id":{
                  "type":"string",
                  "minLength":1,
                  "description":"The element_id of the register element within elements[]."
               }
            }
         }
      },
      "content_hash":{
         "$ref":"#/$defs/content_hash"
      },
      "warnings":{
         "type":"array",
         "description":"Optional non-fatal warnings emitted by the generator (not required for conformance).",
         "items":{
            "$ref":"#/$defs/message"
         }
      },
      "errors":{
         "type":"array",
         "description":"Optional fatal errors encountered (if present, the file is still valid JSON but the run is non-conformant).",
         "items":{
            "$ref":"#/$defs/message"
         }
      }
   },
   "$defs":{
      "message":{
         "type":"object",
         "additionalProperties":false,
         "required":[
            "code",
            "message"
         ],
         "properties":{
            "code":{
               "type":"string",
               "minLength":1
            },
            "message":{
               "type":"string",
               "minLength":1
            },
            "severity":{
               "type":"string",
               "enum":[
                  "info",
                  "warning",
                  "error"
               ]
            },
            "related_element_ids":{
               "type":"array",
               "items":{
                  "type":"string",
                  "minLength":1
               }
            }
         }
      },
      "content_hash":{
         "type":"object",
         "additionalProperties":false,
         "required":[
            "hash_alg",
            "hash"
         ],
         "properties":{
            "hash_alg":{
               "type":"string",
               "enum":[
                  "sha256"
               ],
               "description":"Hash algorithm used for deterministic ledger payload hashing."
            },
            "hash":{
               "type":"string",
               "pattern":"^[A-Fa-f0-9]{64}$",
               "description":"Hex-encoded hash over the canonicalized ledger payload (rules in section C)."
            }
         }
      },
      "element_type":{
         "type":"string",
         "enum":[
            "Source",
            "Register",
            "SourceRegister",
            "AnalysisPass",
            "Finding",
            "FindingsRegister",
            "Gap",
            "GapRegister",
            "ZachmanCell",
            "ZachmanCellRegister",
            "CellContentItem",
            "CellRelationship",
            "Trace",
            "TraceRegister",
            "Domain",
            "DomainRegister",
            "Requirement",
            "RequirementRegister",
            "Question",
            "QuestionRegister",
            "Answer",
            "AnswerRegister",
            "Assumption",
            "AssumptionRegister",
            "Constraint",
            "ConstraintRegister",
            "Risk",
            "ActiveRiskRegister",
            "Issue",
            "IssueRegister",
            "CandidateRequirement",
            "CandidateRequirementRegister",
            "Suggestion",
            "SuggestionRegister",
            "CoverageItem",
            "CoverageRegister",
            "Rule",
            "Checklist",
            "Evaluation",
            "EvaluationRegister",
            "Segment",
            "SegmentRegister",
            "SourceAtom",
            "SourceAtomRegister",
            "ConcernCategory",
            "Concern",
            "ConcernRegister",
            "Baseline",
            "ArtefactState",
            "ChangeRecord",
            "Decision",
            "DecisionRegister",
            "Violation",
            "ViolationRegister",
            "ClosureMatrix",
            "StructuralRepresentation",
            "StructuralRepresentationRegister",
            "Stakeholder",
            "StakeholderRegister",
            "NarrativeSummary",
            "NarrativeSummaryRegister",
            "ControlArtefact",
            "ControlArtefactRegister",
            "Signal",
            "SignalRegister"
         ],
         "description":"Permitted element types (ledger spec v2.2)."
      },
      "id_S":{
         "type":"string",
         "pattern":"^S\\d{3}$"
       },
      "id_SEG":{
         "type":"string",
         "pattern":"^SEG\\d{3}$"
       },
      "id_SA":{
         "type":"string",
         "pattern":"^SA\\d{3}$"
       },
       "id_C": { "type": "string", "pattern": "^C\\d{3}$" },
       "id_ZC":{
          "type":"string",
          "minLength":1
       },
       "id_CI":{
          "type":"string",
          "minLength":1
       },
       "id_CR":{
          "type":"string",
          "pattern":"^CR\\d{3}$"
       },
       "id_R":{
          "type":"string",
          "pattern":"^R\\d{3}$"
       },
       "id_P":{
          "type":"string",
          "pattern":"^P\\d{3}$"
       },
       "id_F":{
          "type":"string",
          "pattern":"^F\\d{3}$"
       },
       "id_G":{
          "type":"string",
          "pattern":"^G\\d{3}$"
       },
       "id_T":{
          "type":"string",
          "pattern":"^T\\d{3}$"
       },
       "id_D":{
          "type":"string",
          "pattern":"^D\\d{3}$"
       },
       "id_SG":{
          "type":"string",
          "pattern":"^SG\\d{3}$"
       },
       "id_Q":{
          "type":"string",
          "pattern":"^Q\\d{3}$"
       },
       "id_A":{
          "type":"string",
          "pattern":"^A\\d{3}$"
       },
       "id_SUG":{
          "type":"string",
          "pattern":"^SUG\\d{3}$"
       },
       "id_AS":{
          "type":"string",
          "pattern":"^AS\\d{3}$"
       },
       "id_CV":{
          "type":"string",
          "pattern":"^CV\\d{3}$"
       },
       "id_EV":{
          "type":"string",
          "pattern":"^EV\\d{3}$"
       },
       "id_RL":{
          "type":"string",
          "pattern":"^RL\\d{3}$"
       },
       "id_CL":{
          "type":"string",
          "pattern":"^CL\\d{3}$"
       },
       "id_K": { 
          "type": "string", 
          "pattern": "^K\\d{3}$" 
       },
       "id_I": { "type": "string", "pattern": "^I\\d{3}$" },
       "id_DCS": { "type": "string", "pattern": "^DCS\\d{3}$" },
         "id_V":{
            "type":"string",
            "pattern":"^V\\d{3}$"
         },
         "id_B":{
            "type":"string",
            "pattern":"^B\\d{3}$"
         },
         "id_ST":{
            "type":"string",
            "pattern":"^ST\\d{3}$"
         },
         "id_CH":{
            "type":"string",
            "pattern":"^CH\\d{3}$"
         },
         "id_CM":{
            "type":"string",
            "pattern":"^CM\\d{3}$"
         },
         "id_SH": { "type": "string", "pattern": "^SH\\d{3}$" },
         "id_CC":{
            "type":"string",
            "pattern":"^CC\\d{3}$"
         },
         "id_CN": { "type": "string", "pattern": "^CN\\d{3}$" },
         "id_SR":{
            "type":"string",
            "pattern":"^SR\\d{3}$"
         },
         "id_NS":{
            "type":"string",
            "pattern":"^NS\\d{3}$"
         },
         "id_CA":{
            "type":"string",
            "pattern":"^CA\\d{3}$"
         },
         "id_REG":{
            "type":"string",
            "pattern":"^REG\\d{3}$"
         },
         "GenericRegisterPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "register_id",
               "register_type",
               "member_ids",
               "completeness_rule",
               "confidence"
            ],
            "properties":{
               "register_id":{
                  "type":"string",
                  "minLength":1
               },
               "register_type":{
                  "$ref":"#/$defs/element_type"
               },
               "member_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "completeness_rule":{
                  "type":"string",
                  "minLength":1
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            },
            "description":"Generic register payload for element_type == 'Register'. Prefer specialised register types where available."
         },
         "RiskPayload": {
            "type": "object",
            "additionalProperties": false,
            "required": ["risk_id", "title", "description", "likelihood", "impact", "confidence"],
            "properties": {
            "risk_id": { "$ref": "#/$defs/id_K" },
            "title": { "type": "string", "minLength": 1 },
            "description": { "type": "string", "minLength": 1 },
            "category": { "type": "string", "minLength": 1 },
            "likelihood": { "type": "string", "enum": ["High", "Medium", "Low"] },
            "impact": { "type": "string", "enum": ["High", "Medium", "Low"] },
            "exposure": { "type": "string", "enum": ["High", "Medium", "Low"] },
            "mitigation": { "type": "string", "minLength": 1 },
            "owner": { "type": "string", "minLength": 1 },
            "status": { "type": "string", "enum": ["Open", "Accepted", "Mitigated", "Closed"] },
            "source_refs": { "type": "array", "items": { "$ref": "#/$defs/id_S" } },
            "domain_refs": { "type": "array", "items": { "$ref": "#/$defs/id_D" } },
            "confidence": { "$ref": "#/$defs/confidence" }
            }
         },
         "ActiveRiskRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Risk"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_K"
                        }
                     }
                  }
               }
            ]
         },
         "IssuePayload": {
            "type": "object",
            "additionalProperties": false,
            "required": ["issue_id", "title", "description", "severity", "status", "confidence"],
            "properties": {
            "issue_id": { "$ref": "#/$defs/id_I" },
            "title": { "type": "string", "minLength": 1 },
            "description": { "type": "string", "minLength": 1 },
            "severity": { "type": "string", "enum": ["High", "Medium", "Low"] },
            "status": { "type": "string", "enum": ["Open", "InProgress", "Resolved", "Closed"] },
            "resolution_summary": { "type": "string", "minLength": 1 },
            "related_element_ids": { "type": "array", "items": { "type": "string", "minLength": 1 } },
            "source_refs": { "type": "array", "items": { "$ref": "#/$defs/id_S" } },
            "domain_refs": { "type": "array", "items": { "$ref": "#/$defs/id_D" } },
            "confidence": { "$ref": "#/$defs/confidence" }
            }
         },
         "IssueRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Issue"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_I"
                        }
                     }
                  }
               }
            ]
         },
         "DecisionPayload": {
            "type": "object",
            "additionalProperties": false,
            "required": ["decision_id", "title", "description", "status", "confidence"],
            "properties": {
            "decision_id": { "$ref": "#/$defs/id_DCS" },
            "title": { "type": "string", "minLength": 1 },
            "description": { "type": "string", "minLength": 1 },
            "decision_type": { "type": "string", "enum": ["Architectural", "Modelling", "Governance", "Risk", "Requirement"] },
            "status": { "type": "string", "enum": ["Proposed", "Accepted", "Rejected", "Superseded"] },
            "related_element_ids": { "type": "array", "items": { "type": "string", "minLength": 1 } },
            "rationale": { "type": "string", "minLength": 1 },
            "source_refs": { "type": "array", "items": { "$ref": "#/$defs/id_S" } },
            "domain_refs": { "type": "array", "items": { "$ref": "#/$defs/id_D" } },
            "confidence": { "$ref": "#/$defs/confidence" }
            }
         },
         "DecisionRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Decision"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_DCS"
                        }
                     }
                  }
               }
            ]
         },
         "ViolationPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "violation_id",
               "violation_type",
               "description",
               "severity",
               "subject_refs",
               "produced_by_pass_id",
               "confidence"
            ],
            "properties":{
               "violation_id":{
                  "$ref":"#/$defs/id_V"
               },
               "violation_type":{
                  "type":"string",
                  "enum":[
                     "Schema",
                     "Completeness",
                     "Consistency",
                     "Traceability",
                     "Process"
                  ]
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "severity":{
                  "type":"string",
                  "enum":[
                     "High",
                     "Medium",
                     "Low"
                  ]
               },
               "subject_refs":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "produced_by_pass_id":{
                  "$ref":"#/$defs/id_P"
               },
               "rule_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_RL"
                  }
               },
               "checklist_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_CL"
                  }
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "ViolationRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Violation"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_V"
                        }
                     }
                  }
               }
            ]
         },
         "BaselinePayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "baseline_id",
               "baseline_name",
               "baseline_scope",
               "included_element_ids",
               "created_utc"
            ],
            "properties":{
               "baseline_id":{
                  "$ref":"#/$defs/id_B"
               },
               "baseline_name":{
                  "type":"string",
                  "minLength":1
               },
               "baseline_scope":{
                  "type":"string",
                  "minLength":1
               },
               "included_element_ids":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "created_utc":{
                  "type":"string",
                  "format":"date-time"
               },
               "notes":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "ArtefactStatePayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "state_id",
               "artefact_ref",
               "state",
               "timestamp_utc"
            ],
            "properties":{
               "state_id":{
                  "$ref":"#/$defs/id_ST"
               },
               "artefact_ref":{
                  "type":"string",
                  "minLength":1
               },
               "state":{
                  "type":"string",
                  "enum":[
                     "Draft",
                     "Proposed",
                     "Approved",
                     "Deprecated",
                     "Retired"
                  ]
               },
               "timestamp_utc":{
                  "type":"string",
                  "format":"date-time"
               },
               "changed_by":{
                  "type":"string",
                  "minLength":1
               },
               "change_reason":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "ChangeRecordPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "change_id",
               "change_type",
               "description",
               "affected_element_ids",
               "timestamp_utc"
            ],
            "properties":{
               "change_id":{
                  "$ref":"#/$defs/id_CH"
               },
               "change_type":{
                  "type":"string",
                  "enum":[
                     "Add",
                     "Modify",
                     "Deprecate",
                     "Remove",
                     "Correct"
                  ]
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "affected_element_ids":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "timestamp_utc":{
                  "type":"string",
                  "format":"date-time"
               },
               "approved_by":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "ClosureMatrixPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "closure_matrix_id",
               "scope",
               "open_items",
               "closed_items"
            ],
            "properties":{
               "closure_matrix_id":{
                  "$ref":"#/$defs/id_CM"
               },
               "scope":{
                  "type":"string",
                  "minLength":1
               },
               "open_items":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "closed_items":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "notes":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "StakeholderPayload": {
            "type": "object",
            "additionalProperties": false,
            "required": ["stakeholder_id", "name", "confidence"],
            "properties": {
            "stakeholder_id": { "$ref": "#/$defs/id_SH" },
            "name": { "type": "string", "minLength": 1 },
            "role": { "type": "string", "minLength": 1 },
            "description": { "type": "string", "minLength": 1 },
            "concern_refs": { "type": "array", "items": { "$ref": "#/$defs/id_CN" } },
            "domain_refs": { "type": "array", "items": { "$ref": "#/$defs/id_D" } },
            "confidence": { "$ref": "#/$defs/confidence" }
            }
         },
         "StakeholderRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Stakeholder"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_SH"
                        }
                     }
                  }
               }
            ]
         },
         "ConcernCategoryPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "concern_category_id",
               "name",
               "description"
            ],
            "properties":{
               "concern_category_id":{
                  "$ref":"#/$defs/id_CC"
               },
               "name":{
                  "type":"string",
                  "minLength":1
               },
               "description":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "ConcernPayload": {
            "type": "object",
            "additionalProperties": false,
            "required": ["concern_id", "title", "description", "confidence"],
            "properties": {
            "concern_id": { "$ref": "#/$defs/id_CN" },
            "title": { "type": "string", "minLength": 1 },
            "description": { "type": "string", "minLength": 1 },
            "category_refs": { "type": "array", "items": { "$ref": "#/$defs/id_CC" } },
            "related_element_ids": { "type": "array", "items": { "type": "string", "minLength": 1 } },
            "source_refs": { "type": "array", "items": { "$ref": "#/$defs/id_S" } },
            "confidence": { "$ref": "#/$defs/confidence" }
            }
         },
         "ConcernRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Concern"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_CN"
                        }
                     }
                  }
               }
            ]
         },
         "StructuralRepresentationPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "representation_id",
               "representation_format",
               "representation_text",
               "scope_refs"
            ],
            "properties":{
               "representation_id":{
                  "$ref":"#/$defs/id_SR"
               },
               "representation_format":{
                  "type":"string",
                  "enum":[
                     "mermaid",
                     "plantuml",
                     "uml",
                     "text"
                  ]
               },
               "representation_text":{
                  "type":"string",
                  "minLength":1
               },
               "scope_refs":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "generated_from":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "StructuralRepresentationRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"StructuralRepresentation"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_SR"
                        }
                     }
                  }
               }
            ]
         },
         "NarrativeSummaryPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "summary_id",
               "summary_type",
               "summary_text",
               "scope_refs"
            ],
            "properties":{
               "summary_id":{
                  "$ref":"#/$defs/id_NS"
               },
               "summary_type":{
                  "type":"string",
                  "enum":[
                     "Executive",
                     "RowSummary",
                     "DomainSummary",
                     "FindingsSummary"
                  ]
               },
               "summary_text":{
                  "type":"string",
                  "minLength":1
               },
               "scope_refs":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "generated_from":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "NarrativeSummaryRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"NarrativeSummary"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_NS"
                        }
                     }
                  }
               }
            ]
         },
         "ControlArtefactPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "control_artefact_id",
               "name",
               "control_type",
               "description",
               "scope_refs"
            ],
            "properties":{
               "control_artefact_id":{
                  "$ref":"#/$defs/id_CA"
               },
               "name":{
                  "type":"string",
                  "minLength":1
               },
               "control_type":{
                  "type":"string",
                  "enum":[
                     "Policy",
                     "Standard",
                     "Template",
                     "Procedure",
                     "Checklist",
                     "RuleSet"
                  ]
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "scope_refs":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "version":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "ControlArtefactRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"ControlArtefact"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_CA"
                        }
                     }
                  }
               }
            ]
         },
         "QuestionPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "question_id",
               "question_text",
               "question_type",
               "domain_refs",
               "source_refs",
               "confidence"
            ],
            "properties":{
               "question_id":{
                  "$ref":"#/$defs/id_Q"
               },
               "question_text":{
                  "type":"string",
                  "minLength":1
               },
               "question_type":{
                  "type":"string",
                  "enum":[
                     "Clarification",
                     "GapClosure",
                     "Validation",
                     "Elicitation"
                  ]
               },
               "target_cells":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_ZC"
                  }
               },
               "related_requirement_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_R"
                  }
               },
               "related_gap_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_G"
                  }
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "QuestionRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Question"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_Q"
                        }
                     }
                  }
               }
            ]
         },
         "AnswerPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "answer_id",
               "answer_text",
               "question_ref",
               "source_refs",
               "confidence"
            ],
            "properties":{
               "answer_id":{
                  "$ref":"#/$defs/id_A"
               },
               "answer_text":{
                  "type":"string",
                  "minLength":1
               },
               "question_ref":{
                  "$ref":"#/$defs/id_Q"
               },
               "answer_type":{
                  "type":"string",
                  "enum":[
                     "Provided",
                     "Inferred",
                     "Assumed"
                  ]
               },
               "domain_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_D"
                  }
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "AnswerRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Answer"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_A"
                        }
                     }
                  }
               }
            ]
         },
         "SuggestionPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "suggestion_id",
               "suggestion_text",
               "suggestion_type",
               "domain_refs",
               "source_refs",
               "confidence"
            ],
            "properties":{
               "suggestion_id":{
                  "$ref":"#/$defs/id_SUG"
               },
               "suggestion_text":{
                  "type":"string",
                  "minLength":1
               },
               "suggestion_type":{
                  "type":"string",
                  "enum":[
                     "ImproveCoverage",
                     "RefineRequirement",
                     "AddDomain",
                     "AddTrace",
                     "Process"
                  ]
               },
               "related_gap_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_G"
                  }
               },
               "related_finding_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_F"
                  }
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SuggestionRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Suggestion"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_SUG"
                        }
                     }
                  }
               }
            ]
         },
         "CandidateRequirementPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "candidate_requirement_id",
               "statement",
               "candidate_type",
               "source_refs",
               "domain_refs",
               "confidence"
            ],
            "properties":{
               "candidate_requirement_id":{
                  "$ref":"#/$defs/id_CR"
               },
               "statement":{
                  "type":"string",
                  "minLength":1
               },
               "candidate_type":{
                  "type":"string",
                  "enum":[
                     "Functional",
                     "Constraint",
                     "Performance",
                     "Suitability"
                  ]
               },
               "rationale":{
                  "type":"string",
                  "minLength":1
               },
               "derived_from_signals":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_SG"
                  }
               },
               "derived_from_findings":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_F"
                  }
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "CandidateRequirementRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"CandidateRequirement"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_CR"
                        }
                     }
                  }
               }
            ]
         },
         "AssumptionPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "assumption_id",
               "assumption_text",
               "assumption_type",
               "source_refs",
               "domain_refs",
               "confidence"
            ],
            "properties":{
               "assumption_id":{
                  "$ref":"#/$defs/id_AS"
               },
               "assumption_text":{
                  "type":"string",
                  "minLength":1
               },
               "assumption_type":{
                  "type":"string",
                  "enum":[
                     "Environmental",
                     "Operational",
                     "Stakeholder",
                     "Technical"
                  ]
               },
               "rationale":{
                  "type":"string",
                  "minLength":1
               },
               "related_requirement_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_R"
                  }
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "AssumptionRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Assumption"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_AS"
                        }
                     }
                  }
               }
            ]
         },
         "ConstraintPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "constraint_id",
               "constraint_text",
               "constraint_type",
               "source_refs",
               "domain_refs",
               "confidence"
            ],
            "properties":{
               "constraint_id":{
                  "$ref":"#/$defs/id_C"
               },
               "constraint_text":{
                  "type":"string",
                  "minLength":1
               },
               "constraint_type":{
                  "type":"string",
                  "enum":[
                     "Regulatory",
                     "Technical",
                     "Operational",
                     "Business"
                  ]
               },
               "rationale":{
                  "type":"string",
                  "minLength":1
               },
               "related_requirement_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_R"
                  }
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "ConstraintRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Constraint"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_C"
                        }
                     }
                  }
               }
            ]
         },
         "CoverageItemPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "coverage_id",
               "coverage_type",
               "target_ref",
               "coverage_statement",
               "confidence"
            ],
            "properties":{
               "coverage_id":{
                  "$ref":"#/$defs/id_CV"
               },
               "coverage_type":{
                  "type":"string",
                  "enum":[
                     "DomainCoverage",
                     "CellCoverage",
                     "RequirementCoverage"
                  ]
               },
               "target_ref":{
                  "type":"string",
                  "minLength":1,
                  "description":"ID of the covered entity (e.g., D###, ZC..., R###)."
               },
               "coverage_statement":{
                  "type":"string",
                  "minLength":1
               },
               "evidence_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_S"
                  }
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "CoverageRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"CoverageItem"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_CV"
                        }
                     }
                  }
               }
            ]
         },
         "EvaluationPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "evaluation_id",
               "evaluation_type",
               "subject_refs",
               "result",
               "confidence"
            ],
            "properties":{
               "evaluation_id":{
                  "$ref":"#/$defs/id_EV"
               },
               "evaluation_type":{
                  "type":"string",
                  "enum":[
                     "Completeness",
                     "Consistency",
                     "Traceability",
                     "Conformance"
                  ]
               },
               "subject_refs":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "result":{
                  "type":"string",
                  "enum":[
                     "Pass",
                     "Fail",
                     "Warn"
                  ]
               },
               "details":{
                  "type":"string",
                  "minLength":1
               },
               "rule_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_RL"
                  }
               },
               "checklist_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_CL"
                  }
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "EvaluationRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Evaluation"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_EV"
                        }
                     }
                  }
               }
            ]
         },
         "RulePayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "rule_id",
               "rule_name",
               "rule_statement",
               "rule_scope"
            ],
            "properties":{
               "rule_id":{
                  "$ref":"#/$defs/id_RL"
               },
               "rule_name":{
                  "type":"string",
                  "minLength":1
               },
               "rule_statement":{
                  "type":"string",
                  "minLength":1
               },
               "rule_scope":{
                  "type":"string",
                  "minLength":1
               },
               "severity":{
                  "type":"string",
                  "enum":[
                     "High",
                     "Medium",
                     "Low"
                  ]
               }
            }
         },
         "ChecklistPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "checklist_id",
               "checklist_name",
               "items"
            ],
            "properties":{
               "checklist_id":{
                  "$ref":"#/$defs/id_CL"
               },
               "checklist_name":{
                  "type":"string",
                  "minLength":1
               },
               "items":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"object",
                     "additionalProperties":false,
                     "required":[
                        "item_id",
                        "item_text"
                     ],
                     "properties":{
                        "item_id":{
                           "type":"string",
                           "minLength":1
                        },
                        "item_text":{
                           "type":"string",
                           "minLength":1
                        },
                        "obligation":{
                           "type":"string",
                           "enum":[
                              "SHALL",
                              "SHOULD",
                              "MAY"
                           ]
                        }
                     }
                  }
               }
            }
         },
         "confidence":{
            "type":"number",
            "minimum":0.0,
            "maximum":1.0
         },
         "ref_SourceIds":{
            "type":"array",
            "minItems":1,
            "items":{
               "$ref":"#/$defs/id_S"
            }
         },
         "ref_DomainIds":{
            "type":"array",
            "minItems":1,
            "items":{
               "$ref":"#/$defs/id_D"
            }
         },
         "RegisterPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "register_id",
               "register_type",
               "member_ids",
               "completeness_rule",
               "confidence"
            ],
            "properties":{
               "register_id":{
                  "type":"string",
                  "minLength":1
               },
               "register_type":{
                  "type":"string",
                  "minLength":1
               },
               "member_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "completeness_rule":{
                  "type":"string",
                  "minLength":1
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SourcePayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "source_id",
               "source_text",
               "segmentation_context",
               "confidence"
            ],
            "properties":{
               "source_id":{
                  "$ref":"#/$defs/id_S"
               },
               "source_text":{
                  "type":"string",
                  "minLength":1
               },
               "segmentation_context":{
                  "type":"string",
                  "minLength":1
               },
               "parent_source_ref":{
                  "$ref":"#/$defs/id_S"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SourceRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Source"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_S"
                        }
                     }
                  }
               }
            ]
         },
         "SegmentPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "segment_id",
               "title",
               "source_refs",
               "confidence"
            ],
            "properties":{
               "segment_id":{
                  "$ref":"#/$defs/id_SEG"
               },
               "title":{
                  "type":"string",
                  "minLength":1
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "parent_segment_ref":{
                  "$ref":"#/$defs/id_SEG"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SegmentRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Segment"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_SEG"
                        }
                     }
                  }
               }
            ]
         },
         "SourceAtomPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "atom_id",
               "atom_text",
               "source_ref",
               "confidence"
            ],
            "properties":{
               "atom_id":{
                  "$ref":"#/$defs/id_SA"
               },
               "atom_text":{
                  "type":"string",
                  "minLength":1
               },
               "source_ref":{
                  "$ref":"#/$defs/id_S"
               },
               "segment_ref":{
                  "$ref":"#/$defs/id_SEG"
               },
               "parent_atom_ref":{
                  "$ref":"#/$defs/id_SA"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SourceAtomRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"SourceAtom"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_SA"
                        }
                     }
                  }
               }
            ]
         },
         "ZachmanCellPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "cell_id",
               "row",
               "column",
               "obligation_rules_ref"
            ],
            "properties":{
               "cell_id":{
                  "$ref":"#/$defs/id_ZC"
               },
               "row":{
                  "type":"string",
                  "minLength":1
               },
               "column":{
                  "type":"string",
                  "minLength":1
               },
               "obligation_rules_ref":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               }
            }
         },
         "ZachmanCellRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"ZachmanCell"
                     }
                  }
               }
            ]
         },
         "CellContentItemPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "ci_id",
               "cell_id",
               "classification_type",
               "description",
               "linked_objects"
            ],
            "properties":{
               "ci_id":{
                  "$ref":"#/$defs/id_CI"
               },
               "cell_id":{
                  "$ref":"#/$defs/id_ZC"
               },
               "classification_type":{
                  "type":"string",
                  "minLength":1
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "trigger_condition":{
                  "type":"string",
                  "minLength":1
               },
               "justification":{
                  "type":"string",
                  "minLength":1
               },
               "linked_objects":{
                  "type":"array",
                  "minItems":1,
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               }
            }
         },
         "CellRelationshipPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "relationship_id",
               "from_ci",
               "to_ci",
               "relationship_type",
               "rationale"
            ],
            "properties":{
               "relationship_id":{
                  "type":"string",
                  "minLength":1
               },
               "from_ci":{
                  "$ref":"#/$defs/id_CI"
               },
               "to_ci":{
                  "$ref":"#/$defs/id_CI"
               },
               "relationship_type":{
                  "type":"string",
                  "minLength":1
               },
               "rationale":{
                  "type":"string",
                  "minLength":1
               }
            }
         },
         "DomainPayload":{
            "type":"object",
            "additionalProperties":true,
            "required":[
               "domain_id"
            ],
            "properties":{
               "domain_id":{
                  "$ref":"#/$defs/id_D"
               }
            }
         },
         "DomainRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Domain"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_D"
                        }
                     }
                  }
               }
            ]
         },
         "RequirementPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "requirement_id",
               "statement",
               "requirement_type",
               "source_refs",
               "domain_refs",
               "confidence"
            ],
            "properties":{
               "requirement_id":{
                  "$ref":"#/$defs/id_R"
               },
               "statement":{
                  "type":"string",
                  "minLength":1
               },
               "requirement_type":{
                  "type":"string",
                  "enum":[
                     "Functional",
                     "Constraint",
                     "Performance",
                     "Suitability"
                  ]
               },
               "rationale":{
                  "type":"string",
                  "minLength":1
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "fit_criteria":{
                  "type":"string",
                  "minLength":1
               },
               "verification_method":{
                  "type":"string",
                  "enum":[
                     "Test",
                     "Analysis",
                     "Inspection",
                     "Demonstration"
                  ]
               },
               "priority":{
                  "type":"string",
                  "enum":[
                     "High",
                     "Medium",
                     "Low"
                  ]
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "RequirementRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Requirement"
                     },
                     "member_ids":{
                        "type":"array",
                        "items":{
                           "$ref":"#/$defs/id_R"
                        }
                     }
                  }
               }
            ]
         },
         "TracePayload":{
            "type":"object",
            "additionalProperties":true,
            "required":[
               "trace_id"
            ],
            "properties":{
               "trace_id":{
                  "$ref":"#/$defs/id_T"
               }
            }
         },
         "TraceRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Trace"
                     }
                  }
               }
            ]
         },
         "AnalysisPassPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "pass_id",
               "pass_type",
               "evaluated_scope",
               "confidence"
            ],
            "properties":{
               "pass_id":{
                  "$ref":"#/$defs/id_P"
               },
               "pass_type":{
                  "type":"string",
                  "minLength":1
               },
               "evaluated_scope":{
                  "type":"string",
                  "minLength":1
               },
               "evaluation_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "rule_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "checklist_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "produced_finding_ids":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_F"
                  }
               },
               "produced_gap_ids":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_G"
                  }
               },
               "produced_suggestion_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "produced_coverage_ids":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "FindingPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "finding_id",
               "description",
               "produced_by_pass_id",
               "confidence",
               "source_refs"
            ],
            "properties":{
               "finding_id":{
                  "$ref":"#/$defs/id_F"
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "severity":{
                  "type":"string",
                  "enum":[
                     "High",
                     "Medium",
                     "Low"
                  ]
               },
               "related_items":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "produced_by_pass_id":{
                  "$ref":"#/$defs/id_P"
               },
               "rule_triggered":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "evidence":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               }
            }
         },
         "FindingsRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Finding"
                     }
                  }
               }
            ]
         },
         "GapPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "gap_id",
               "description",
               "impact",
               "affected_cells",
               "proposed_resolution",
               "domain_refs",
               "traceability",
               "produced_from_finding_ids"
            ],
            "properties":{
               "gap_id":{
                  "$ref":"#/$defs/id_G"
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "impact":{
                  "type":"string",
                  "minLength":1
               },
               "affected_cells":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_ZC"
                  }
               },
               "proposed_resolution":{
                  "type":"string",
                  "minLength":1
               },
               "resolution_state":{
                  "type":"string",
                  "enum":[
                     "Open",
                     "Accepted",
                     "Mitigated",
                     "Closed"
                  ]
               },
               "domain_refs":{
                  "$ref":"#/$defs/ref_DomainIds"
               },
               "traceability":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_T"
                  }
               },
               "produced_from_finding_ids":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_F"
                  }
               }
            }
         },
         "GapRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Gap"
                     }
                  }
               }
            ]
         },
         "SignalPayload":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "signal_id",
               "signal_type",
               "description",
               "observed_text",
               "source_refs",
               "produced_by_pass_id",
               "confidence"
            ],
            "properties":{
               "signal_id":{
                  "$ref":"#/$defs/id_SG"
               },
               "signal_type":{
                  "type":"string",
                  "minLength":1
               },
               "description":{
                  "type":"string",
                  "minLength":1
               },
               "observed_text":{
                  "type":"string",
                  "minLength":1
               },
               "source_refs":{
                  "$ref":"#/$defs/ref_SourceIds"
               },
               "sourceatom_refs":{
                  "type":"array",
                  "items":{
                     "$ref":"#/$defs/id_SA"
                  }
               },
               "produced_by_pass_id":{
                  "$ref":"#/$defs/id_P"
               },
               "confidence":{
                  "$ref":"#/$defs/confidence"
               }
            }
         },
         "SignalRegisterPayload":{
            "allOf":[
               {
                  "$ref":"#/$defs/RegisterPayload"
               },
               {
                  "type":"object",
                  "properties":{
                     "register_type":{
                        "const":"Signal"
                     }
                  }
               }
            ]
         },
         "UnspecifiedPayload":{
            "type":"object",
            "description":"Temporary fallback until full per-element payload schemas are added. Remove once complete coverage is achieved.",
            "additionalProperties":true
         },
         "element_envelope":{
            "type":"object",
            "additionalProperties":false,
            "required":[
               "element_type",
               "element_id",
               "payload"
            ],
            "properties":{
               "element_type":{
                  "$ref":"#/$defs/element_type"
               },
               "element_id":{
                  "type":"string",
                  "minLength":1
               },
               "payload":{
                  "type":"object"
               },
               "trace_links":{
                  "type":"array",
                  "items":{
                     "type":"string",
                     "minLength":1
                  }
               }
            },
            "allOf":[
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Source"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SourcePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_S"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SourceRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SourceRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Segment"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SegmentPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SEG"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SegmentRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SegmentRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SourceAtom"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SourceAtomPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SA"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SourceAtomRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SourceAtomRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ZachmanCell"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ZachmanCellPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_ZC"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ZachmanCellRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ZachmanCellRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CellContentItem"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CellContentItemPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CellRelationship"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CellRelationshipPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Domain"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/DomainPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_D"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"DomainRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/DomainRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Requirement"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/RequirementPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_R"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"RequirementRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/RequirementRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Trace"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/TracePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_T"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"TraceRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/TraceRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"AnalysisPass"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/AnalysisPassPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_P"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Finding"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/FindingPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_F"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"FindingsRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/FindingsRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Gap"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/GapPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_G"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"GapRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/GapRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Signal"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SignalPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SG"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SignalRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SignalRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Question"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/QuestionPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_Q"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"QuestionRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/QuestionRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Answer"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/AnswerPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_A"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"AnswerRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/AnswerRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Suggestion"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SuggestionPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SUG"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"SuggestionRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/SuggestionRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CandidateRequirement"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CandidateRequirementPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CR"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CandidateRequirementRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CandidateRequirementRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Assumption"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/AssumptionPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_AS"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"AssumptionRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/AssumptionRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Constraint"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ConstraintPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_C"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ConstraintRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ConstraintRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CoverageItem"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CoverageItemPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CV"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"CoverageRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/CoverageRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Evaluation"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/EvaluationPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_EV"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"EvaluationRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/EvaluationRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Rule"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/RulePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_RL"
                        }
                     }
                  }
               },  
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ActiveRiskRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ActiveRiskRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Issue"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/IssuePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_I"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"IssueRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/IssueRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Decision"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/DecisionPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_DCS"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"DecisionRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/DecisionRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Violation"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ViolationPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_V"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ViolationRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ViolationRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Baseline"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/BaselinePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_B"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ArtefactState"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ArtefactStatePayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_ST"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ChangeRecord"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ChangeRecordPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CH"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ClosureMatrix"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ClosureMatrixPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CM"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Stakeholder"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/StakeholderPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SH"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"StakeholderRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/StakeholderRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ConcernCategory"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ConcernCategoryPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CC"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Concern"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ConcernPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CN"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ConcernRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ConcernRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"StructuralRepresentation"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/StructuralRepresentationPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_SR"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"StructuralRepresentationRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/StructuralRepresentationRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"NarrativeSummary"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/NarrativeSummaryPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_NS"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"NarrativeSummaryRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/NarrativeSummaryRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ControlArtefact"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ControlArtefactPayload"
                        },
                        "element_id":{
                           "$ref":"#/$defs/id_CA"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"ControlArtefactRegister"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/ControlArtefactRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "properties":{
                        "element_type":{
                           "const":"Register"
                        }
                     },
                     "required":[
                        "element_type"
                     ]
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/GenericRegisterPayload"
                        }
                     }
                  }
               },
               {
                  "if":{
                     "not":{
                        "properties":{
                           "element_type":{
                              "enum":[
                                 "Source",
                                 "SourceRegister",
                                 "Segment",
                                 "SegmentRegister",
                                 "SourceAtom",
                                 "SourceAtomRegister",
                                 "ZachmanCell",
                                 "ZachmanCellRegister",
                                 "CellContentItem",
                                 "CellRelationship",
                                 "Domain",
                                 "DomainRegister",
                                 "Requirement",
                                 "RequirementRegister",
                                 "Trace",
                                 "TraceRegister",
                                 "AnalysisPass",
                                 "Finding",
                                 "FindingsRegister",
                                 "Gap",
                                 "GapRegister",
                                 "Signal",
                                 "SignalRegister"
                                 "Question",
                                 "QuestionRegister",
                                 "Answer",
                                 "AnswerRegister",
                                 "Assumption",
                                 "AssumptionRegister",
                                 "Constraint",
                                 "ConstraintRegister",
                                 "Risk",
                                 "ActiveRiskRegister",
                                 "Issue",
                                 "IssueRegister",
                                 "CandidateRequirement",
                                 "CandidateRequirementRegister",
                                 "Suggestion",
                                 "SuggestionRegister",
                                 "CoverageItem",
                                 "CoverageRegister",
                                 "Rule",
                                 "Checklist",
                                 "Evaluation",
                                 "EvaluationRegister",
                                 "ConcernCategory",
                                 "Concern",
                                 "ConcernRegister",
                                 "Baseline",
                                 "ArtefactState",
                                 "ChangeRecord",
                                 "Decision",
                                 "DecisionRegister",
                                 "Violation",
                                 "ViolationRegister",
                                 "ClosureMatrix",
                                 "StructuralRepresentation",
                                 "StructuralRepresentationRegister",
                                 "Stakeholder",
                                 "StakeholderRegister",
                                 "NarrativeSummary",
                                 "NarrativeSummaryRegister",
                                 "ControlArtefact",
                                 "ControlArtefactRegister"
                              ]
                           }
                        },
                        "required":["element_type"]
                     }
                  },
                  "then":{
                     "properties":{
                        "payload":{
                           "$ref":"#/$defs/UnspecifiedPayload"
                          }
                       }
                    }
               }
            ]
         }
   }
}
```