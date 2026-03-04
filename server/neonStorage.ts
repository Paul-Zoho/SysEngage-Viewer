import { eq, sql, inArray } from "drizzle-orm";
import * as ns from "../shared/neonSchema";

type NeonDb = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

const tableMap: Record<string, { table: any; idColumn: string; type: string; titleFields: string[] }> = {
  sources: { table: ns.sources, idColumn: "sourceId", type: "Source", titleFields: ["sourceText"] },
  segments: { table: ns.segments, idColumn: "segmentId", type: "Segment", titleFields: ["title", "segmentText"] },
  source_atoms: { table: ns.sourceAtoms, idColumn: "atomId", type: "SourceAtom", titleFields: ["atomText"] },
  findings: { table: ns.findings, idColumn: "findingId", type: "Finding", titleFields: ["description"] },
  gaps: { table: ns.gaps, idColumn: "gapId", type: "Gap", titleFields: ["description"] },
  domains: { table: ns.domains, idColumn: "domainId", type: "Domain", titleFields: ["name", "description"] },
  requirements: { table: ns.requirements, idColumn: "requirementId", type: "Requirement", titleFields: ["statement"] },
  risks: { table: ns.risks, idColumn: "riskId", type: "Risk", titleFields: ["title", "description"] },
  issues: { table: ns.issues, idColumn: "issueId", type: "Issue", titleFields: ["title", "description"] },
  traces: { table: ns.traces, idColumn: "traceId", type: "Trace", titleFields: ["rationale", "description"] },
  decisions: { table: ns.decisions, idColumn: "decisionId", type: "Decision", titleFields: ["title", "description"] },
  questions: { table: ns.questions, idColumn: "questionId", type: "Question", titleFields: ["questionText"] },
  answers: { table: ns.answers, idColumn: "answerId", type: "Answer", titleFields: ["responseText"] },
  assumptions: { table: ns.assumptions, idColumn: "assumptionId", type: "Assumption", titleFields: ["statement"] },
  constraints: { table: ns.constraints, idColumn: "constraintId", type: "Constraint", titleFields: ["statement"] },
  candidate_requirements: { table: ns.candidateRequirements, idColumn: "candidateRequirementId", type: "CandidateRequirement", titleFields: ["statement"] },
  suggestions: { table: ns.suggestions, idColumn: "suggestionId", type: "Suggestion", titleFields: ["description"] },
  stakeholders: { table: ns.stakeholders, idColumn: "stakeholderId", type: "Stakeholder", titleFields: ["name"] },
  coverage_items: { table: ns.coverageItems, idColumn: "coverageId", type: "CoverageItem", titleFields: ["coverageStatement", "notes"] },
  rules: { table: ns.rules, idColumn: "ruleId", type: "Rule", titleFields: ["name", "description"] },
  evaluations: { table: ns.evaluations, idColumn: "evaluationId", type: "Evaluation", titleFields: ["scopeDescription"] },
  violations: { table: ns.violations, idColumn: "violationId", type: "Violation", titleFields: ["description"] },
  zachman_cells: { table: ns.zachmanCells, idColumn: "cellId", type: "ZachmanCell", titleFields: [] },
  cell_content_items: { table: ns.cellContentItems, idColumn: "cellContentItemId", type: "CellContentItem", titleFields: ["description"] },
  cell_relationships: { table: ns.cellRelationships, idColumn: "relationshipId", type: "CellRelationship", titleFields: ["description"] },
  analysis_passes: { table: ns.analysisPasses, idColumn: "passId", type: "AnalysisPass", titleFields: ["passType"] },
  narrative_summaries: { table: ns.narrativeSummaries, idColumn: "summaryId", type: "NarrativeSummary", titleFields: ["summaryText"] },
  structural_representations: { table: ns.structuralRepresentations, idColumn: "representationId", type: "StructuralRepresentation", titleFields: ["scopeDescription"] },
  control_artefacts: { table: ns.controlArtefacts, idColumn: "artefactId", type: "ControlArtefact", titleFields: ["name", "description"] },
  signals: { table: ns.signals, idColumn: "signalId", type: "Signal", titleFields: ["signalText", "description"] },
  concerns: { table: ns.concerns, idColumn: "concernId", type: "Concern", titleFields: ["description"] },
  closure_matrices: { table: ns.closureMatrices, idColumn: "matrixId", type: "ClosureMatrix", titleFields: ["description"] },
  baselines: { table: ns.baselines, idColumn: "baselineId", type: "Baseline", titleFields: ["name", "description"] },
  change_records: { table: ns.changeRecords, idColumn: "changeId", type: "ChangeRecord", titleFields: ["description"] },
  checklists: { table: ns.checklists, idColumn: "checklistId", type: "Checklist", titleFields: ["name", "description"] },
  registers: { table: ns.registers, idColumn: "registerId", type: "Register", titleFields: ["registerType"] },
};

function rowToSnakeCase(row: any): any {
  const result: any = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "id") continue;
    if (key === "projectId") continue;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (key === "extra" && value && typeof value === "object") {
      Object.assign(result, value);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}

export async function getCollection(db: NeonDb, projectId: string, collectionName: string): Promise<any[]> {
  const info = tableMap[collectionName];
  if (!info) return [];
  const rows = await db.select().from(info.table).where(eq(info.table.projectId, projectId));
  return rows.map(rowToSnakeCase);
}

export async function getElementById(db: NeonDb, projectId: string, elementId: string): Promise<{ element: any; type: string } | null> {
  for (const [, info] of Object.entries(tableMap)) {
    const col = info.table[info.idColumn];
    if (!col) continue;
    const rows = await db.select().from(info.table).where(
      sql`${info.table.projectId} = ${projectId} AND ${col} = ${elementId}`
    ).limit(1);
    if (rows.length > 0) {
      return { element: rowToSnakeCase(rows[0]), type: info.type };
    }
  }
  return null;
}

export async function getElementsByIds(db: NeonDb, projectId: string, ids: string[]): Promise<Record<string, { element: any; type: string }>> {
  const result: Record<string, { element: any; type: string }> = {};
  const remaining = new Set(ids);

  for (const [, info] of Object.entries(tableMap)) {
    if (remaining.size === 0) break;
    const col = info.table[info.idColumn];
    if (!col) continue;
    const searchIds = Array.from(remaining);
    const rows = await db.select().from(info.table).where(
      sql`${info.table.projectId} = ${projectId} AND ${col} = ANY(${searchIds})`
    );
    for (const row of rows) {
      const elId = (row as any)[info.idColumn];
      if (elId && remaining.has(elId)) {
        result[elId] = { element: rowToSnakeCase(row), type: info.type };
        remaining.delete(elId);
      }
    }
  }

  return result;
}

export async function getStats(db: NeonDb, projectId: string): Promise<any> {
  const countQuery = async (table: any) => {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(table).where(eq(table.projectId, projectId));
    return result[0]?.count ?? 0;
  };

  const [
    sourcesCount, requirementsCount, findingsCount, gapsCount,
    risksCount, issuesCount, tracesCount, decisionsCount,
    domainsCount, stakeholdersCount, segmentsCount, registersCount,
    coverageCount, questionsCount, answersCount, assumptionsCount,
    constraintsCount, candidateReqCount, suggestionsCount,
    rulesCount, evaluationsCount, violationsCount,
    zachmanCount, cciCount, crCount, apCount,
    narrativeCount, structRepCount, controlArtCount,
    signalsCount, concernsCount, closureCount,
    baselinesCount, changeRecCount, checklistCount,
    sourceAtomsCount, concernCatCount, artefactStatesCount,
  ] = await Promise.all([
    countQuery(ns.sources), countQuery(ns.requirements), countQuery(ns.findings), countQuery(ns.gaps),
    countQuery(ns.risks), countQuery(ns.issues), countQuery(ns.traces), countQuery(ns.decisions),
    countQuery(ns.domains), countQuery(ns.stakeholders), countQuery(ns.segments), countQuery(ns.registers),
    countQuery(ns.coverageItems), countQuery(ns.questions), countQuery(ns.answers), countQuery(ns.assumptions),
    countQuery(ns.constraints), countQuery(ns.candidateRequirements), countQuery(ns.suggestions),
    countQuery(ns.rules), countQuery(ns.evaluations), countQuery(ns.violations),
    countQuery(ns.zachmanCells), countQuery(ns.cellContentItems), countQuery(ns.cellRelationships), countQuery(ns.analysisPasses),
    countQuery(ns.narrativeSummaries), countQuery(ns.structuralRepresentations), countQuery(ns.controlArtefacts),
    countQuery(ns.signals), countQuery(ns.concerns), countQuery(ns.closureMatrices),
    countQuery(ns.baselines), countQuery(ns.changeRecords), countQuery(ns.checklists),
    countQuery(ns.sourceAtoms), countQuery(ns.concernCategories), countQuery(ns.artefactStates),
  ]);

  const totalElements = sourcesCount + requirementsCount + findingsCount + gapsCount +
    risksCount + issuesCount + tracesCount + decisionsCount + domainsCount +
    questionsCount + answersCount + assumptionsCount + constraintsCount +
    candidateReqCount + suggestionsCount + coverageCount + rulesCount +
    evaluationsCount + violationsCount + zachmanCount + apCount +
    stakeholdersCount + narrativeCount + segmentsCount + sourceAtomsCount +
    cciCount + crCount + checklistCount + structRepCount +
    controlArtCount + signalsCount + concernsCount + concernCatCount +
    closureCount + baselinesCount + artefactStatesCount + changeRecCount;

  const coverageRows = await db.select({ coverageState: ns.coverageItems.coverageState })
    .from(ns.coverageItems).where(eq(ns.coverageItems.projectId, projectId));
  const coverage = { covered: 0, partial: 0, notCovered: 0, unknown: 0 };
  for (const r of coverageRows) {
    if (r.coverageState === "Covered") coverage.covered++;
    else if (r.coverageState === "PartiallyCovered") coverage.partial++;
    else if (r.coverageState === "NotCovered") coverage.notCovered++;
    else coverage.unknown++;
  }

  const riskRows = await db.select({ impact: ns.risks.impact, exposure: ns.risks.exposure })
    .from(ns.risks).where(eq(ns.risks.projectId, projectId));
  const riskExposure = { high: 0, medium: 0, low: 0 };
  for (const r of riskRows) {
    const exp = r.exposure || r.impact;
    if (exp === "High") riskExposure.high++;
    else if (exp === "Medium") riskExposure.medium++;
    else riskExposure.low++;
  }

  const issueRows = await db.select({ status: ns.issues.status })
    .from(ns.issues).where(eq(ns.issues.projectId, projectId));
  const issueStatus = { open: 0, inProgress: 0, resolved: 0, closed: 0 };
  for (const r of issueRows) {
    if (r.status === "Open") issueStatus.open++;
    else if (r.status === "InProgress") issueStatus.inProgress++;
    else if (r.status === "Resolved") issueStatus.resolved++;
    else issueStatus.closed++;
  }

  const gapRows = await db.select({ resolutionState: ns.gaps.resolutionState })
    .from(ns.gaps).where(eq(ns.gaps.projectId, projectId));
  const gapResolution = { open: 0, accepted: 0, mitigated: 0, closed: 0 };
  for (const r of gapRows) {
    const st = r.resolutionState || "Open";
    if (st === "Open") gapResolution.open++;
    else if (st === "Accepted") gapResolution.accepted++;
    else if (st === "Mitigated") gapResolution.mitigated++;
    else gapResolution.closed++;
  }

  const findingRows = await db.select({ severity: ns.findings.severity })
    .from(ns.findings).where(eq(ns.findings.projectId, projectId));
  const findingSeverity = { high: 0, medium: 0, low: 0 };
  for (const r of findingRows) {
    if (r.severity === "High") findingSeverity.high++;
    else if (r.severity === "Medium") findingSeverity.medium++;
    else findingSeverity.low++;
  }

  return {
    totalElements, sources: sourcesCount, requirements: requirementsCount,
    findings: findingsCount, gaps: gapsCount, risks: risksCount,
    issues: issuesCount, traces: tracesCount, decisions: decisionsCount,
    coverage, riskExposure, issueStatus, gapResolution, findingSeverity,
    domains: domainsCount, stakeholders: stakeholdersCount,
    segments: segmentsCount, registers: registersCount,
  };
}

export async function getRelationships(db: NeonDb, projectId: string): Promise<{ nodes: any[]; edges: any[] }> {
  const nodeMap = new Map<string, { id: string; type: string; title: string }>();
  const edges: { from: string; to: string; relationship: string; detail?: string }[] = [];

  for (const [, info] of Object.entries(tableMap)) {
    if (info.type === "Register") continue;
    const rows = await db.select().from(info.table).where(eq(info.table.projectId, projectId));
    for (const row of rows) {
      const r = row as any;
      const elId = r[info.idColumn];
      if (!elId) continue;

      let title = elId;
      for (const tf of info.titleFields) {
        if (r[tf]) { title = String(r[tf]).slice(0, 60); break; }
      }

      if (info.type === "ZachmanCell") {
        title = `${r.row || ""}/${r.column || ""}`;
      }

      nodeMap.set(elId, { id: elId, type: info.type, title });

      if (info.type === "Domain") {
        if (r.parentDomainRef) {
          edges.push({ from: elId, to: r.parentDomainRef, relationship: "parent_domain" });
        }
        const extra = r.extra as any;
        if (extra?.linked_objects && Array.isArray(extra.linked_objects)) {
          for (const ref of extra.linked_objects) {
            if (typeof ref === "string" && ref) {
              edges.push({ from: elId, to: ref, relationship: "linked_object" });
            }
          }
        }
      }
    }
  }

  const edgeKeys = new Set(edges.map(e => `${e.from}|${e.to}|${e.relationship}`));

  const refs = await db.select().from(ns.elementRefs).where(eq(ns.elementRefs.projectId, projectId));
  for (const ref of refs) {
    const key = `${ref.sourceElementId}|${ref.targetElementId}|${ref.refType}`;
    if (!edgeKeys.has(key)) {
      edges.push({ from: ref.sourceElementId, to: ref.targetElementId, relationship: ref.refType });
      edgeKeys.add(key);
    }

    if (!nodeMap.has(ref.sourceElementId)) {
      nodeMap.set(ref.sourceElementId, { id: ref.sourceElementId, type: "Unknown", title: ref.sourceElementId });
    }
    if (!nodeMap.has(ref.targetElementId)) {
      nodeMap.set(ref.targetElementId, { id: ref.targetElementId, type: "Unknown", title: ref.targetElementId });
    }
  }

  return { nodes: Array.from(nodeMap.values()), edges };
}

export async function hasData(db: NeonDb, projectId: string): Promise<boolean> {
  const result = await db.select({ count: sql<number>`count(*)::int` })
    .from(ns.ledgerInstances).where(eq(ns.ledgerInstances.projectId, projectId));
  return (result[0]?.count ?? 0) > 0;
}

export async function hasAnyData(db: NeonDb): Promise<boolean> {
  const result = await db.select({ count: sql<number>`count(*)::int` })
    .from(ns.ledgerInstances);
  return (result[0]?.count ?? 0) > 0;
}

export async function getRegisters(db: NeonDb, projectId: string): Promise<any[]> {
  const rows = await db.select().from(ns.registers).where(eq(ns.registers.projectId, projectId));
  return rows.map(rowToSnakeCase);
}
