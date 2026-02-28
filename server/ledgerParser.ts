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
  AnalysisPass: "analysis_pass_register",
};

const REGISTER_HEADING_TO_TYPE: Record<string, string> = {
  SourceRegister: "Source",
  FindingRegister: "Finding",
  FindingsRegister: "Finding",
  GapRegister: "Gap",
  ZachmanCellRegister: "ZachmanCell",
  TraceRegister: "Trace",
  DomainRegister: "Domain",
  RequirementRegister: "Requirement",
  RiskRegister: "Risk",
  IssueRegister: "Issue",
  QuestionRegister: "Question",
  AnswerRegister: "Answer",
  AssumptionRegister: "Assumption",
  ConstraintRegister: "Constraint",
  CandidateRequirementRegister: "CandidateRequirement",
  SuggestionRegister: "Suggestion",
  DecisionRegister: "Decision",
  CoverageItemRegister: "CoverageItem",
  CoverageRegister: "CoverageItem",
  EvaluationRegister: "Evaluation",
  ViolationRegister: "Violation",
  StakeholderRegister: "Stakeholder",
  NarrativeSummaryRegister: "NarrativeSummary",
  SegmentRegister: "Segment",
  SourceAtomRegister: "SourceAtom",
  CellContentItemRegister: "CellContentItem",
  CellRelationshipRegister: "CellRelationship",
  ChecklistRegister: "Checklist",
  StructuralRepresentationRegister: "StructuralRepresentation",
  ControlArtefactRegister: "ControlArtefact",
  SignalRegister: "Signal",
  ConcernRegister: "Concern",
  ClosureMatrixRegister: "ClosureMatrix",
  BaselineRegister: "Baseline",
  ChangeRecordRegister: "ChangeRecord",
  AnalysisPassRegister: "AnalysisPass",
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

function isRealH3Heading(line: string): boolean {
  if (!line.startsWith("### ")) return false;
  if (line.startsWith("#### ")) return false;
  const rest = line.slice(4).trim();
  if (rest.startsWith("**") && !rest.endsWith("Register")) return false;
  if (rest.startsWith("#")) return false;
  return true;
}

function splitElements(sectionContent: string): Element[] {
  const elements: Element[] = [];
  const lines = sectionContent.split("\n");
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (isRealH3Heading(line)) {
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

interface SubElement {
  heading: string;
  content: string;
}

function isRealH4Heading(line: string): boolean {
  if (!line.startsWith("#### ")) return false;
  const rest = line.slice(5).trim();
  if (rest.startsWith("**")) return false;
  if (rest.startsWith("#")) return false;
  if (/^\d+[\.\)]/.test(rest)) return false;
  if (rest.length === 0) return false;
  return /^[A-Za-z]/.test(rest);
}

function splitSubElements(content: string): SubElement[] {
  const elements: SubElement[] = [];
  const lines = content.split("\n");
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (isRealH4Heading(line)) {
      if (currentHeading) {
        elements.push({ heading: currentHeading, content: currentLines.join("\n") });
      }
      currentHeading = line.slice(5).trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading) {
    elements.push({ heading: currentHeading, content: currentLines.join("\n") });
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

function coerceValue(value: string): string | number | boolean {
  if (value === "true" || value === "True") return true;
  if (value === "false" || value === "False") return false;
  if (value === "None" || value === "null" || value === "none") return "";
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== "") return num;
  return value;
}

function extractMarkdownData(text: string): Record<string, unknown> | null {
  const lines = text.split("\n");
  const result: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let currentList: unknown[] | null = null;
  let isNestedObject = false;
  let nestedObject: Record<string, unknown> = {};

  for (const line of lines) {
    const topMatch = line.match(/^- \*\*(\w[\w_-]*)\*\*:\s*(.*)/);
    if (topMatch) {
      if (currentKey && currentList !== null) {
        if (isNestedObject && Object.keys(nestedObject).length > 0) {
          result[currentKey] = nestedObject;
        } else {
          result[currentKey] = currentList;
        }
      }

      const key = topMatch[1];
      const value = topMatch[2].trim();

      if (value === "" || value === "None" || value === "none" || value === "null") {
        currentKey = key;
        currentList = [];
        isNestedObject = false;
        nestedObject = {};
      } else {
        result[key] = coerceValue(value);
        currentKey = null;
        currentList = null;
        isNestedObject = false;
        nestedObject = {};
      }
      continue;
    }

    const subKvMatch = line.match(/^\s{2,}- \*\*(\w[\w_-]*)\*\*:\s*(.*)/);
    if (subKvMatch && currentKey) {
      isNestedObject = true;
      nestedObject[subKvMatch[1]] = coerceValue(subKvMatch[2].trim());
      continue;
    }

    const subItemMatch = line.match(/^\s{2,}- (.+)/);
    if (subItemMatch && currentKey) {
      if (!isNestedObject) {
        if (!currentList) currentList = [];
        currentList.push(coerceValue(subItemMatch[1].trim()));
      }
      continue;
    }
  }

  if (currentKey && currentList !== null) {
    if (isNestedObject && Object.keys(nestedObject).length > 0) {
      result[currentKey] = nestedObject;
    } else {
      result[currentKey] = currentList;
    }
  }

  if (Object.keys(result).length === 0) return null;
  return result;
}

function extractData(text: string): Record<string, unknown> | null {
  const yamlStr = extractYaml(text);
  if (yamlStr) {
    const data = safeYamlLoad(yamlStr);
    if (data && typeof data === "object") return data as Record<string, unknown>;
  }
  return extractMarkdownData(text);
}

function extractAllData(text: string): Record<string, unknown>[] {
  const yamlBlocks = extractAllYamlBlocks(text);
  if (yamlBlocks.length > 0) {
    const results: Record<string, unknown>[] = [];
    for (const block of yamlBlocks) {
      const data = safeYamlLoad(block);
      if (data && typeof data === "object") results.push(data as Record<string, unknown>);
    }
    return results;
  }
  const md = extractMarkdownData(text);
  if (md) return [md];
  return [];
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

function processRegisterData(data: Record<string, unknown>, headingHint: string): { registerType: string; register: Register } | null {
  let registerType = data.register_type ? String(data.register_type) : "";
  if (!registerType && headingHint) {
    registerType = REGISTER_HEADING_TO_TYPE[headingHint] || "";
  }
  if (!registerType) return null;

  const fieldName = REGISTER_TYPE_TO_FIELD[registerType];
  if (!fieldName) return null;

  const register: Register = {
    register_id: String(data.register_id || ""),
    register_type: registerType,
    member_ids: Array.isArray(data.member_ids)
      ? data.member_ids.map(String)
      : [],
    completeness_rule: String(data.completeness_rule || ""),
    confidence: typeof data.confidence === "number" ? data.confidence : undefined,
  };

  return { registerType, register };
}

function parseElementsSection(
  content: string,
  warnings: ParseWarning[],
  ledger: CanonicalLedger
): number {
  let elementCount = 0;
  const subsections = splitElements(content);

  for (const subsection of subsections) {
    const fieldName = SECTION_TO_FIELD[subsection.heading];
    if (!fieldName) {
      warnings.push({
        section: "Elements",
        element: subsection.heading,
        message: "Unknown element category, skipped",
      });
      continue;
    }

    const subElements = splitSubElements(subsection.yamlContent);
    const parsedElements: unknown[] = [];

    for (const el of subElements) {
      const dataList = extractAllData(el.content);
      if (dataList.length === 0) {
        warnings.push({
          section: subsection.heading,
          element: el.heading,
          message: "No data found",
        });
        continue;
      }
      for (const data of dataList) {
        parsedElements.push(data);
        elementCount++;
      }
    }

    const existing = (ledger as unknown as Record<string, unknown>)[fieldName];
    if (Array.isArray(existing) && existing.length > 0) {
      (ledger as unknown as Record<string, unknown>)[fieldName] = [...existing, ...parsedElements];
    } else {
      (ledger as unknown as Record<string, unknown>)[fieldName] = parsedElements;
    }
  }

  return elementCount;
}

export function parseLedgerMarkdown(markdown: string): ParseResult {
  const warnings: ParseWarning[] = [];
  const ledger = createEmptyLedger();
  let elementCount = 0;

  const sections = splitSections(markdown);

  for (const section of sections) {
    if (section.name === "Run Metadata" || section.name === "Run Configuration" || section.name === "Inputs") {
      continue;
    }

    if (section.name === "CanonicalLedger") {
      const data = extractData(section.content);
      if (data) {
        ledger.ledger_id = String(data.ledger_id || "");
        ledger.version = String(data.version || data.ledger_spec_version || "");
        const rawDate = data.created_date || data.created_utc || "";
        ledger.created_utc = rawDate instanceof Date ? rawDate.toISOString() : String(rawDate);
        ledger.row_target = data.row_target ? String(data.row_target) : undefined;
      }
      continue;
    }

    if (section.name === "Registers") {
      const elements = splitElements(section.content);
      for (const el of elements) {
        const data = extractData(el.yamlContent);
        if (!data) {
          warnings.push({
            section: "Registers",
            element: el.heading,
            message: "No data found",
          });
          continue;
        }
        const result = processRegisterData(data, el.heading);
        if (result) {
          const fieldName = REGISTER_TYPE_TO_FIELD[result.registerType];
          (ledger as unknown as Record<string, unknown>)[fieldName] = result.register;
          elementCount++;
        } else {
          warnings.push({
            section: "Registers",
            element: el.heading,
            message: `Unknown register type from heading: ${el.heading}`,
          });
        }
      }
      continue;
    }

    if (section.name === "Elements") {
      elementCount += parseElementsSection(section.content, warnings, ledger);
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
      const dataList = extractAllData(el.yamlContent);
      if (dataList.length === 0) {
        const subElements = splitSubElements(el.yamlContent);
        if (subElements.length > 0) {
          for (const subEl of subElements) {
            const subDataList = extractAllData(subEl.content);
            for (const data of subDataList) {
              parsedElements.push(data);
              elementCount++;
            }
          }
        } else {
          warnings.push({
            section: section.name,
            element: el.heading,
            message: "No data found",
          });
        }
        continue;
      }

      for (const data of dataList) {
        parsedElements.push(data);
        elementCount++;
      }
    }

    (ledger as unknown as Record<string, unknown>)[fieldName] = parsedElements;
  }

  return { ledger, warnings, elementCount };
}
