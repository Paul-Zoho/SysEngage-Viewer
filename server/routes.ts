import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { parseLedgerMarkdown, parseJsonLedger } from "./ledgerParser";
import { getNeonDb } from "./neonDb";
import { importLedgerToNeon } from "./neonImport";
import * as neonStorage from "./neonStorage";

async function neonQuery<T>(projectId: string, fn: (db: any, pid: string) => Promise<T>): Promise<T | null> {
  const db = getNeonDb();
  if (!db) return null;
  try {
    return await fn(db, projectId);
  } catch (e: any) {
    console.error("[Neon] Query failed, falling back to JSONB:", e.message);
    return null;
  }
}

async function getActiveProjectId(): Promise<string> {
  return storage.getActiveProjectId();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/ledger", async (_req, res) => {
    res.json(await storage.getLedger());
  });

  app.get("/api/ledger/stats", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, neonStorage.getStats);
    if (neonResult) return res.json(neonResult);
    res.json(await storage.getLedgerStats());
  });

  app.get("/api/ledger/sources", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "sources"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.sources ?? []);
  });

  app.get("/api/ledger/requirements", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "requirements"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.requirements ?? []);
  });

  app.get("/api/ledger/findings", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "findings"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.findings ?? []);
  });

  app.get("/api/ledger/gaps", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "gaps"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.gaps ?? []);
  });

  app.get("/api/ledger/risks", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "risks"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.risks ?? []);
  });

  app.get("/api/ledger/issues", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "issues"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.issues ?? []);
  });

  app.get("/api/ledger/traces", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "traces"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.traces ?? []);
  });

  app.get("/api/ledger/decisions", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "decisions"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.decisions ?? []);
  });

  app.get("/api/ledger/domains", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "domains"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.domains ?? []);
  });

  app.get("/api/ledger/coverage", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "coverage_items"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.coverage_items ?? []);
  });

  app.get("/api/ledger/rules", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "rules"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.rules ?? []);
  });

  app.get("/api/ledger/questions", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "questions"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.questions ?? []);
  });

  app.get("/api/ledger/assumptions", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "assumptions"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.assumptions ?? []);
  });

  app.get("/api/ledger/constraints", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "constraints"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.constraints ?? []);
  });

  app.get("/api/ledger/stakeholders", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "stakeholders"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.stakeholders ?? []);
  });

  app.get("/api/ledger/segments", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getCollection(db, p, "segments"));
    if (neonResult) return res.json(neonResult);
    const ledger = await storage.getLedger();
    res.json(ledger?.segments ?? []);
  });

  app.get("/api/ledger/element/:id", async (req, res) => {
    const pid = await getActiveProjectId();
    const elementId = req.params.id;

    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getElementById(db, p, elementId));
    if (neonResult) return res.json(neonResult);

    const ledger = await storage.getLedger();
    if (!ledger) return res.status(404).json({ error: "No ledger" });

    const collectionMap: Record<string, { array: any[]; type: string; idField: string }> = {
      sources: { array: ledger.sources, type: "Source", idField: "source_id" },
      domains: { array: ledger.domains, type: "Domain", idField: "domain_id" },
      findings: { array: ledger.findings, type: "Finding", idField: "finding_id" },
      gaps: { array: ledger.gaps, type: "Gap", idField: "gap_id" },
      requirements: { array: ledger.requirements, type: "Requirement", idField: "requirement_id" },
      risks: { array: ledger.risks, type: "Risk", idField: "risk_id" },
      issues: { array: ledger.issues, type: "Issue", idField: "issue_id" },
      traces: { array: ledger.traces, type: "Trace", idField: "trace_id" },
      decisions: { array: ledger.decisions, type: "Decision", idField: "decision_id" },
      questions: { array: ledger.questions, type: "Question", idField: "question_id" },
      answers: { array: ledger.answers, type: "Answer", idField: "answer_id" },
      assumptions: { array: ledger.assumptions, type: "Assumption", idField: "assumption_id" },
      constraints: { array: ledger.constraints, type: "Constraint", idField: "constraint_id" },
      suggestions: { array: ledger.suggestions, type: "Suggestion", idField: "suggestion_id" },
      stakeholders: { array: ledger.stakeholders, type: "Stakeholder", idField: "stakeholder_id" },
      coverage_items: { array: ledger.coverage_items, type: "CoverageItem", idField: "coverage_item_id" },
      rules: { array: ledger.rules, type: "Rule", idField: "rule_id" },
      evaluations: { array: ledger.evaluations, type: "Evaluation", idField: "evaluation_id" },
      violations: { array: ledger.violations, type: "Violation", idField: "violation_id" },
      signals: { array: ledger.signals, type: "Signal", idField: "signal_id" },
      concerns: { array: ledger.concerns, type: "Concern", idField: "concern_id" },
      candidate_requirements: { array: ledger.candidate_requirements, type: "CandidateRequirement", idField: "candidate_requirement_id" },
      zachman_cells: { array: ledger.zachman_cells, type: "ZachmanCell", idField: "cell_id" },
      cell_content_items: { array: ledger.cell_content_items, type: "CellContentItem", idField: "cell_content_item_id" },
      narrative_summaries: { array: ledger.narrative_summaries, type: "NarrativeSummary", idField: "narrative_summary_id" },
      structural_representations: { array: ledger.structural_representations, type: "StructuralRepresentation", idField: "structural_representation_id" },
      control_artefacts: { array: ledger.control_artefacts, type: "ControlArtefact", idField: "control_artefact_id" },
      segments: { array: ledger.segments, type: "Segment", idField: "segment_id" },
      source_atoms: { array: ledger.source_atoms, type: "SourceAtom", idField: "atom_id" },
      change_records: { array: ledger.change_records, type: "ChangeRecord", idField: "change_id" },
      baselines: { array: ledger.baselines, type: "Baseline", idField: "baseline_id" },
      analysis_passes: { array: ledger.analysis_passes, type: "AnalysisPass", idField: "pass_id" },
    };

    for (const [, col] of Object.entries(collectionMap)) {
      const found = col.array.find((el: any) => el.id === elementId || el[col.idField] === elementId);
      if (found) {
        return res.json({ element: found, type: col.type });
      }
    }

    return res.status(404).json({ error: "Element not found" });
  });

  app.get("/api/ledger/elements/batch", async (req, res) => {
    const pid = await getActiveProjectId();
    const idsParam = req.query.ids as string;
    if (!idsParam) return res.json({ elements: {} });
    const ids = idsParam.split(",").map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return res.json({ elements: {} });

    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getElementsByIds(db, p, ids));
    if (neonResult && Object.keys(neonResult).length > 0) return res.json({ elements: neonResult });

    const ledger = await storage.getLedger();
    if (!ledger) return res.json({ elements: {} });

    const collections: { array: any[]; type: string; idField: string }[] = [
      { array: ledger.sources, type: "Source", idField: "source_id" },
      { array: ledger.domains, type: "Domain", idField: "domain_id" },
      { array: ledger.findings, type: "Finding", idField: "finding_id" },
      { array: ledger.gaps, type: "Gap", idField: "gap_id" },
      { array: ledger.requirements, type: "Requirement", idField: "requirement_id" },
      { array: ledger.risks, type: "Risk", idField: "risk_id" },
      { array: ledger.issues, type: "Issue", idField: "issue_id" },
      { array: ledger.traces, type: "Trace", idField: "trace_id" },
      { array: ledger.decisions, type: "Decision", idField: "decision_id" },
      { array: ledger.questions, type: "Question", idField: "question_id" },
      { array: ledger.answers, type: "Answer", idField: "answer_id" },
      { array: ledger.assumptions, type: "Assumption", idField: "assumption_id" },
      { array: ledger.constraints, type: "Constraint", idField: "constraint_id" },
      { array: ledger.suggestions, type: "Suggestion", idField: "suggestion_id" },
      { array: ledger.stakeholders, type: "Stakeholder", idField: "stakeholder_id" },
      { array: ledger.coverage_items, type: "CoverageItem", idField: "coverage_item_id" },
      { array: ledger.rules, type: "Rule", idField: "rule_id" },
      { array: ledger.evaluations, type: "Evaluation", idField: "evaluation_id" },
      { array: ledger.violations, type: "Violation", idField: "violation_id" },
      { array: ledger.signals, type: "Signal", idField: "signal_id" },
      { array: ledger.concerns, type: "Concern", idField: "concern_id" },
      { array: ledger.candidate_requirements, type: "CandidateRequirement", idField: "candidate_requirement_id" },
      { array: ledger.zachman_cells, type: "ZachmanCell", idField: "cell_id" },
      { array: ledger.cell_content_items, type: "CellContentItem", idField: "cell_content_item_id" },
      { array: ledger.narrative_summaries, type: "NarrativeSummary", idField: "narrative_summary_id" },
      { array: ledger.structural_representations, type: "StructuralRepresentation", idField: "structural_representation_id" },
      { array: ledger.control_artefacts, type: "ControlArtefact", idField: "control_artefact_id" },
      { array: ledger.segments, type: "Segment", idField: "segment_id" },
      { array: ledger.source_atoms, type: "SourceAtom", idField: "atom_id" },
      { array: ledger.change_records, type: "ChangeRecord", idField: "change_id" },
      { array: ledger.baselines, type: "Baseline", idField: "baseline_id" },
      { array: ledger.analysis_passes, type: "AnalysisPass", idField: "pass_id" },
    ];

    const idSet = new Set(ids);
    const result: Record<string, { element: any; type: string }> = {};

    for (const col of collections) {
      for (const el of col.array) {
        const elId = el.id || el[col.idField];
        if (elId && idSet.has(elId) && !result[elId]) {
          result[elId] = { element: el, type: col.type };
        }
      }
    }

    res.json({ elements: result });
  });

  app.get("/api/ledger/relationships", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, neonStorage.getRelationships);
    if (neonResult && neonResult.nodes.length > 0) return res.json(neonResult);

    const ledger = await storage.getLedger();
    if (!ledger) return res.json({ nodes: [], edges: [] });

    interface RelNode { id: string; type: string; title: string }
    interface RelEdge { from: string; to: string; relationship: string; detail?: string }

    const nodeMap = new Map<string, RelNode>();
    const edges: RelEdge[] = [];

    function addNode(id: string, type: string, title: string) {
      if (id && !nodeMap.has(id)) nodeMap.set(id, { id, type, title });
    }

    function addEdge(from: string, to: string, relationship: string, detail?: string) {
      if (from && to) edges.push({ from, to, relationship, detail });
    }

    ledger.sources.forEach(s => addNode(s.source_id || (s as any).id, "Source", (s as any).title || s.source_text?.slice(0, 60) || s.source_id));
    ledger.findings.forEach(f => addNode(f.finding_id, "Finding", f.description?.slice(0, 60) || f.finding_id));
    ledger.gaps.forEach(g => addNode(g.gap_id, "Gap", g.description?.slice(0, 60) || g.gap_id));
    ledger.domains.forEach(d => addNode(d.domain_id, "Domain", d.name || d.domain_id));
    ledger.requirements.forEach(r => addNode(r.requirement_id, "Requirement", (r as any).title || r.statement?.slice(0, 60) || r.requirement_id));
    ledger.risks.forEach(r => addNode(r.risk_id, "Risk", r.title || r.risk_id));
    ledger.issues.forEach(i => addNode(i.issue_id, "Issue", i.title || i.issue_id));
    ledger.questions.forEach(q => addNode(q.question_id, "Question", q.question_text?.slice(0, 60) || q.question_id));
    ledger.answers.forEach(a => addNode(a.answer_id, "Answer", a.response_text?.slice(0, 60) || a.answer_id));
    ledger.assumptions.forEach(a => addNode(a.assumption_id, "Assumption", a.statement?.slice(0, 60) || a.assumption_id));
    ledger.constraints.forEach(c => addNode(c.constraint_id, "Constraint", c.statement?.slice(0, 60) || c.constraint_id));
    ledger.candidate_requirements.forEach(c => addNode(c.candidate_requirement_id, "CandidateRequirement", c.statement?.slice(0, 60) || c.candidate_requirement_id));
    ledger.suggestions.forEach(s => addNode(s.suggestion_id, "Suggestion", s.description?.slice(0, 60) || s.suggestion_id));
    ledger.decisions.forEach(d => addNode(d.decision_id, "Decision", d.title || d.decision_id));
    ledger.traces.forEach(t => addNode(t.trace_id, "Trace", t.rationale?.slice(0, 60) || t.trace_id));
    ledger.zachman_cells.forEach(z => addNode(z.cell_id, "ZachmanCell", `${z.row}/${z.column}` || z.cell_id));
    ledger.coverage_items.forEach(c => addNode(c.coverage_id, "CoverageItem", c.coverage_type || c.coverage_id));
    ledger.evaluations.forEach(e => addNode(e.evaluation_id, "Evaluation", e.scope_description?.slice(0, 60) || e.evaluation_id));
    ledger.violations.forEach(v => addNode(v.violation_id, "Violation", v.description?.slice(0, 60) || v.violation_id));
    ledger.stakeholders.forEach(s => addNode(s.stakeholder_id, "Stakeholder", s.name || s.stakeholder_id));
    ledger.analysis_passes.forEach(a => addNode(a.pass_id, "AnalysisPass", a.pass_type || a.pass_id));
    ledger.segments.forEach(s => addNode(s.segment_id, "Segment", s.segment_text?.slice(0, 60) || s.segment_id));
    ledger.source_atoms.forEach(a => addNode(a.atom_id, "SourceAtom", a.atom_text?.slice(0, 60) || a.atom_id));
    ledger.signals.forEach(s => addNode(s.signal_id, "Signal", s.description?.slice(0, 60) || s.signal_id));
    ledger.concerns.forEach(c => addNode(c.concern_id, "Concern", c.description?.slice(0, 60) || c.concern_id));
    ledger.baselines.forEach(b => addNode(b.baseline_id, "Baseline", b.name || b.baseline_id));
    ledger.change_records.forEach(c => addNode(c.change_id, "ChangeRecord", c.description?.slice(0, 60) || c.change_id));

    ledger.traces.forEach(t => {
      const fromId = t.from_id || (t as any).from_ref || "";
      const toId = t.to_id || (t as any).to_ref || "";
      addEdge(fromId, toId, `trace:${t.trace_type}`, t.rationale || (t as any).description);
    });

    ledger.findings.forEach(f => {
      (f.source_refs || []).forEach(ref => addEdge(f.finding_id, ref, "source_ref"));
      if (f.produced_by_pass_id) addEdge(f.finding_id, f.produced_by_pass_id, "produced_by");
      (f.related_items || []).forEach(ref => addEdge(f.finding_id, ref, "related"));
    });

    ledger.domains.forEach(d => {
      if ((d as any).parent_domain_ref) addEdge(d.domain_id, (d as any).parent_domain_ref, "parent_domain");
      ((d as any).linked_objects || []).forEach((ref: string) => addEdge(d.domain_id, ref, "linked_object"));
    });

    ledger.gaps.forEach(g => {
      (g.domain_refs || []).forEach(ref => addEdge(g.gap_id, ref, "domain_ref"));
      (g.produced_from_finding_ids || []).forEach(ref => addEdge(g.gap_id, ref, "produced_from"));
      (g.affected_cells || []).forEach(ref => addEdge(g.gap_id, ref, "affects_cell"));
    });

    ledger.requirements.forEach(r => {
      (r.source_refs || []).forEach(ref => addEdge(r.requirement_id, ref, "source_ref"));
      (r.domain_refs || []).forEach(ref => addEdge(r.requirement_id, ref, "domain_ref"));
    });

    ledger.risks.forEach(r => {
      (r.source_refs || []).forEach(ref => addEdge(r.risk_id, ref, "source_ref"));
      (r.domain_refs || []).forEach(ref => addEdge(r.risk_id, ref, "domain_ref"));
      (r.related_element_ids || []).forEach(ref => addEdge(r.risk_id, ref, "related"));
    });

    ledger.issues.forEach(i => {
      (i.source_refs || []).forEach(ref => addEdge(i.issue_id, ref, "source_ref"));
      (i.domain_refs || []).forEach(ref => addEdge(i.issue_id, ref, "domain_ref"));
      (i.related_element_ids || []).forEach(ref => addEdge(i.issue_id, ref, "related"));
    });

    ledger.questions.forEach(q => {
      (q.source_refs || []).forEach(ref => addEdge(q.question_id, ref, "source_ref"));
    });

    ledger.answers.forEach(a => {
      if (a.question_id) addEdge(a.answer_id, a.question_id, "answers");
      (a.source_refs || []).forEach(ref => addEdge(a.answer_id, ref, "source_ref"));
    });

    ledger.assumptions.forEach(a => {
      (a.source_refs || []).forEach(ref => addEdge(a.assumption_id, ref, "source_ref"));
      (a.related_element_ids || []).forEach(ref => addEdge(a.assumption_id, ref, "related"));
    });

    ledger.constraints.forEach(c => {
      (c.source_refs || []).forEach(ref => addEdge(c.constraint_id, ref, "source_ref"));
      (c.domain_refs || []).forEach(ref => addEdge(c.constraint_id, ref, "domain_ref"));
      (c.affected_element_ids || []).forEach(ref => addEdge(c.constraint_id, ref, "affects"));
    });

    ledger.candidate_requirements.forEach(c => {
      (c.source_refs || []).forEach(ref => addEdge(c.candidate_requirement_id, ref, "source_ref"));
      (c.domain_refs || []).forEach(ref => addEdge(c.candidate_requirement_id, ref, "domain_ref"));
    });

    ledger.suggestions.forEach(s => {
      (s.source_refs || []).forEach(ref => addEdge(s.suggestion_id, ref, "source_ref"));
      (s.target_element_ids || []).forEach(ref => addEdge(s.suggestion_id, ref, "targets"));
    });

    ledger.decisions.forEach(d => {
      (d.related_element_ids || []).forEach(ref => addEdge(d.decision_id, ref, "related"));
    });

    ledger.coverage_items.forEach(c => {
      if (c.target_id) addEdge(c.coverage_id, c.target_id, "covers");
      if (c.produced_by_pass_id) addEdge(c.coverage_id, c.produced_by_pass_id, "produced_by");
    });

    ledger.violations.forEach(v => {
      (v.related_element_ids || []).forEach(ref => addEdge(v.violation_id, ref, "related"));
      if (v.rule_id) addEdge(v.violation_id, v.rule_id, "violates");
      if (v.produced_by_evaluation_id) addEdge(v.violation_id, v.produced_by_evaluation_id, "produced_by");
    });

    ledger.stakeholders.forEach(s => {
      (s.domain_refs || []).forEach(ref => addEdge(s.stakeholder_id, ref, "domain_ref"));
    });

    ledger.segments.forEach((s: any) => {
      addNode(s.segment_id, "Segment", s.title || s.segment_text?.slice(0, 60) || s.segment_id);
      if (s.source_id) addEdge(s.segment_id, s.source_id, "segment_of");
      (s.source_refs || []).forEach((ref: string) => addEdge(s.segment_id, ref, "source_ref"));
    });

    ledger.source_atoms.forEach(a => {
      if (a.segment_id) addEdge(a.atom_id, a.segment_id, "atom_of");
    });

    ledger.signals.forEach(s => {
      if (s.source_element_id) addEdge(s.signal_id, s.source_element_id, "signal_from");
      (s.target_element_ids || []).forEach(ref => addEdge(s.signal_id, ref, "signal_to"));
    });

    ledger.concerns.forEach(c => {
      if (c.raised_by_stakeholder_id) addEdge(c.concern_id, c.raised_by_stakeholder_id, "raised_by");
      (c.related_element_ids || []).forEach(ref => addEdge(c.concern_id, ref, "related"));
    });

    ledger.change_records.forEach(c => {
      (c.affected_element_ids || []).forEach(ref => addEdge(c.change_id, ref, "affects"));
    });

    for (const edge of edges) {
      if (!nodeMap.has(edge.from)) {
        nodeMap.set(edge.from, { id: edge.from, type: "Unknown", title: edge.from });
      }
      if (!nodeMap.has(edge.to)) {
        nodeMap.set(edge.to, { id: edge.to, type: "Unknown", title: edge.to });
      }
    }

    res.json({ nodes: Array.from(nodeMap.values()), edges });
  });

  app.get("/api/ledger/registers", async (_req, res) => {
    const pid = await getActiveProjectId();
    const neonResult = await neonQuery(pid, (db, p) => neonStorage.getRegisters(db, p));
    if (neonResult && neonResult.length > 0) return res.json(neonResult);

    const ledger = await storage.getLedger();
    if (!ledger) return res.json([]);
    res.json([
      ledger.source_register,
      ledger.findings_register,
      ledger.gap_register,
      ledger.zachman_cell_register,
      ledger.trace_register,
      ledger.domain_register,
      ledger.requirement_register,
      ledger.active_risk_register,
      ledger.issue_register,
      ledger.question_register,
      ledger.answer_register,
      ledger.assumption_register,
      ledger.constraint_register,
      ledger.candidate_requirement_register,
      ledger.suggestion_register,
      ledger.decision_register,
      ledger.coverage_register,
      ledger.evaluation_register,
      ledger.violation_register,
      ledger.stakeholder_register,
      ledger.narrative_summary_register,
    ]);
  });

  app.get("/api/neon/status", async (_req, res) => {
    const db = getNeonDb();
    if (!db) return res.json({ connected: false, reason: "No NEON_DATABASE_URL" });
    try {
      const pid = await getActiveProjectId();
      const hasProjectData = await neonStorage.hasData(db, pid);
      const hasAny = await neonStorage.hasAnyData(db);
      res.json({ connected: true, hasProjectData, hasAnyData: hasAny, activeProjectId: pid });
    } catch (e: any) {
      res.json({ connected: false, reason: e.message });
    }
  });

  app.post("/api/neon/migrate", async (_req, res) => {
    const db = getNeonDb();
    if (!db) return res.status(500).json({ error: "Neon not configured" });

    try {
      const allProjects = await storage.getProjects();
      const results: Record<string, any> = {};

      for (const proj of allProjects) {
        const project = await storage.getProject(proj.id);
        if (!project?.ledger) {
          results[proj.id] = { skipped: true, reason: "No ledger" };
          continue;
        }
        const importResult = await importLedgerToNeon(db, proj.id, project.ledger);
        results[proj.id] = importResult;
      }

      res.json({ success: true, results });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    res.json(await storage.getProjects());
  });

  app.get("/api/projects/active", async (_req, res) => {
    res.json({ projectId: await storage.getActiveProjectId() });
  });

  app.put("/api/projects/active", async (req, res) => {
    const { projectId } = req.body;
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ message: "projectId is required" });
    }
    const success = await storage.setActiveProjectId(projectId);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ projectId });
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
    }
    const project = await storage.createProject(parsed.data.name, parsed.data.description);
    res.status(201).json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const projectsList = await storage.getProjects();
    if (projectsList.length <= 1) {
      return res.status(400).json({ message: "Cannot delete the last project" });
    }
    const success = await storage.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ success: true });
  });

  app.post("/api/projects/:id/ledger", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const contentType = (req.headers["content-type"] || "").toLowerCase();
    const isJson = contentType.includes("application/json") ||
      (typeof req.body === "object" && req.body !== null && !Array.isArray(req.body) && req.body.elements);

    if (isJson) {
      try {
        let jsonData: Record<string, unknown>;
        if (typeof req.body === "string") {
          jsonData = JSON.parse(req.body);
        } else {
          jsonData = req.body;
        }
        const result = parseJsonLedger(jsonData as any);
        await storage.setProjectLedger(req.params.id, result.ledger);

        const neonDb = getNeonDb();
        let neonImported = false;
        if (neonDb) {
          try {
            const neonResult = await importLedgerToNeon(neonDb, req.params.id, result.ledger);
            neonImported = neonResult.success;
            if (!neonResult.success) {
              console.error("[Neon] Import failed during upload:", neonResult.error);
            }
          } catch (e: any) {
            console.error("[Neon] Import error during upload:", e.message);
          }
        }

        res.json({
          success: true,
          elementCount: result.elementCount,
          warnings: result.warnings,
          ledgerId: result.ledger.ledger_id,
          neonImported,
        });
      } catch (err: any) {
        res.status(400).json({ message: `Failed to parse JSON ledger: ${err.message}` });
      }
      return;
    }

    let markdownContent: string;
    if (typeof req.body === "string") {
      markdownContent = req.body;
    } else if (req.body?.content && typeof req.body.content === "string") {
      markdownContent = req.body.content;
    } else {
      return res.status(400).json({ message: "Expected markdown content as text, JSON { content: string }, or a JSON ledger file" });
    }

    if (markdownContent.length < 10) {
      return res.status(400).json({ message: "Ledger content is too short" });
    }

    try {
      const result = parseLedgerMarkdown(markdownContent);
      await storage.setProjectLedger(req.params.id, result.ledger);

      const neonDb = getNeonDb();
      let neonImported = false;
      if (neonDb) {
        try {
          const neonResult = await importLedgerToNeon(neonDb, req.params.id, result.ledger);
          neonImported = neonResult.success;
        } catch (e: any) {
          console.error("[Neon] Import error during markdown upload:", e.message);
        }
      }

      res.json({
        success: true,
        elementCount: result.elementCount,
        warnings: result.warnings,
        ledgerId: result.ledger.ledger_id,
        neonImported,
      });
    } catch (err: any) {
      res.status(400).json({ message: `Failed to parse ledger: ${err.message}` });
    }
  });

  return httpServer;
}
