import { useQuery } from "@tanstack/react-query";
import type { CanonicalLedger, Register } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Database, ChevronRight, FolderOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegisterViewProps {
  register: Register;
  label: string;
}

function RegisterView({ register, label }: RegisterViewProps) {
  return (
    <AccordionItem value={register.register_id}>
      <AccordionTrigger className="py-2 px-3 text-sm hover:no-underline">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium">{label}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{register.member_ids.length}</Badge>
          <code className="text-[10px] font-mono text-muted-foreground ml-auto mr-2">{register.register_id}</code>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2 px-3">
        <div className="space-y-2 pl-6">
          <p className="text-[10px] text-muted-foreground leading-relaxed">{register.completeness_rule}</p>
          <div className="flex items-start gap-1 flex-wrap">
            <span className="text-[10px] text-muted-foreground font-medium">Type:</span>
            <Badge variant="outline" className="text-[10px]">{register.register_type}</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-medium">Members ({register.member_ids.length}):</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {register.member_ids.map((id) => (
                <code key={id} className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded-sm text-primary">{id}</code>
              ))}
            </div>
          </div>
          {register.confidence !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Confidence:</span>
              <span className="text-[10px] font-mono">{Math.round(register.confidence * 100)}%</span>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function Explorer() {
  const { data: ledger, isLoading } = useQuery<CanonicalLedger>({ queryKey: ["/api/ledger"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
    );
  }

  if (!ledger) return null;

  const registerGroups = [
    { label: "Source Register", register: ledger.source_register },
    { label: "Findings Register", register: ledger.findings_register },
    { label: "Gap Register", register: ledger.gap_register },
    { label: "Zachman Cell Register", register: ledger.zachman_cell_register },
    { label: "Trace Register", register: ledger.trace_register },
    { label: "Domain Register", register: ledger.domain_register },
    { label: "Requirement Register", register: ledger.requirement_register },
    { label: "Active Risk Register", register: ledger.active_risk_register },
    { label: "Issue Register", register: ledger.issue_register },
    { label: "Question Register", register: ledger.question_register },
    { label: "Answer Register", register: ledger.answer_register },
    { label: "Assumption Register", register: ledger.assumption_register },
    { label: "Constraint Register", register: ledger.constraint_register },
    { label: "Candidate Requirement Register", register: ledger.candidate_requirement_register },
    { label: "Suggestion Register", register: ledger.suggestion_register },
    { label: "Decision Register", register: ledger.decision_register },
    { label: "Coverage Register", register: ledger.coverage_register },
    { label: "Evaluation Register", register: ledger.evaluation_register },
    { label: "Violation Register", register: ledger.violation_register },
    { label: "Stakeholder Register", register: ledger.stakeholder_register },
    { label: "Narrative Summary Register", register: ledger.narrative_summary_register },
    { label: "Segment Register", register: ledger.segment_register },
    { label: "Source Atom Register", register: ledger.source_atom_register },
    { label: "Cell Content Item Register", register: ledger.cell_content_item_register },
    { label: "Cell Relationship Register", register: ledger.cell_relationship_register },
    { label: "Checklist Register", register: ledger.checklist_register },
    { label: "Structural Representation Register", register: ledger.structural_representation_register },
    { label: "Control Artefact Register", register: ledger.control_artefact_register },
    { label: "Signal Register", register: ledger.signal_register },
    { label: "Concern Register", register: ledger.concern_register },
    { label: "Closure Matrix Register", register: ledger.closure_matrix_register },
    { label: "Baseline Register", register: ledger.baseline_register },
    { label: "Change Record Register", register: ledger.change_record_register },
  ];

  const elementCounts = [
    { type: "Source", count: ledger.sources.length },
    { type: "Finding", count: ledger.findings.length },
    { type: "Gap", count: ledger.gaps.length },
    { type: "Requirement", count: ledger.requirements.length },
    { type: "Risk", count: ledger.risks.length },
    { type: "Issue", count: ledger.issues.length },
    { type: "Trace", count: ledger.traces.length },
    { type: "Decision", count: ledger.decisions.length },
    { type: "Domain", count: ledger.domains.length },
    { type: "ZachmanCell", count: ledger.zachman_cells.length },
    { type: "Question", count: ledger.questions.length },
    { type: "Answer", count: ledger.answers.length },
    { type: "Assumption", count: ledger.assumptions.length },
    { type: "Constraint", count: ledger.constraints.length },
    { type: "CandidateRequirement", count: ledger.candidate_requirements.length },
    { type: "Suggestion", count: ledger.suggestions.length },
    { type: "CoverageItem", count: ledger.coverage_items.length },
    { type: "Rule", count: ledger.rules.length },
    { type: "Evaluation", count: ledger.evaluations.length },
    { type: "Violation", count: ledger.violations.length },
    { type: "AnalysisPass", count: ledger.analysis_passes.length },
    { type: "Stakeholder", count: ledger.stakeholders.length },
    { type: "NarrativeSummary", count: ledger.narrative_summaries.length },
    { type: "Segment", count: ledger.segments.length },
    { type: "SourceAtom", count: ledger.source_atoms.length },
    { type: "CellContentItem", count: ledger.cell_content_items.length },
    { type: "CellRelationship", count: ledger.cell_relationships.length },
    { type: "Checklist", count: ledger.checklists.length },
    { type: "StructuralRepresentation", count: ledger.structural_representations.length },
    { type: "ControlArtefact", count: ledger.control_artefacts.length },
    { type: "Signal", count: ledger.signals.length },
    { type: "Concern", count: ledger.concerns.length },
    { type: "ClosureMatrix", count: ledger.closure_matrices.length },
    { type: "Baseline", count: ledger.baselines.length },
    { type: "ChangeRecord", count: ledger.change_records.length },
  ];

  const totalElements = elementCounts.reduce((s, e) => s + e.count, 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Ledger Explorer"
        description={`Complete canonical ledger structure - ${ledger.ledger_id}`}
        icon={<Database className="w-5 h-5 text-primary" />}
      >
        <Badge variant="outline" className="font-mono text-xs">{ledger.version}</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card data-testid="card-ledger-meta">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Ledger Metadata
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ledger ID</span>
                  <code className="font-mono text-primary">{ledger.ledger_id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <code className="font-mono">{ledger.version}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-mono text-[11px]">{new Date(ledger.created_utc).toLocaleDateString()}</span>
                </div>
                {ledger.row_target && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Row Target</span>
                    <span>{ledger.row_target}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Elements</span>
                  <span className="font-bold">{totalElements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registers</span>
                  <span className="font-bold">{registerGroups.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-3" data-testid="card-element-inventory">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Element Inventory</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {elementCounts.filter(e => e.count > 0).sort((a, b) => b.count - a.count).map((e) => (
                    <div key={e.type} className="flex items-center justify-between py-1 px-2 rounded-sm hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">{e.type}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 min-w-[24px] justify-center">{e.count}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card data-testid="card-registers">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  Registers ({registerGroups.length})
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Authoritative membership sets for each element type</p>
              </div>
              <ScrollArea className="h-[600px]">
                <Accordion type="multiple" className="w-full">
                  {registerGroups.map((rg) => (
                    <RegisterView key={rg.register.register_id} register={rg.register} label={rg.label} />
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
