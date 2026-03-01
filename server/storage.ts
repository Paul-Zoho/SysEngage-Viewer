import type { CanonicalLedger, LedgerStats, Project, ProjectSummary } from "@shared/schema";
import { projects } from "@shared/schema";
import { createSeedLedger } from "./seedData";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLedger(): Promise<CanonicalLedger | null>;
  getLedgerStats(): Promise<LedgerStats>;
  getProjects(): Promise<ProjectSummary[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(name: string, description?: string): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
  setProjectLedger(id: string, ledger: CanonicalLedger): Promise<boolean>;
  getActiveProjectId(): Promise<string>;
  setActiveProjectId(id: string): Promise<boolean>;
  initialize(): Promise<void>;
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
    (ledger.concern_categories?.length || 0) +
    ledger.closure_matrices.length + ledger.baselines.length +
    (ledger.artefact_states?.length || 0) +
    ledger.change_records.length;
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
    segments: l.segments.length,
    registers: registers.length,
  };
}

const emptyStats: LedgerStats = {
  totalElements: 0, sources: 0, requirements: 0, findings: 0, gaps: 0,
  risks: 0, issues: 0, traces: 0, decisions: 0,
  coverage: { covered: 0, partial: 0, notCovered: 0, unknown: 0 },
  riskExposure: { high: 0, medium: 0, low: 0 },
  issueStatus: { open: 0, inProgress: 0, resolved: 0, closed: 0 },
  gapResolution: { open: 0, accepted: 0, mitigated: 0, closed: 0 },
  findingSeverity: { high: 0, medium: 0, low: 0 },
  domains: 0, stakeholders: 0, segments: 0, registers: 0,
};

let nextProjectNum = 1;
function generateProjectId(): string {
  return `proj_${nextProjectNum++}`;
}

export class DatabaseStorage implements IStorage {
  async initialize(): Promise<void> {
    const existing = await db.select({ projectId: projects.projectId }).from(projects);
    if (existing.length === 0) {
      const pid = generateProjectId();
      await db.insert(projects).values({
        projectId: pid,
        name: "Demo Project",
        description: "Default project with sample systems engineering data",
        createdUtc: new Date().toISOString(),
        ledger: createSeedLedger() as any,
        isActive: true,
      });
    } else {
      const maxNum = existing.reduce((max, row) => {
        const match = row.projectId.match(/^proj_(\d+)$/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      nextProjectNum = maxNum + 1;
      const activeRows = await db.select({ projectId: projects.projectId }).from(projects).where(eq(projects.isActive, true)).limit(1);
      if (activeRows.length === 0) {
        await db.update(projects).set({ isActive: true }).where(eq(projects.projectId, existing[0].projectId));
      }
    }
  }

  async getLedger(): Promise<CanonicalLedger | null> {
    const rows = await db.select({ ledger: projects.ledger }).from(projects).where(eq(projects.isActive, true)).limit(1);
    if (rows.length === 0 || !rows[0].ledger) return null;
    return rows[0].ledger as unknown as CanonicalLedger;
  }

  async getLedgerStats(): Promise<LedgerStats> {
    const ledger = await this.getLedger();
    if (!ledger) return emptyStats;
    return computeLedgerStats(ledger);
  }

  async getProjects(): Promise<ProjectSummary[]> {
    const rows = await db.select().from(projects);
    return rows.map(row => {
      const ledger = row.ledger as unknown as CanonicalLedger | null;
      return {
        id: row.projectId,
        name: row.name,
        description: row.description ?? undefined,
        created_utc: row.createdUtc,
        elementCount: ledger ? computeElementCount(ledger) : 0,
        hasLedger: ledger !== null,
      };
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    const rows = await db.select().from(projects).where(eq(projects.projectId, id)).limit(1);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.projectId,
      name: row.name,
      description: row.description ?? undefined,
      created_utc: row.createdUtc,
      ledger: (row.ledger as unknown as CanonicalLedger) ?? null,
    };
  }

  async createProject(name: string, description?: string): Promise<Project> {
    const pid = generateProjectId();
    const createdUtc = new Date().toISOString();
    await db.insert(projects).values({
      projectId: pid,
      name,
      description: description ?? null,
      createdUtc,
      ledger: null,
      isActive: false,
    });
    return {
      id: pid,
      name,
      description,
      created_utc: createdUtc,
      ledger: null,
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    const rows = await db.select({ projectId: projects.projectId, isActive: projects.isActive }).from(projects).where(eq(projects.projectId, id)).limit(1);
    if (rows.length === 0) return false;
    const wasActive = rows[0].isActive;
    await db.delete(projects).where(eq(projects.projectId, id));
    if (wasActive) {
      const remaining = await db.select({ projectId: projects.projectId }).from(projects).limit(1);
      if (remaining.length > 0) {
        await db.update(projects).set({ isActive: true }).where(eq(projects.projectId, remaining[0].projectId));
      }
    }
    return true;
  }

  async setProjectLedger(id: string, ledger: CanonicalLedger): Promise<boolean> {
    const existing = await db.select({ projectId: projects.projectId }).from(projects).where(eq(projects.projectId, id)).limit(1);
    if (existing.length === 0) return false;
    await db.update(projects).set({ ledger: ledger as any }).where(eq(projects.projectId, id));
    return true;
  }

  async getActiveProjectId(): Promise<string> {
    const rows = await db.select({ projectId: projects.projectId }).from(projects).where(eq(projects.isActive, true)).limit(1);
    if (rows.length === 0) return "";
    return rows[0].projectId;
  }

  async setActiveProjectId(id: string): Promise<boolean> {
    const rows = await db.select({ projectId: projects.projectId }).from(projects).where(eq(projects.projectId, id)).limit(1);
    if (rows.length === 0) return false;
    await db.update(projects).set({ isActive: false }).where(eq(projects.isActive, true));
    await db.update(projects).set({ isActive: true }).where(eq(projects.projectId, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
