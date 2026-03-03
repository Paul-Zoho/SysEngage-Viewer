import { eq } from "drizzle-orm";
import type { CanonicalLedger } from "@shared/schema";
import * as ns from "../shared/neonSchema";

type NeonDb = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

const knownFields: Record<string, Set<string>> = {
  sources: new Set(["source_id", "source_text", "segmentation_context", "parent_source_ref", "confidence"]),
  segments: new Set(["segment_id", "title", "description", "segment_text", "segment_index", "classification", "source_id", "confidence"]),
  source_atoms: new Set(["atom_id", "segment_id", "atom_text", "atom_type", "confidence"]),
  findings: new Set(["finding_id", "type", "description", "severity", "produced_by_pass_id", "confidence"]),
  gaps: new Set(["gap_id", "description", "impact", "proposed_resolution", "resolution_state", "confidence"]),
  domains: new Set(["domain_id", "name", "description", "parent_domain_ref", "classification_type", "confidence"]),
  requirements: new Set(["requirement_id", "statement", "requirement_type", "rationale", "fit_criteria", "verification_method", "priority", "confidence"]),
  risks: new Set(["risk_id", "title", "description", "category", "likelihood", "impact", "exposure", "mitigation", "owner", "status", "confidence"]),
  issues: new Set(["issue_id", "title", "description", "severity", "status", "resolution_summary", "owner", "confidence"]),
  traces: new Set(["trace_id", "from_ref", "to_ref", "from_id", "to_id", "trace_type", "rationale", "description", "confidence", "interpretation_magnitude"]),
  decisions: new Set(["decision_id", "title", "description", "decision_type", "status", "rationale", "decided_utc", "confidence"]),
  questions: new Set(["question_id", "question_text", "context", "priority", "status", "confidence"]),
  answers: new Set(["answer_id", "question_id", "response_text", "provided_by", "provided_utc", "confidence"]),
  assumptions: new Set(["assumption_id", "statement", "scope", "confidence"]),
  constraints: new Set(["constraint_id", "statement", "constraint_type", "rationale", "priority", "confidence"]),
  candidate_requirements: new Set(["candidate_requirement_id", "statement", "requirement_type", "rationale", "fit_criteria", "status", "confidence"]),
  suggestions: new Set(["suggestion_id", "description", "suggestion_type", "rationale", "confidence"]),
  stakeholders: new Set(["stakeholder_id", "name", "role", "description", "confidence"]),
  coverage_items: new Set(["coverage_id", "coverage_item_id", "coverage_type", "target_ref", "target_id", "coverage_state", "produced_by_pass_id", "notes", "coverage_statement", "confidence"]),
  rules: new Set(["rule_id", "name", "description", "rule_type", "severity_default", "version", "confidence"]),
  evaluations: new Set(["evaluation_id", "evaluation_type", "scope_description", "confidence"]),
  violations: new Set(["violation_id", "rule_id", "checklist_id", "description", "severity", "produced_by_evaluation_id", "produced_by_pass_id", "confidence"]),
  zachman_cells: new Set(["cell_id", "row", "column", "confidence"]),
  cell_content_items: new Set(["cell_content_item_id", "ci_id", "cell_id", "description", "meaning_key", "classification_type", "confidence"]),
  cell_relationships: new Set(["relationship_id", "from_cell_id", "to_cell_id", "relationship_type", "description", "confidence"]),
  analysis_passes: new Set(["pass_id", "pass_type", "evaluated_scope", "confidence", "coverage_declaration"]),
  narrative_summaries: new Set(["summary_id", "narrative_summary_id", "viewpoint", "scope_description", "summary_text", "confidence"]),
  structural_representations: new Set(["representation_id", "structural_representation_id", "representation_type", "scope_description", "content", "confidence"]),
  control_artefacts: new Set(["artefact_id", "control_artefact_id", "artefact_type", "name", "description", "state", "confidence"]),
  signals: new Set(["signal_id", "signal_type", "signal_text", "description", "source_element_id", "priority", "confidence"]),
  concerns: new Set(["concern_id", "description", "concern_category", "raised_by_stakeholder_id", "priority", "status", "confidence"]),
  closure_matrices: new Set(["matrix_id", "matrix_type", "description", "closure_states", "confidence"]),
  baselines: new Set(["baseline_id", "name", "description", "baseline_type", "created_utc", "confidence"]),
  change_records: new Set(["change_id", "change_type", "description", "before_state", "after_state", "changed_utc", "confidence"]),
  checklists: new Set(["checklist_id", "name", "description", "checklist_type", "confidence"]),
};

const refFieldsToExtract: Record<string, string> = {
  source_refs: "source_ref",
  domain_refs: "domain_ref",
  related_element_ids: "related",
  affected_element_ids: "affected",
  produced_from_finding_ids: "produced_from",
  target_element_ids: "targets",
  related_gap_ids: "related_gap",
  evidence_ids: "evidence",
  checklist_ids: "checklist_ref",
  rule_ids: "rule_ref",
  produced_finding_ids: "produced_finding",
  produced_gap_ids: "produced_gap",
  produced_suggestion_ids: "produced_suggestion",
  produced_coverage_ids: "produced_coverage",
  evaluation_ids: "evaluation_ref",
  item_ids: "item_ref",
  applies_to_element_types: "applies_to",
  obligation_rules_ref: "obligation_rule",
  element_ids: "member",
  concern_refs: "concern_ref",
  row_element_ids: "row_element",
  column_element_ids: "column_element",
  supporting_signal_refs: "supporting_signal",
  supporting_cellcontent_refs: "supporting_cellcontent",
  cell_content_refs: "cell_content_ref",
};

function extractExtra(element: any, knownSet: Set<string>): Record<string, any> | null {
  const extra: Record<string, any> = {};
  let hasExtra = false;
  for (const [key, value] of Object.entries(element)) {
    if (key === "id") continue;
    if (knownSet.has(key)) continue;
    if (refFieldsToExtract[key]) continue;
    extra[key] = value;
    hasExtra = true;
  }
  return hasExtra ? extra : null;
}

function extractRefs(element: any, elementId: string, projectId: string): { sourceElementId: string; targetElementId: string; refType: string; projectId: string }[] {
  const refs: { sourceElementId: string; targetElementId: string; refType: string; projectId: string }[] = [];

  for (const [field, refType] of Object.entries(refFieldsToExtract)) {
    const value = element[field];
    if (Array.isArray(value)) {
      for (const targetId of value) {
        if (typeof targetId === "string" && targetId) {
          refs.push({ sourceElementId: elementId, targetElementId: targetId, refType, projectId });
        }
      }
    }
  }

  if (element.question_id && element.answer_id) {
    refs.push({ sourceElementId: element.answer_id, targetElementId: element.question_id, refType: "answers", projectId });
  }

  return refs;
}

export async function importLedgerToNeon(db: NeonDb, projectId: string, ledger: CanonicalLedger): Promise<{ success: boolean; counts: Record<string, number>; error?: string }> {
  const counts: Record<string, number> = {};
  const allRefs: { sourceElementId: string; targetElementId: string; refType: string; projectId: string }[] = [];

  try {
    return await db.transaction(async (tx: any) => {
    const allTables = [
      ns.elementRefs, ns.ledgerInstances, ns.sources, ns.segments, ns.sourceAtoms,
      ns.findings, ns.gaps, ns.domains, ns.requirements, ns.risks, ns.issues,
      ns.traces, ns.decisions, ns.questions, ns.answers, ns.assumptions,
      ns.constraints, ns.candidateRequirements, ns.suggestions, ns.stakeholders,
      ns.coverageItems, ns.rules, ns.evaluations, ns.violations,
      ns.zachmanCells, ns.cellContentItems, ns.cellRelationships,
      ns.analysisPasses, ns.narrativeSummaries, ns.structuralRepresentations,
      ns.controlArtefacts, ns.signals, ns.concerns, ns.closureMatrices,
      ns.baselines, ns.changeRecords, ns.checklists, ns.registers,
      ns.artefactStates, ns.concernCategories,
    ];
    for (const table of allTables) {
      await tx.delete(table).where(eq(table.projectId, projectId));
    }

    await tx.insert(ns.ledgerInstances).values({
      projectId,
      version: ledger.version || (ledger as any).sysengage_ledger_version,
      runId: (ledger as any).run_id,
      schemaId: (ledger as any).schema_id,
      rowTarget: (ledger as any).row_target,
      createdUtc: ledger.created_utc,
      generator: (ledger as any).generator || null,
    });

    const insertBatch = async <T extends Record<string, any>>(
      table: any,
      items: any[],
      collectionKey: string,
      mapFn: (item: any) => T
    ) => {
      if (!items || items.length === 0) return;
      const rows = items.map(item => {
        const row = mapFn(item);
        return row;
      });
      const BATCH_SIZE = 100;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        await tx.insert(table).values(rows.slice(i, i + BATCH_SIZE));
      }
      counts[collectionKey] = items.length;
    }

    await insertBatch(ns.sources, ledger.sources, "sources", (s: any) => {
      allRefs.push(...extractRefs(s, s.source_id, projectId));
      return { projectId, sourceId: s.source_id, sourceText: s.source_text, segmentationContext: s.segmentation_context, parentSourceRef: s.parent_source_ref, confidence: s.confidence, extra: extractExtra(s, knownFields.sources) };
    });

    await insertBatch(ns.segments, ledger.segments, "segments", (s: any) => {
      allRefs.push(...extractRefs(s, s.segment_id, projectId));
      return { projectId, segmentId: s.segment_id, title: s.title, description: s.description, segmentText: s.segment_text, segmentIndex: s.segment_index, classification: s.classification, sourceId: s.source_id, confidence: s.confidence, extra: extractExtra(s, knownFields.segments) };
    });

    await insertBatch(ns.sourceAtoms, ledger.source_atoms, "source_atoms", (a: any) => {
      allRefs.push(...extractRefs(a, a.atom_id, projectId));
      return { projectId, atomId: a.atom_id, segmentId: a.segment_id, atomText: a.atom_text, atomType: a.atom_type, confidence: a.confidence, extra: extractExtra(a, knownFields.source_atoms) };
    });

    await insertBatch(ns.findings, ledger.findings, "findings", (f: any) => {
      allRefs.push(...extractRefs(f, f.finding_id, projectId));
      return { projectId, findingId: f.finding_id, type: f.type, description: f.description, severity: f.severity, producedByPassId: f.produced_by_pass_id, confidence: f.confidence, extra: extractExtra(f, knownFields.findings) };
    });

    await insertBatch(ns.gaps, ledger.gaps, "gaps", (g: any) => {
      allRefs.push(...extractRefs(g, g.gap_id, projectId));
      return { projectId, gapId: g.gap_id, description: g.description, impact: g.impact, proposedResolution: g.proposed_resolution, resolutionState: g.resolution_state, confidence: g.confidence || null, extra: extractExtra(g, knownFields.gaps) };
    });

    await insertBatch(ns.domains, ledger.domains, "domains", (d: any) => {
      allRefs.push(...extractRefs(d, d.domain_id, projectId));
      return { projectId, domainId: d.domain_id, name: d.name, description: d.description, parentDomainRef: d.parent_domain_ref, classificationType: d.classification_type, confidence: d.confidence, extra: extractExtra(d, knownFields.domains) };
    });

    await insertBatch(ns.requirements, ledger.requirements, "requirements", (r: any) => {
      allRefs.push(...extractRefs(r, r.requirement_id, projectId));
      return { projectId, requirementId: r.requirement_id, statement: r.statement, requirementType: r.requirement_type, rationale: r.rationale, fitCriteria: r.fit_criteria, verificationMethod: r.verification_method, priority: r.priority, confidence: r.confidence, extra: extractExtra(r, knownFields.requirements) };
    });

    await insertBatch(ns.risks, ledger.risks, "risks", (r: any) => {
      allRefs.push(...extractRefs(r, r.risk_id, projectId));
      return { projectId, riskId: r.risk_id, title: r.title, description: r.description, category: r.category, likelihood: r.likelihood, impact: r.impact, exposure: r.exposure, mitigation: r.mitigation, owner: r.owner, status: r.status, confidence: r.confidence, extra: extractExtra(r, knownFields.risks) };
    });

    await insertBatch(ns.issues, ledger.issues, "issues", (i: any) => {
      allRefs.push(...extractRefs(i, i.issue_id, projectId));
      return { projectId, issueId: i.issue_id, title: i.title, description: i.description, severity: i.severity, status: i.status, resolutionSummary: i.resolution_summary, owner: i.owner, confidence: i.confidence, extra: extractExtra(i, knownFields.issues) };
    });

    await insertBatch(ns.traces, ledger.traces, "traces", (t: any) => {
      const fromRef = t.from_ref || t.from_id || "";
      const toRef = t.to_ref || t.to_id || "";
      if (fromRef && toRef) {
        allRefs.push({ sourceElementId: fromRef, targetElementId: toRef, refType: `trace:${t.trace_type || "GT"}`, projectId });
      }
      return { projectId, traceId: t.trace_id, fromRef, toRef, traceType: t.trace_type, rationale: t.rationale, description: t.description, confidence: t.confidence, interpretationMagnitude: t.interpretation_magnitude, extra: extractExtra(t, knownFields.traces) };
    });

    await insertBatch(ns.decisions, ledger.decisions, "decisions", (d: any) => {
      allRefs.push(...extractRefs(d, d.decision_id, projectId));
      return { projectId, decisionId: d.decision_id, title: d.title, description: d.description, decisionType: d.decision_type, status: d.status, rationale: d.rationale, decidedUtc: d.decided_utc, confidence: d.confidence, extra: extractExtra(d, knownFields.decisions) };
    });

    await insertBatch(ns.questions, ledger.questions, "questions", (q: any) => {
      allRefs.push(...extractRefs(q, q.question_id, projectId));
      return { projectId, questionId: q.question_id, questionText: q.question_text, context: q.context, priority: q.priority, status: q.status, confidence: q.confidence, extra: extractExtra(q, knownFields.questions) };
    });

    await insertBatch(ns.answers, ledger.answers, "answers", (a: any) => {
      allRefs.push(...extractRefs(a, a.answer_id, projectId));
      return { projectId, answerId: a.answer_id, questionId: a.question_id, responseText: a.response_text, providedBy: a.provided_by, providedUtc: a.provided_utc, confidence: a.confidence, extra: extractExtra(a, knownFields.answers) };
    });

    await insertBatch(ns.assumptions, ledger.assumptions, "assumptions", (a: any) => {
      allRefs.push(...extractRefs(a, a.assumption_id, projectId));
      return { projectId, assumptionId: a.assumption_id, statement: a.statement, scope: a.scope, confidence: a.confidence, extra: extractExtra(a, knownFields.assumptions) };
    });

    await insertBatch(ns.constraints, ledger.constraints, "constraints", (c: any) => {
      allRefs.push(...extractRefs(c, c.constraint_id, projectId));
      return { projectId, constraintId: c.constraint_id, statement: c.statement, constraintType: c.constraint_type, rationale: c.rationale, priority: c.priority, confidence: c.confidence, extra: extractExtra(c, knownFields.constraints) };
    });

    await insertBatch(ns.candidateRequirements, ledger.candidate_requirements, "candidate_requirements", (c: any) => {
      allRefs.push(...extractRefs(c, c.candidate_requirement_id, projectId));
      return { projectId, candidateRequirementId: c.candidate_requirement_id, statement: c.statement, requirementType: c.requirement_type, rationale: c.rationale, fitCriteria: c.fit_criteria, status: c.status, confidence: c.confidence, extra: extractExtra(c, knownFields.candidate_requirements) };
    });

    await insertBatch(ns.suggestions, ledger.suggestions, "suggestions", (s: any) => {
      allRefs.push(...extractRefs(s, s.suggestion_id, projectId));
      return { projectId, suggestionId: s.suggestion_id, description: s.description, suggestionType: s.suggestion_type, rationale: s.rationale, confidence: s.confidence, extra: extractExtra(s, knownFields.suggestions) };
    });

    await insertBatch(ns.stakeholders, ledger.stakeholders, "stakeholders", (s: any) => {
      allRefs.push(...extractRefs(s, s.stakeholder_id, projectId));
      return { projectId, stakeholderId: s.stakeholder_id, name: s.name, role: s.role, description: s.description, confidence: s.confidence, extra: extractExtra(s, knownFields.stakeholders) };
    });

    await insertBatch(ns.coverageItems, ledger.coverage_items, "coverage_items", (c: any) => {
      const covId = c.coverage_id || c.coverage_item_id;
      allRefs.push(...extractRefs(c, covId, projectId));
      return { projectId, coverageId: covId, coverageType: c.coverage_type, targetRef: c.target_ref || c.target_id, coverageState: c.coverage_state || c.row1_relevance, producedByPassId: c.produced_by_pass_id, notes: c.notes, coverageStatement: c.coverage_statement, confidence: c.confidence, extra: extractExtra(c, knownFields.coverage_items) };
    });

    await insertBatch(ns.rules, ledger.rules, "rules", (r: any) => {
      allRefs.push(...extractRefs(r, r.rule_id, projectId));
      return { projectId, ruleId: r.rule_id, name: r.name, description: r.description, ruleType: r.rule_type, severityDefault: r.severity_default, version: r.version, confidence: r.confidence, extra: extractExtra(r, knownFields.rules) };
    });

    await insertBatch(ns.evaluations, ledger.evaluations, "evaluations", (e: any) => {
      allRefs.push(...extractRefs(e, e.evaluation_id, projectId));
      return { projectId, evaluationId: e.evaluation_id, evaluationType: e.evaluation_type, scopeDescription: e.scope_description, confidence: e.confidence, extra: extractExtra(e, knownFields.evaluations) };
    });

    await insertBatch(ns.violations, ledger.violations, "violations", (v: any) => {
      allRefs.push(...extractRefs(v, v.violation_id, projectId));
      return { projectId, violationId: v.violation_id, ruleId: v.rule_id, checklistId: v.checklist_id, description: v.description, severity: v.severity, producedByEvaluationId: v.produced_by_evaluation_id, producedByPassId: v.produced_by_pass_id, confidence: v.confidence, extra: extractExtra(v, knownFields.violations) };
    });

    await insertBatch(ns.zachmanCells, ledger.zachman_cells, "zachman_cells", (z: any) => {
      allRefs.push(...extractRefs(z, z.cell_id, projectId));
      return { projectId, cellId: z.cell_id, row: z.row, column: z.column, confidence: z.confidence || null, extra: extractExtra(z, knownFields.zachman_cells) };
    });

    const validCCI = (ledger.cell_content_items || []).filter((c: any) => c.cell_content_item_id || c.ci_id || c.id);
    await insertBatch(ns.cellContentItems, validCCI, "cell_content_items", (c: any) => {
      const cciId = c.cell_content_item_id || c.ci_id || c.id;
      allRefs.push(...extractRefs(c, cciId, projectId));
      return { projectId, cellContentItemId: cciId, cellId: c.cell_id, description: c.description, meaningKey: c.meaning_key, classificationType: c.classification_type, confidence: c.confidence, extra: extractExtra(c, knownFields.cell_content_items) };
    });

    await insertBatch(ns.cellRelationships, ledger.cell_relationships, "cell_relationships", (c: any) => {
      allRefs.push(...extractRefs(c, c.relationship_id, projectId));
      return { projectId, relationshipId: c.relationship_id, fromCellId: c.from_cell_id, toCellId: c.to_cell_id, relationshipType: c.relationship_type, description: c.description, confidence: c.confidence, extra: extractExtra(c, knownFields.cell_relationships) };
    });

    await insertBatch(ns.analysisPasses, ledger.analysis_passes, "analysis_passes", (a: any) => {
      allRefs.push(...extractRefs(a, a.pass_id, projectId));
      return { projectId, passId: a.pass_id, passType: a.pass_type, evaluatedScope: a.evaluated_scope, confidence: a.confidence, coverageDeclaration: a.coverage_declaration || null, extra: extractExtra(a, knownFields.analysis_passes) };
    });

    await insertBatch(ns.narrativeSummaries, ledger.narrative_summaries, "narrative_summaries", (n: any) => {
      const nId = n.summary_id || n.narrative_summary_id;
      allRefs.push(...extractRefs(n, nId, projectId));
      return { projectId, summaryId: nId, viewpoint: n.viewpoint, scopeDescription: n.scope_description, summaryText: n.summary_text, confidence: n.confidence, extra: extractExtra(n, knownFields.narrative_summaries) };
    });

    await insertBatch(ns.structuralRepresentations, ledger.structural_representations, "structural_representations", (s: any) => {
      const sId = s.representation_id || s.structural_representation_id;
      allRefs.push(...extractRefs(s, sId, projectId));
      return { projectId, representationId: sId, representationType: s.representation_type, scopeDescription: s.scope_description, content: s.content, confidence: s.confidence, extra: extractExtra(s, knownFields.structural_representations) };
    });

    await insertBatch(ns.controlArtefacts, ledger.control_artefacts, "control_artefacts", (c: any) => {
      const cId = c.artefact_id || c.control_artefact_id;
      allRefs.push(...extractRefs(c, cId, projectId));
      return { projectId, artefactId: cId, artefactType: c.artefact_type, name: c.name, description: c.description, state: c.state, confidence: c.confidence, extra: extractExtra(c, knownFields.control_artefacts) };
    });

    await insertBatch(ns.signals, ledger.signals, "signals", (s: any) => {
      allRefs.push(...extractRefs(s, s.signal_id, projectId));
      return { projectId, signalId: s.signal_id, signalType: s.signal_type, signalText: s.signal_text, description: s.description, sourceElementId: s.source_element_id, priority: s.priority, confidence: s.confidence, extra: extractExtra(s, knownFields.signals) };
    });

    await insertBatch(ns.concerns, ledger.concerns, "concerns", (c: any) => {
      allRefs.push(...extractRefs(c, c.concern_id, projectId));
      return { projectId, concernId: c.concern_id, description: c.description, concernCategory: c.concern_category, raisedByStakeholderId: c.raised_by_stakeholder_id, priority: c.priority, status: c.status, confidence: c.confidence, extra: extractExtra(c, knownFields.concerns) };
    });

    await insertBatch(ns.closureMatrices, ledger.closure_matrices, "closure_matrices", (c: any) => {
      allRefs.push(...extractRefs(c, c.matrix_id, projectId));
      return { projectId, matrixId: c.matrix_id, matrixType: c.matrix_type, description: c.description, closureStates: c.closure_states || null, confidence: c.confidence, extra: extractExtra(c, knownFields.closure_matrices) };
    });

    await insertBatch(ns.baselines, ledger.baselines, "baselines", (b: any) => {
      allRefs.push(...extractRefs(b, b.baseline_id, projectId));
      return { projectId, baselineId: b.baseline_id, name: b.name, description: b.description, baselineType: b.baseline_type, createdUtc: b.created_utc, confidence: b.confidence, extra: extractExtra(b, knownFields.baselines) };
    });

    await insertBatch(ns.changeRecords, ledger.change_records, "change_records", (c: any) => {
      allRefs.push(...extractRefs(c, c.change_id, projectId));
      return { projectId, changeId: c.change_id, changeType: c.change_type, description: c.description, beforeState: c.before_state, afterState: c.after_state, changedUtc: c.changed_utc, confidence: c.confidence, extra: extractExtra(c, knownFields.change_records) };
    });

    await insertBatch(ns.checklists, ledger.checklists, "checklists", (c: any) => {
      allRefs.push(...extractRefs(c, c.checklist_id, projectId));
      return { projectId, checklistId: c.checklist_id, name: c.name, description: c.description, checklistType: c.checklist_type, confidence: c.confidence, extra: extractExtra(c, knownFields.checklists) };
    });

    const l = ledger as any;
    const registerCollections = [
      l.source_register, l.findings_register, l.finding_register, l.gap_register,
      l.domain_register, l.requirement_register, l.risk_register, l.active_risk_register,
      l.issue_register, l.trace_register, l.decision_register,
      l.question_register, l.answer_register, l.assumption_register,
      l.constraint_register, l.candidate_requirement_register,
      l.suggestion_register, l.stakeholder_register,
      l.coverage_register, l.rule_register, l.evaluation_register,
      l.violation_register, l.zachman_cell_register,
      l.analysis_pass_register, l.narrative_summary_register,
      l.segment_register, l.source_atom_register,
      l.cell_content_item_register, l.cell_relationship_register,
      l.checklist_register, l.structural_representation_register,
      l.control_artefact_register, l.signal_register,
      l.concern_register, l.closure_matrix_register,
      l.baseline_register, l.change_record_register,
    ].filter((r: any) => r && r.register_id);

    if (registerCollections.length > 0) {
      const regRows = registerCollections.map((r: any) => {
        if (r.member_ids) {
          for (const memberId of r.member_ids) {
            allRefs.push({ sourceElementId: r.register_id, targetElementId: memberId, refType: "member", projectId });
          }
        }
        return { projectId, registerId: r.register_id, registerType: r.register_type, completenessRule: r.completeness_rule, confidence: r.confidence || null, extra: null };
      });
      const BATCH_SIZE = 100;
      for (let i = 0; i < regRows.length; i += BATCH_SIZE) {
        await tx.insert(ns.registers).values(regRows.slice(i, i + BATCH_SIZE));
      }
      counts.registers = regRows.length;
    }

    const ledgerAny = ledger as any;
    if (ledgerAny.artefact_states && ledgerAny.artefact_states.length > 0) {
      const rows = ledgerAny.artefact_states.map((a: any) => ({
        projectId, stateId: a.state_id || a.artefact_state_id || a.id, description: a.description, confidence: a.confidence || null, extra: null,
      })).filter((r: any) => r.stateId);
      if (rows.length > 0) {
        await tx.insert(ns.artefactStates).values(rows);
        counts.artefact_states = rows.length;
      }
    }

    if (ledgerAny.concern_categories && ledgerAny.concern_categories.length > 0) {
      const rows = ledgerAny.concern_categories.map((c: any) => ({
        projectId, categoryId: c.category_id || c.concern_category_id || c.id, name: c.name, description: c.description, confidence: c.confidence || null, extra: null,
      })).filter((r: any) => r.categoryId);
      if (rows.length > 0) {
        await tx.insert(ns.concernCategories).values(rows);
        counts.concern_categories = rows.length;
      }
    }

    if (allRefs.length > 0) {
      const BATCH_SIZE = 200;
      for (let i = 0; i < allRefs.length; i += BATCH_SIZE) {
        await tx.insert(ns.elementRefs).values(allRefs.slice(i, i + BATCH_SIZE));
      }
      counts.element_refs = allRefs.length;
    }

    return { success: true, counts };
    });
  } catch (error: any) {
    console.error("[Neon Import] Error:", error.message);
    return { success: false, counts, error: error.message };
  }
}
