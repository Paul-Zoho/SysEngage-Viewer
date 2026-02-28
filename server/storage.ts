import type { CanonicalLedger, LedgerStats, Project, ProjectSummary } from "@shared/schema";
import { createSeedLedger } from "./seedData";

export interface IStorage {
  getLedger(): CanonicalLedger | null;
  getLedgerStats(): LedgerStats;
  getProjects(): ProjectSummary[];
  getProject(id: string): Project | undefined;
  createProject(name: string, description?: string): Project;
  deleteProject(id: string): boolean;
  setProjectLedger(id: string, ledger: CanonicalLedger): boolean;
  getActiveProjectId(): string;
  setActiveProjectId(id: string): boolean;
}

function computeElementCount(ledger: CanonicalLedger): number {
  return ledger.sources.length + ledger.findings.length + ledger.gaps.length +
    ledger.requirements.length + ledger.risks.length + ledger.issues.length + ledger.traces.length +
    ledger.decisions.length + ledger.domains.length + ledger.questions.length + ledger.answers.length +
    ledger.assumptions.length + ledger.constraints.length + ledger.candidate_requirements.length +
    ledger.suggestions.length + ledger.coverage_items.length + ledger.rules.length +
    ledger.evaluations.length + ledger.violations.length + ledger.zachman_cells.length +
    ledger.analysis_passes.length + ledger.stakeholders.length + ledger.narrative_summaries.length +
    ledger.segments.length + ledger.source_atoms.length + ledger.cell_content_items.length +
    ledger.cell_relationships.length + ledger.checklists.length + ledger.structural_representations.length +
    ledger.control_artefacts.length + ledger.signals.length + ledger.concerns.length +
    ledger.closure_matrices.length + ledger.baselines.length + ledger.change_records.length;
}

function computeLedgerStats(l: CanonicalLedger): LedgerStats {
  const coverageCounts = { covered: 0, partial: 0, notCovered: 0, unknown: 0 };
  l.coverage_items.forEach(c => {
    if (c.coverage_state === "Covered") coverageCounts.covered++;
    else if (c.coverage_state === "PartiallyCovered") coverageCounts.partial++;
    else if (c.coverage_state === "NotCovered") coverageCounts.notCovered++;
    else coverageCounts.unknown++;
  });

  const riskExposure = { high: 0, medium: 0, low: 0 };
  l.risks.forEach(r => {
    const exp = r.exposure || r.impact;
    if (exp === "High") riskExposure.high++;
    else if (exp === "Medium") riskExposure.medium++;
    else riskExposure.low++;
  });

  const issueStatus = { open: 0, inProgress: 0, resolved: 0, closed: 0 };
  l.issues.forEach(i => {
    if (i.status === "Open") issueStatus.open++;
    else if (i.status === "InProgress") issueStatus.inProgress++;
    else if (i.status === "Resolved") issueStatus.resolved++;
    else issueStatus.closed++;
  });

  const gapResolution = { open: 0, accepted: 0, mitigated: 0, closed: 0 };
  l.gaps.forEach(g => {
    const st = g.resolution_state || "Open";
    if (st === "Open") gapResolution.open++;
    else if (st === "Accepted") gapResolution.accepted++;
    else if (st === "Mitigated") gapResolution.mitigated++;
    else gapResolution.closed++;
  });

  const findingSeverity = { high: 0, medium: 0, low: 0 };
  l.findings.forEach(f => {
    if (f.severity === "High") findingSeverity.high++;
    else if (f.severity === "Medium") findingSeverity.medium++;
    else findingSeverity.low++;
  });

  const registers = [
    l.source_register, l.findings_register, l.gap_register,
    l.zachman_cell_register, l.trace_register, l.domain_register,
    l.requirement_register, l.active_risk_register, l.issue_register,
    l.question_register, l.answer_register, l.assumption_register,
    l.constraint_register, l.candidate_requirement_register,
    l.suggestion_register, l.decision_register, l.coverage_register,
    l.evaluation_register, l.violation_register, l.stakeholder_register,
    l.narrative_summary_register, l.segment_register, l.source_atom_register,
    l.cell_content_item_register, l.cell_relationship_register,
    l.checklist_register, l.structural_representation_register,
    l.control_artefact_register, l.signal_register, l.concern_register,
    l.closure_matrix_register, l.baseline_register, l.change_record_register,
  ];

  const totalElements = computeElementCount(l);

  return {
    totalElements,
    sources: l.sources.length,
    requirements: l.requirements.length,
    findings: l.findings.length,
    gaps: l.gaps.length,
    risks: l.risks.length,
    issues: l.issues.length,
    traces: l.traces.length,
    decisions: l.decisions.length,
    coverage: coverageCounts,
    riskExposure,
    issueStatus,
    gapResolution,
    findingSeverity,
    domains: l.domains.length,
    stakeholders: l.stakeholders.length,
    registers: registers.length,
  };
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project> = new Map();
  private activeProjectId: string;
  private nextId: number = 1;

  constructor() {
    const demoId = this.generateId();
    const demoProject: Project = {
      id: demoId,
      name: "Demo Project",
      description: "Default project with sample systems engineering data",
      created_utc: new Date().toISOString(),
      ledger: createSeedLedger(),
    };
    this.projects.set(demoId, demoProject);
    this.activeProjectId = demoId;
  }

  private generateId(): string {
    return `proj_${this.nextId++}`;
  }

  getLedger(): CanonicalLedger | null {
    const project = this.projects.get(this.activeProjectId);
    if (!project || !project.ledger) {
      return null;
    }
    return project.ledger;
  }

  getLedgerStats(): LedgerStats {
    const ledger = this.getLedger();
    if (!ledger) {
      return { totalElements: 0, sources: 0, requirements: 0, findings: 0, gaps: 0, risks: 0, issues: 0, traces: 0, decisions: 0, coverage: { covered: 0, partial: 0, notCovered: 0, unknown: 0 }, riskExposure: { high: 0, medium: 0, low: 0 }, issueStatus: { open: 0, inProgress: 0, resolved: 0, closed: 0 }, gapResolution: { open: 0, accepted: 0, mitigated: 0, closed: 0 }, findingSeverity: { high: 0, medium: 0, low: 0 }, domains: 0, stakeholders: 0, registers: 0 };
    }
    return computeLedgerStats(ledger);
  }

  getProjects(): ProjectSummary[] {
    return Array.from(this.projects.values()).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      created_utc: p.created_utc,
      elementCount: p.ledger ? computeElementCount(p.ledger) : 0,
      hasLedger: p.ledger !== null,
    }));
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  createProject(name: string, description?: string): Project {
    const project: Project = {
      id: this.generateId(),
      name,
      description,
      created_utc: new Date().toISOString(),
      ledger: null,
    };
    this.projects.set(project.id, project);
    return project;
  }

  deleteProject(id: string): boolean {
    if (!this.projects.has(id)) return false;
    this.projects.delete(id);
    if (this.activeProjectId === id) {
      const firstKey = this.projects.keys().next().value;
      this.activeProjectId = firstKey || "";
    }
    return true;
  }

  setProjectLedger(id: string, ledger: CanonicalLedger): boolean {
    const project = this.projects.get(id);
    if (!project) return false;
    project.ledger = ledger;
    return true;
  }

  getActiveProjectId(): string {
    return this.activeProjectId;
  }

  setActiveProjectId(id: string): boolean {
    if (!this.projects.has(id)) return false;
    this.activeProjectId = id;
    return true;
  }
}

export const storage = new MemStorage();
