import { pgTable, text, real, integer, serial, jsonb, boolean, index } from "drizzle-orm/pg-core";

export const ledgerInstances = pgTable("ledger_instances", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  version: text("version"),
  runId: text("run_id"),
  schemaId: text("schema_id"),
  rowTarget: text("row_target"),
  createdUtc: text("created_utc"),
  generator: jsonb("generator"),
}, (t) => [index("idx_ledger_project").on(t.projectId)]);

export const sources = pgTable("n_sources", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  sourceId: text("source_id").notNull(),
  sourceText: text("source_text"),
  segmentationContext: text("segmentation_context"),
  parentSourceRef: text("parent_source_ref"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_src_project").on(t.projectId)]);

export const segments = pgTable("n_segments", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  segmentId: text("segment_id").notNull(),
  title: text("title"),
  description: text("description"),
  segmentText: text("segment_text"),
  segmentIndex: integer("segment_index"),
  classification: text("classification"),
  sourceId: text("source_id"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_seg_project").on(t.projectId)]);

export const sourceAtoms = pgTable("n_source_atoms", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  atomId: text("atom_id").notNull(),
  segmentId: text("segment_id"),
  atomText: text("atom_text"),
  atomType: text("atom_type"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_atom_project").on(t.projectId)]);

export const findings = pgTable("n_findings", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  findingId: text("finding_id").notNull(),
  type: text("type"),
  description: text("description"),
  severity: text("severity"),
  producedByPassId: text("produced_by_pass_id"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_fnd_project").on(t.projectId)]);

export const gaps = pgTable("n_gaps", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  gapId: text("gap_id").notNull(),
  description: text("description"),
  impact: text("impact"),
  proposedResolution: text("proposed_resolution"),
  resolutionState: text("resolution_state"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_gap_project").on(t.projectId)]);

export const domains = pgTable("n_domains", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  domainId: text("domain_id").notNull(),
  name: text("name"),
  description: text("description"),
  parentDomainRef: text("parent_domain_ref"),
  classificationType: text("classification_type"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_dom_project").on(t.projectId)]);

export const requirements = pgTable("n_requirements", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  requirementId: text("requirement_id").notNull(),
  statement: text("statement"),
  requirementType: text("requirement_type"),
  rationale: text("rationale"),
  fitCriteria: text("fit_criteria"),
  verificationMethod: text("verification_method"),
  priority: text("priority"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_req_project").on(t.projectId)]);

export const risks = pgTable("n_risks", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  riskId: text("risk_id").notNull(),
  title: text("title"),
  description: text("description"),
  category: text("category"),
  likelihood: text("likelihood"),
  impact: text("impact"),
  exposure: text("exposure"),
  mitigation: text("mitigation"),
  owner: text("owner"),
  status: text("status"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_risk_project").on(t.projectId)]);

export const issues = pgTable("n_issues", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  issueId: text("issue_id").notNull(),
  title: text("title"),
  description: text("description"),
  severity: text("severity"),
  status: text("status"),
  resolutionSummary: text("resolution_summary"),
  owner: text("owner"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_iss_project").on(t.projectId)]);

export const traces = pgTable("n_traces", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  traceId: text("trace_id").notNull(),
  fromRef: text("from_ref"),
  toRef: text("to_ref"),
  traceType: text("trace_type"),
  rationale: text("rationale"),
  description: text("description"),
  confidence: real("confidence"),
  interpretationMagnitude: real("interpretation_magnitude"),
  extra: jsonb("extra"),
}, (t) => [index("idx_trc_project").on(t.projectId)]);

export const decisions = pgTable("n_decisions", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  decisionId: text("decision_id").notNull(),
  title: text("title"),
  description: text("description"),
  decisionType: text("decision_type"),
  status: text("status"),
  rationale: text("rationale"),
  decidedUtc: text("decided_utc"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_dec_project").on(t.projectId)]);

export const questions = pgTable("n_questions", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  questionId: text("question_id").notNull(),
  questionText: text("question_text"),
  context: text("context"),
  priority: text("priority"),
  status: text("status"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_qst_project").on(t.projectId)]);

export const answers = pgTable("n_answers", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  answerId: text("answer_id").notNull(),
  questionId: text("question_id"),
  responseText: text("response_text"),
  providedBy: text("provided_by"),
  providedUtc: text("provided_utc"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_ans_project").on(t.projectId)]);

export const assumptions = pgTable("n_assumptions", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  assumptionId: text("assumption_id").notNull(),
  statement: text("statement"),
  scope: text("scope"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_asm_project").on(t.projectId)]);

export const constraints = pgTable("n_constraints", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  constraintId: text("constraint_id").notNull(),
  statement: text("statement"),
  constraintType: text("constraint_type"),
  rationale: text("rationale"),
  priority: text("priority"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_con_project").on(t.projectId)]);

export const candidateRequirements = pgTable("n_candidate_requirements", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  candidateRequirementId: text("candidate_requirement_id").notNull(),
  statement: text("statement"),
  requirementType: text("requirement_type"),
  rationale: text("rationale"),
  fitCriteria: text("fit_criteria"),
  status: text("status"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_crq_project").on(t.projectId)]);

export const suggestions = pgTable("n_suggestions", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  suggestionId: text("suggestion_id").notNull(),
  description: text("description"),
  suggestionType: text("suggestion_type"),
  rationale: text("rationale"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_sug_project").on(t.projectId)]);

export const stakeholders = pgTable("n_stakeholders", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  stakeholderId: text("stakeholder_id").notNull(),
  name: text("name"),
  role: text("role"),
  description: text("description"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_stk_project").on(t.projectId)]);

export const coverageItems = pgTable("n_coverage_items", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  coverageId: text("coverage_id").notNull(),
  coverageType: text("coverage_type"),
  targetRef: text("target_ref"),
  coverageState: text("coverage_state"),
  producedByPassId: text("produced_by_pass_id"),
  notes: text("notes"),
  coverageStatement: text("coverage_statement"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cov_project").on(t.projectId)]);

export const rules = pgTable("n_rules", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  ruleId: text("rule_id").notNull(),
  name: text("name"),
  description: text("description"),
  ruleType: text("rule_type"),
  severityDefault: text("severity_default"),
  version: text("version"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_rul_project").on(t.projectId)]);

export const evaluations = pgTable("n_evaluations", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  evaluationId: text("evaluation_id").notNull(),
  evaluationType: text("evaluation_type"),
  scopeDescription: text("scope_description"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_evl_project").on(t.projectId)]);

export const violations = pgTable("n_violations", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  violationId: text("violation_id").notNull(),
  ruleId: text("rule_id"),
  checklistId: text("checklist_id"),
  description: text("description"),
  severity: text("severity"),
  producedByEvaluationId: text("produced_by_evaluation_id"),
  producedByPassId: text("produced_by_pass_id"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_vio_project").on(t.projectId)]);

export const zachmanCells = pgTable("n_zachman_cells", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  cellId: text("cell_id").notNull(),
  row: text("row"),
  column: text("col"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_zc_project").on(t.projectId)]);

export const cellContentItems = pgTable("n_cell_content_items", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  cellContentItemId: text("cell_content_item_id").notNull(),
  cellId: text("cell_id"),
  description: text("description"),
  meaningKey: text("meaning_key"),
  classificationType: text("classification_type"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cci_project").on(t.projectId)]);

export const cellRelationships = pgTable("n_cell_relationships", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  relationshipId: text("relationship_id").notNull(),
  fromCellId: text("from_cell_id"),
  toCellId: text("to_cell_id"),
  relationshipType: text("relationship_type"),
  description: text("description"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cr_project").on(t.projectId)]);

export const analysisPasses = pgTable("n_analysis_passes", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  passId: text("pass_id").notNull(),
  passType: text("pass_type"),
  evaluatedScope: text("evaluated_scope"),
  confidence: real("confidence"),
  coverageDeclaration: jsonb("coverage_declaration"),
  extra: jsonb("extra"),
}, (t) => [index("idx_ap_project").on(t.projectId)]);

export const narrativeSummaries = pgTable("n_narrative_summaries", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  summaryId: text("summary_id").notNull(),
  viewpoint: text("viewpoint"),
  scopeDescription: text("scope_description"),
  summaryText: text("summary_text"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_nar_project").on(t.projectId)]);

export const structuralRepresentations = pgTable("n_structural_representations", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  representationId: text("representation_id").notNull(),
  representationType: text("representation_type"),
  scopeDescription: text("scope_description"),
  content: text("content"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_sr_project").on(t.projectId)]);

export const controlArtefacts = pgTable("n_control_artefacts", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  artefactId: text("artefact_id").notNull(),
  artefactType: text("artefact_type"),
  name: text("name"),
  description: text("description"),
  state: text("state"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_ca_project").on(t.projectId)]);

export const signals = pgTable("n_signals", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  signalId: text("signal_id").notNull(),
  signalType: text("signal_type"),
  signalText: text("signal_text"),
  description: text("description"),
  sourceElementId: text("source_element_id"),
  priority: text("priority"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_sig_project").on(t.projectId)]);

export const concerns = pgTable("n_concerns", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  concernId: text("concern_id").notNull(),
  description: text("description"),
  concernCategory: text("concern_category"),
  raisedByStakeholderId: text("raised_by_stakeholder_id"),
  priority: text("priority"),
  status: text("status"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cnc_project").on(t.projectId)]);

export const closureMatrices = pgTable("n_closure_matrices", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  matrixId: text("matrix_id").notNull(),
  matrixType: text("matrix_type"),
  description: text("description"),
  closureStates: jsonb("closure_states"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cm_project").on(t.projectId)]);

export const baselines = pgTable("n_baselines", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  baselineId: text("baseline_id").notNull(),
  name: text("name"),
  description: text("description"),
  baselineType: text("baseline_type"),
  createdUtc: text("created_utc"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_bl_project").on(t.projectId)]);

export const changeRecords = pgTable("n_change_records", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  changeId: text("change_id").notNull(),
  changeType: text("change_type"),
  description: text("description"),
  beforeState: text("before_state"),
  afterState: text("after_state"),
  changedUtc: text("changed_utc"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_chg_project").on(t.projectId)]);

export const checklists = pgTable("n_checklists", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  checklistId: text("checklist_id").notNull(),
  name: text("name"),
  description: text("description"),
  checklistType: text("checklist_type"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cl_project").on(t.projectId)]);

export const registers = pgTable("n_registers", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  registerId: text("register_id").notNull(),
  registerType: text("register_type"),
  completenessRule: text("completeness_rule"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_reg_project").on(t.projectId)]);

export const artefactStates = pgTable("n_artefact_states", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  stateId: text("state_id").notNull(),
  description: text("description"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_as_project").on(t.projectId)]);

export const concernCategories = pgTable("n_concern_categories", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  categoryId: text("category_id").notNull(),
  name: text("name"),
  description: text("description"),
  confidence: real("confidence"),
  extra: jsonb("extra"),
}, (t) => [index("idx_cc_project").on(t.projectId)]);

export const elementRefs = pgTable("n_element_refs", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull(),
  sourceElementId: text("source_element_id").notNull(),
  targetElementId: text("target_element_id").notNull(),
  refType: text("ref_type").notNull(),
}, (t) => [
  index("idx_ref_project").on(t.projectId),
  index("idx_ref_source").on(t.sourceElementId),
  index("idx_ref_target").on(t.targetElementId),
  index("idx_ref_type").on(t.refType),
]);

export const nProjects = pgTable("n_projects", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdUtc: text("created_utc").notNull(),
  ledger: jsonb("ledger"),
  isActive: boolean("is_active").notNull().default(false),
}, (t) => [index("idx_nproj_pid").on(t.projectId)]);
