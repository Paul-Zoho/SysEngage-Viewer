import { z } from "zod";
import { pgTable, serial, text, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const severityEnum = z.enum(["High", "Medium", "Low"]);
export type Severity = z.infer<typeof severityEnum>;

export const traceTypeEnum = z.enum(["ST", "DT", "GT", "AT"]);
export type TraceType = z.infer<typeof traceTypeEnum>;

export const requirementTypeEnum = z.enum(["Functional", "Constraint", "Performance", "Suitability"]);
export type RequirementType = z.infer<typeof requirementTypeEnum>;

export const verificationMethodEnum = z.enum(["Test", "Analysis", "Inspection", "Demonstration"]);

export const riskStatusEnum = z.enum(["Active", "Mitigated", "Accepted", "Closed"]);

export const issueStatusEnum = z.enum(["Open", "InProgress", "Resolved", "Closed"]);

export const gapResolutionEnum = z.enum(["Open", "Accepted", "Mitigated", "Closed"]);

export const candidateStatusEnum = z.enum(["Proposed", "Accepted", "Rejected", "Promoted"]);

export const decisionStatusEnum = z.enum(["Proposed", "Accepted", "Rejected", "Superseded"]);

export const coverageStateEnum = z.enum(["Covered", "PartiallyCovered", "NotCovered", "Unknown"]);

export const coverageTypeEnum = z.enum(["Cell", "Domain", "Requirement"]);

export const ruleTypeEnum = z.enum(["Quality", "Coverage", "Consistency", "Governance"]);

export const constraintTypeEnum = z.enum(["Design", "Technical", "Regulatory", "Environmental"]);

export const closureStateEnum = z.enum(["Open", "Accepted", "Mitigated", "Closed"]);

export const closureTypeEnum = z.enum(["Gap", "Question", "Finding", "Coverage"]);

export interface Source {
  source_id: string;
  source_text: string;
  segmentation_context: string;
  parent_source_ref?: string;
  confidence: number;
}

export interface Register {
  register_id: string;
  register_type: string;
  member_ids: string[];
  completeness_rule: string;
  confidence?: number;
}

export interface AnalysisPass {
  pass_id: string;
  pass_type: string;
  evaluated_scope: string;
  evaluation_ids?: string[];
  rule_ids?: string[];
  checklist_ids?: string[];
  produced_finding_ids?: string[];
  produced_gap_ids?: string[];
  produced_suggestion_ids?: string[];
  produced_coverage_ids?: string[];
  confidence: number;
}

export interface Finding {
  finding_id: string;
  type: string;
  description: string;
  severity: Severity;
  related_items: string[];
  produced_by_pass_id: string;
  rule_triggered?: string[];
  evidence?: string[];
  confidence: number;
  source_refs: string[];
}

export interface Gap {
  gap_id: string;
  description: string;
  impact: string;
  affected_cells: string[];
  proposed_resolution: string;
  resolution_state?: string;
  domain_refs: string[];
  traceability: string[];
  produced_from_finding_ids: string[];
}

export interface ZachmanCell {
  cell_id: string;
  row: string;
  column: string;
  obligation_rules_ref: string[];
}

export interface Trace {
  trace_id: string;
  from_id: string;
  to_id: string;
  trace_type: TraceType;
  rationale: string;
  confidence: number;
  interpretation_magnitude?: number;
}

export interface Domain {
  domain_id: string;
  name: string;
  description: string;
  parent_domain_ref?: string;
  classification_type?: string;
}

export interface Requirement {
  requirement_id: string;
  statement: string;
  requirement_type: string;
  rationale?: string;
  source_refs: string[];
  domain_refs: string[];
  fit_criteria?: string;
  verification_method?: string;
  priority?: string;
  confidence: number;
}

export interface Risk {
  risk_id: string;
  title: string;
  description: string;
  category?: string;
  likelihood: Severity;
  impact: Severity;
  exposure?: string;
  mitigation?: string;
  owner?: string;
  status: string;
  related_element_ids?: string[];
  source_refs?: string[];
  domain_refs?: string[];
  confidence: number;
}

export interface Issue {
  issue_id: string;
  title: string;
  description: string;
  severity: Severity;
  status: string;
  resolution_summary?: string;
  related_element_ids?: string[];
  source_refs?: string[];
  domain_refs?: string[];
  owner?: string;
  confidence: number;
}

export interface Question {
  question_id: string;
  question_text: string;
  context?: string;
  priority?: string;
  status?: string;
  related_gap_ids?: string[];
  source_refs?: string[];
  confidence: number;
}

export interface Answer {
  answer_id: string;
  question_id: string;
  response_text: string;
  provided_by?: string;
  provided_utc?: string;
  source_refs?: string[];
  confidence: number;
}

export interface Assumption {
  assumption_id: string;
  statement: string;
  scope?: string;
  related_element_ids?: string[];
  source_refs?: string[];
  confidence: number;
}

export interface Constraint {
  constraint_id: string;
  statement: string;
  constraint_type: string;
  rationale?: string;
  source_refs: string[];
  domain_refs: string[];
  affected_element_ids?: string[];
  priority?: string;
  confidence: number;
}

export interface CandidateRequirement {
  candidate_requirement_id: string;
  statement: string;
  requirement_type: string;
  rationale?: string;
  source_refs: string[];
  domain_refs: string[];
  fit_criteria?: string;
  status: string;
  confidence: number;
}

export interface Suggestion {
  suggestion_id: string;
  description: string;
  suggestion_type?: string;
  target_element_ids?: string[];
  rationale?: string;
  source_refs?: string[];
  confidence: number;
}

export interface Decision {
  decision_id: string;
  title: string;
  description: string;
  decision_type?: string;
  status: string;
  related_element_ids?: string[];
  rationale?: string;
  decided_utc?: string;
  confidence: number;
}

export interface CoverageItem {
  coverage_id: string;
  coverage_type: string;
  target_id: string;
  coverage_state: string;
  evidence_ids?: string[];
  produced_by_pass_id: string;
  notes?: string;
  confidence: number;
}

export interface Rule {
  rule_id: string;
  name: string;
  description: string;
  rule_type: string;
  severity_default?: string;
  applies_to_element_types: string[];
  version?: string;
  confidence: number;
}

export interface Evaluation {
  evaluation_id: string;
  evaluation_type: string;
  scope_description: string;
  checklist_ids?: string[];
  rule_ids?: string[];
  produced_finding_ids?: string[];
  produced_gap_ids?: string[];
  produced_suggestion_ids?: string[];
  produced_coverage_ids?: string[];
  confidence: number;
}

export interface Violation {
  violation_id: string;
  rule_id?: string;
  checklist_id?: string;
  description: string;
  severity: Severity;
  related_element_ids: string[];
  evidence_ids?: string[];
  produced_by_evaluation_id?: string;
  produced_by_pass_id?: string;
  confidence: number;
}

export interface Stakeholder {
  stakeholder_id: string;
  name: string;
  role?: string;
  description?: string;
  concern_refs?: string[];
  domain_refs?: string[];
  confidence: number;
}

export interface NarrativeSummary {
  summary_id: string;
  viewpoint: string;
  scope_description: string;
  summary_text: string;
  related_element_ids?: string[];
  produced_by_pass_id?: string;
  produced_by_evaluation_id?: string;
  confidence: number;
}

export interface Segment {
  segment_id: string;
  source_id: string;
  segment_text: string;
  segment_index: number;
  classification?: string;
  confidence: number;
}

export interface SourceAtom {
  atom_id: string;
  segment_id: string;
  atom_text: string;
  atom_type?: string;
  confidence: number;
}

export interface CellContentItem {
  content_item_id: string;
  cell_id: string;
  element_id: string;
  element_type: string;
  relevance_score?: number;
  confidence: number;
}

export interface CellRelationship {
  relationship_id: string;
  from_cell_id: string;
  to_cell_id: string;
  relationship_type: string;
  description?: string;
  confidence: number;
}

export interface Checklist {
  checklist_id: string;
  name: string;
  description: string;
  checklist_type?: string;
  item_ids?: string[];
  applies_to_element_types?: string[];
  confidence: number;
}

export interface StructuralRepresentation {
  representation_id: string;
  representation_type: string;
  scope_description: string;
  content: string;
  related_element_ids?: string[];
  confidence: number;
}

export interface ControlArtefact {
  artefact_id: string;
  artefact_type: string;
  name: string;
  description: string;
  state?: string;
  related_element_ids?: string[];
  confidence: number;
}

export interface Signal {
  signal_id: string;
  signal_type: string;
  description: string;
  source_element_id: string;
  target_element_ids?: string[];
  priority?: string;
  confidence: number;
}

export interface Concern {
  concern_id: string;
  description: string;
  concern_category?: string;
  raised_by_stakeholder_id?: string;
  related_element_ids?: string[];
  priority?: string;
  status?: string;
  confidence: number;
}

export interface ClosureMatrix {
  matrix_id: string;
  matrix_type: string;
  description: string;
  row_element_ids: string[];
  column_element_ids: string[];
  closure_states: Record<string, string>;
  confidence: number;
}

export interface Baseline {
  baseline_id: string;
  name: string;
  description: string;
  baseline_type?: string;
  element_ids: string[];
  created_utc?: string;
  confidence: number;
}

export interface ChangeRecord {
  change_id: string;
  change_type: string;
  description: string;
  affected_element_ids: string[];
  before_state?: string;
  after_state?: string;
  changed_utc?: string;
  confidence: number;
}

export interface ConcernCategory {
  concern_category_id: string;
  name: string;
  description?: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface ArtefactState {
  artefact_state_id: string;
  element_id: string;
  state: string;
  changed_utc?: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface CanonicalLedger {
  ledger_id: string;
  version: string;
  created_utc: string;
  row_target?: string;
  run_id?: string;
  schema_id?: string;
  generator?: { name: string; version: string; build?: string; execution_model?: string };
  sources: Source[];
  source_register: Register;
  findings: Finding[];
  findings_register: Register;
  gaps: Gap[];
  gap_register: Register;
  zachman_cells: ZachmanCell[];
  zachman_cell_register: Register;
  traces: Trace[];
  trace_register: Register;
  domains: Domain[];
  domain_register: Register;
  requirements: Requirement[];
  requirement_register: Register;
  risks: Risk[];
  active_risk_register: Register;
  issues: Issue[];
  issue_register: Register;
  questions: Question[];
  question_register: Register;
  answers: Answer[];
  answer_register: Register;
  assumptions: Assumption[];
  assumption_register: Register;
  constraints: Constraint[];
  constraint_register: Register;
  candidate_requirements: CandidateRequirement[];
  candidate_requirement_register: Register;
  suggestions: Suggestion[];
  suggestion_register: Register;
  decisions: Decision[];
  decision_register: Register;
  coverage_items: CoverageItem[];
  coverage_register: Register;
  rules: Rule[];
  evaluations: Evaluation[];
  evaluation_register: Register;
  violations: Violation[];
  violation_register: Register;
  analysis_passes: AnalysisPass[];
  stakeholders: Stakeholder[];
  stakeholder_register: Register;
  narrative_summaries: NarrativeSummary[];
  narrative_summary_register: Register;
  segments: Segment[];
  segment_register: Register;
  source_atoms: SourceAtom[];
  source_atom_register: Register;
  cell_content_items: CellContentItem[];
  cell_content_item_register: Register;
  cell_relationships: CellRelationship[];
  cell_relationship_register: Register;
  checklists: Checklist[];
  checklist_register: Register;
  structural_representations: StructuralRepresentation[];
  structural_representation_register: Register;
  control_artefacts: ControlArtefact[];
  control_artefact_register: Register;
  signals: Signal[];
  signal_register: Register;
  concerns: Concern[];
  concern_register: Register;
  concern_categories: ConcernCategory[];
  closure_matrices: ClosureMatrix[];
  closure_matrix_register: Register;
  baselines: Baseline[];
  baseline_register: Register;
  artefact_states: ArtefactState[];
  change_records: ChangeRecord[];
  change_record_register: Register;
  analysis_pass_register: Register;
}

export interface LedgerStats {
  totalElements: number;
  sources: number;
  requirements: number;
  findings: number;
  gaps: number;
  risks: number;
  issues: number;
  traces: number;
  decisions: number;
  coverage: { covered: number; partial: number; notCovered: number; unknown: number };
  riskExposure: { high: number; medium: number; low: number };
  issueStatus: { open: number; inProgress: number; resolved: number; closed: number };
  gapResolution: { open: number; accepted: number; mitigated: number; closed: number };
  findingSeverity: { high: number; medium: number; low: number };
  domains: number;
  stakeholders: number;
  segments: number;
  registers: number;
}

export type ElementType = 
  | "Source" | "Finding" | "Gap" | "Requirement" | "Risk" | "Issue"
  | "Trace" | "Domain" | "Question" | "Answer" | "Assumption" | "Constraint"
  | "CandidateRequirement" | "Suggestion" | "Decision" | "CoverageItem"
  | "Rule" | "Evaluation" | "Violation" | "Stakeholder" | "NarrativeSummary"
  | "ZachmanCell" | "AnalysisPass" | "Register" | "Segment" | "SourceAtom"
  | "CellContentItem" | "CellRelationship" | "Checklist" | "StructuralRepresentation"
  | "ControlArtefact" | "Signal" | "Concern" | "ClosureMatrix" | "Baseline" | "ChangeRecord";

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_utc: string;
  ledger: CanonicalLedger | null;
}

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(1000).optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  created_utc: string;
  elementCount: number;
  hasLedger: boolean;
}

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdUtc: text("created_utc").notNull(),
  ledger: jsonb("ledger"),
  isActive: boolean("is_active").notNull().default(false),
});

export const insertDbProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertDbProject = z.infer<typeof insertDbProjectSchema>;
export type SelectDbProject = typeof projects.$inferSelect;
