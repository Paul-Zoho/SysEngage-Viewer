import type { CanonicalLedger, LedgerStats } from "@shared/schema";
import { createSeedLedger } from "./seedData";

export interface IStorage {
  getLedger(): CanonicalLedger;
  getLedgerStats(): LedgerStats;
}

export class MemStorage implements IStorage {
  private ledger: CanonicalLedger;

  constructor() {
    this.ledger = createSeedLedger();
  }

  getLedger(): CanonicalLedger {
    return this.ledger;
  }

  getLedgerStats(): LedgerStats {
    const l = this.ledger;

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

    const totalElements = l.sources.length + l.findings.length + l.gaps.length +
      l.requirements.length + l.risks.length + l.issues.length + l.traces.length +
      l.decisions.length + l.domains.length + l.questions.length + l.answers.length +
      l.assumptions.length + l.constraints.length + l.candidate_requirements.length +
      l.suggestions.length + l.coverage_items.length + l.rules.length +
      l.evaluations.length + l.violations.length + l.zachman_cells.length +
      l.analysis_passes.length + l.stakeholders.length + l.narrative_summaries.length +
      l.segments.length + l.source_atoms.length + l.cell_content_items.length +
      l.cell_relationships.length + l.checklists.length + l.structural_representations.length +
      l.control_artefacts.length + l.signals.length + l.concerns.length +
      l.closure_matrices.length + l.baselines.length + l.change_records.length;

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
}

export const storage = new MemStorage();
