import yaml from "js-yaml";
import type { CanonicalLedger, Register } from "@shared/schema";

export interface ParseWarning {
  section: string;
  element?: string;
  message: string;
}

export interface ParseResult {
  ledger: CanonicalLedger;
  warnings: ParseWarning[];
  elementCount: number;
}

const REGISTER_TYPE_TO_FIELD: Record<string, string> = {
  Source: "source_register",
  Finding: "findings_register",
  Gap: "gap_register",
  ZachmanCell: "zachman_cell_register",
  Trace: "trace_register",
  Domain: "domain_register",
  Requirement: "requirement_register",
  Risk: "active_risk_register",
  Issue: "issue_register",
  Question: "question_register",
  Answer: "answer_register",
  Assumption: "assumption_register",
  Constraint: "constraint_register",
  CandidateRequirement: "candidate_requirement_register",
  Suggestion: "suggestion_register",
  Decision: "decision_register",
  CoverageItem: "coverage_register",
  Evaluation: "evaluation_register",
  Violation: "violation_register",
  Stakeholder: "stakeholder_register",
  NarrativeSummary: "narrative_summary_register",
  Segment: "segment_register",
  SourceAtom: "source_atom_register",
  CellContentItem: "cell_content_item_register",
  CellRelationship: "cell_relationship_register",
  Checklist: "checklist_register",
  StructuralRepresentation: "structural_representation_register",
  ControlArtefact: "control_artefact_register",
  Signal: "signal_register",
  Concern: "concern_register",
  ClosureMatrix: "closure_matrix_register",
  Baseline: "baseline_register",
  ChangeRecord: "change_record_register",
};

const SECTION_TO_FIELD: Record<string, string> = {
  Sources: "sources",
  AnalysisPasses: "analysis_passes",
  ZachmanCells: "zachman_cells",
  Signals: "signals",
  CellContentItems: "cell_content_items",
  Domains: "domains",
  Requirements: "requirements",
  Traces: "traces",
  Findings: "findings",
  Gaps: "gaps",
  Risks: "risks",
  Issues: "issues",
  Decisions: "decisions",
  Stakeholders: "stakeholders",
  Questions: "questions",
  Answers: "answers",
  Assumptions: "assumptions",
  Constraints: "constraints",
  CandidateRequirements: "candidate_requirements",
  Suggestions: "suggestions",
  CoverageItems: "coverage_items",
  Rules: "rules",
  Evaluations: "evaluations",
  Violations: "violations",
  NarrativeSummaries: "narrative_summaries",
  Segments: "segments",
  SourceAtoms: "source_atoms",
  CellRelationships: "cell_relationships",
  Checklists: "checklists",
  StructuralRepresentations: "structural_representations",
  ControlArtefacts: "control_artefacts",
  Concerns: "concerns",
  ClosureMatrices: "closure_matrices",
  Baselines: "baselines",
  ChangeRecords: "change_records",
};

function emptyRegister(): Register {
  return {
    register_id: "",
    register_type: "",
    member_ids: [],
    completeness_rule: "",
  };
}

function createEmptyLedger(): CanonicalLedger {
  return {
    ledger_id: "",
    version: "",
    created_utc: "",
    sources: [],
    source_register: emptyRegister(),
    findings: [],
    findings_register: emptyRegister(),
    gaps: [],
    gap_register: emptyRegister(),
    zachman_cells: [],
    zachman_cell_register: emptyRegister(),
    traces: [],
    trace_register: emptyRegister(),
    domains: [],
    domain_register: emptyRegister(),
    requirements: [],
    requirement_register: emptyRegister(),
    risks: [],
    active_risk_register: emptyRegister(),
    issues: [],
    issue_register: emptyRegister(),
    questions: [],
    question_register: emptyRegister(),
    answers: [],
    answer_register: emptyRegister(),
    assumptions: [],
    assumption_register: emptyRegister(),
    constraints: [],
    constraint_register: emptyRegister(),
    candidate_requirements: [],
    candidate_requirement_register: emptyRegister(),
    suggestions: [],
    suggestion_register: emptyRegister(),
    decisions: [],
    decision_register: emptyRegister(),
    coverage_items: [],
    coverage_register: emptyRegister(),
    rules: [],
    evaluations: [],
    evaluation_register: emptyRegister(),
    violations: [],
    violation_register: emptyRegister(),
    analysis_passes: [],
    stakeholders: [],
    stakeholder_register: emptyRegister(),
    narrative_summaries: [],
    narrative_summary_register: emptyRegister(),
    segments: [],
    segment_register: emptyRegister(),
    source_atoms: [],
    source_atom_register: emptyRegister(),
    cell_content_items: [],
    cell_content_item_register: emptyRegister(),
    cell_relationships: [],
    cell_relationship_register: emptyRegister(),
    checklists: [],
    checklist_register: emptyRegister(),
    structural_representations: [],
    structural_representation_register: emptyRegister(),
    control_artefacts: [],
    control_artefact_register: emptyRegister(),
    signals: [],
    signal_register: emptyRegister(),
    concerns: [],
    concern_register: emptyRegister(),
    closure_matrices: [],
    closure_matrix_register: emptyRegister(),
    baselines: [],
    baseline_register: emptyRegister(),
    change_records: [],
    change_record_register: emptyRegister(),
  };
}

interface Section {
  name: string;
  content: string;
}

function splitSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split("\n");
  let currentName = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      if (currentName) {
        sections.push({ name: currentName, content: currentLines.join("\n") });
      }
      currentName = line.slice(3).trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentName) {
    sections.push({ name: currentName, content: currentLines.join("\n") });
  }

  return sections;
}

interface Element {
  heading: string;
  yamlContent: string;
}

function splitElements(sectionContent: string): Element[] {
  const elements: Element[] = [];
  const lines = sectionContent.split("\n");
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (currentHeading) {
        elements.push({ heading: currentHeading, yamlContent: currentLines.join("\n") });
      }
      currentHeading = line.slice(4).trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading) {
    elements.push({ heading: currentHeading, yamlContent: currentLines.join("\n") });
  }

  return elements;
}

function extractYaml(text: string): string | null {
  const match = text.match(/```ya?ml\s*\n([\s\S]*?)```/);
  return match ? match[1] : null;
}

function extractAllYamlBlocks(text: string): string[] {
  const blocks: string[] = [];
  const regex = /```ya?ml\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function sanitizeYaml(yamlStr: string): string {
  const lines = yamlStr.split("\n");
  const result: string[] = [];
  let inBlockScalar = false;
  let blockIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inBlockScalar) {
      const trimmed = line.trimStart();
      const indent = line.length - trimmed.length;
      if (trimmed.length === 0) {
        result.push(line);
        continue;
      }
      if (indent <= blockIndent && /^[a-zA-Z_]/.test(trimmed)) {
        inBlockScalar = false;
      } else {
        result.push(line);
        continue;
      }
    }

    const blockMatch = line.match(/^(\s*\w[\w_-]*)\s*:\s*[|>]-?\s*$/);
    if (blockMatch) {
      inBlockScalar = true;
      blockIndent = blockMatch[1].length - blockMatch[1].trimStart().length;
      result.push(line);
      continue;
    }

    const kvMatch = line.match(/^(\s*[a-zA-Z_][\w_-]*\s*:)\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2];
      const needsQuoting =
        !value.startsWith("'") && !value.startsWith('"') &&
        (value.includes("*") || value.includes(": ") || value.endsWith(":") || value.startsWith("- ") || value.includes(" #") || /[{}[\]%&!|>@`]/.test(value));
      if (needsQuoting) {
        const escaped = value.replace(/'/g, "''");
        result.push(`${key} '${escaped}'`);
        continue;
      }
    }

    result.push(line);
  }

  return result.join("\n");
}

function safeYamlLoad(yamlStr: string): unknown {
  try {
    return yaml.load(yamlStr);
  } catch {
    try {
      return yaml.load(sanitizeYaml(yamlStr));
    } catch {
      return null;
    }
  }
}

export function parseLedgerMarkdown(markdown: string): ParseResult {
  const warnings: ParseWarning[] = [];
  const ledger = createEmptyLedger();
  let elementCount = 0;

  const sections = splitSections(markdown);

  for (const section of sections) {
    if (section.name === "Run Metadata") {
      continue;
    }

    if (section.name === "CanonicalLedger") {
      const yamlStr = extractYaml(section.content);
      if (yamlStr) {
        const data = safeYamlLoad(yamlStr) as Record<string, unknown> | null;
        if (data) {
          ledger.ledger_id = String(data.ledger_id || "");
          ledger.version = String(data.version || data.ledger_spec_version || "");
          const rawDate = data.created_date || data.created_utc || "";
          ledger.created_utc = rawDate instanceof Date ? rawDate.toISOString() : String(rawDate);
          ledger.row_target = data.row_target ? String(data.row_target) : undefined;
        } else {
          warnings.push({
            section: "CanonicalLedger",
            message: "Failed to parse YAML metadata",
          });
        }
      }
      continue;
    }

    if (section.name === "Registers") {
      const elements = splitElements(section.content);
      for (const el of elements) {
        const yamlStr = extractYaml(el.yamlContent);
        if (!yamlStr) {
          warnings.push({
            section: "Registers",
            element: el.heading,
            message: "No YAML block found",
          });
          continue;
        }
        const data = safeYamlLoad(yamlStr) as Record<string, unknown> | null;
        if (data && data.register_type) {
          const registerType = String(data.register_type);
          const fieldName = REGISTER_TYPE_TO_FIELD[registerType];
          if (fieldName) {
            const register: Register = {
              register_id: String(data.register_id || ""),
              register_type: registerType,
              member_ids: Array.isArray(data.member_ids)
                ? data.member_ids.map(String)
                : [],
              completeness_rule: String(data.completeness_rule || ""),
              confidence: typeof data.confidence === "number" ? data.confidence : undefined,
            };
            (ledger as unknown as Record<string, unknown>)[fieldName] = register;
            elementCount++;
          } else {
            warnings.push({
              section: "Registers",
              element: el.heading,
              message: `Unknown register type: ${registerType}`,
            });
          }
        } else if (!data) {
          warnings.push({
            section: "Registers",
            element: el.heading,
            message: "Failed to parse YAML",
          });
        }
      }
      continue;
    }

    const fieldName = SECTION_TO_FIELD[section.name];
    if (!fieldName) {
      warnings.push({
        section: section.name,
        message: `Unknown section, skipped`,
      });
      continue;
    }

    const elements = splitElements(section.content);
    const parsedElements: unknown[] = [];

    for (const el of elements) {
      const yamlBlocks = extractAllYamlBlocks(el.yamlContent);
      if (yamlBlocks.length === 0) {
        warnings.push({
          section: section.name,
          element: el.heading,
          message: "No YAML block found",
        });
        continue;
      }

      for (const yamlStr of yamlBlocks) {
        const data = safeYamlLoad(yamlStr);
        if (data && typeof data === "object") {
          parsedElements.push(data);
          elementCount++;
        } else if (!data) {
          warnings.push({
            section: section.name,
            element: el.heading,
            message: "Failed to parse YAML block",
          });
        }
      }
    }

    (ledger as unknown as Record<string, unknown>)[fieldName] = parsedElements;
  }

  return { ledger, warnings, elementCount };
}
