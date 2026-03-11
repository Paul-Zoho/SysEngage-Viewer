import { useQuery } from "@tanstack/react-query";
import type { Gap } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElementId, ElementRefList } from "@/components/element-id";
import { StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 rounded-md p-2.5 mb-3">
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
      {children}
    </div>
  );
}

export default function Gaps() {
  const { data: gaps, isLoading } = useQuery<Gap[]>({ queryKey: ["/api/ledger/gaps"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Gaps"
        description="Missing, incomplete, or unresolved conditions requiring closure tracking"
        icon={<AlertTriangle className="w-5 h-5 text-primary" />}
      />
      <div className="space-y-3">
        {gaps?.map((gap) => {
          const g = gap as any;
          return (
            <Card key={gap.gap_id} className="hover-elevate" data-testid={`card-gap-${gap.gap_id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <ElementId id={gap.gap_id} />
                      {gap.resolution_state && <StatusBadge status={gap.resolution_state} />}
                      {gap.gap_status && (
                        <Badge
                          variant="outline"
                          className="text-[10px] flex items-center gap-1"
                          data-testid={`badge-gap-status-${gap.gap_id}`}
                        >
                          {gap.gap_status === "Closed" && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                          {gap.gap_status}
                        </Badge>
                      )}
                      {gap.cell_id && <ElementId id={gap.cell_id} />}
                    </div>

                    <p className="text-sm leading-relaxed mb-3">{gap.description}</p>

                    {gap.impact && (
                      <InfoBlock label="Impact">
                        <p className="text-xs">{gap.impact}</p>
                      </InfoBlock>
                    )}

                    {gap.proposed_resolution && (
                      <InfoBlock label="Proposed Resolution">
                        <p className="text-xs">{gap.proposed_resolution}</p>
                      </InfoBlock>
                    )}

                    {gap.suggested_actions && gap.suggested_actions.length > 0 && (
                      <InfoBlock label="Suggested Actions">
                        <ul className="space-y-1" data-testid={`list-suggested-actions-${gap.gap_id}`}>
                          {gap.suggested_actions.map((action: string, i: number) => (
                            <li key={i} className="text-xs flex gap-1.5">
                              <span className="text-muted-foreground shrink-0">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </InfoBlock>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      {gap.linked_requirements && gap.linked_requirements.length > 0 && (
                        <ElementRefList refs={gap.linked_requirements} label="Requirements" />
                      )}
                      {gap.linked_suggestions && gap.linked_suggestions.length > 0 && (
                        <ElementRefList refs={gap.linked_suggestions} label="Suggestions" />
                      )}
                      {gap.affected_cells && gap.affected_cells.length > 0 && (
                        <ElementRefList refs={gap.affected_cells} label="Cells" />
                      )}
                      {gap.domain_refs && gap.domain_refs.length > 0 && (
                        <ElementRefList refs={gap.domain_refs} label="Domains" />
                      )}
                      {gap.produced_from_finding_ids && gap.produced_from_finding_ids.length > 0 && (
                        <ElementRefList refs={gap.produced_from_finding_ids} label="From Findings" />
                      )}
                      {gap.traceability && gap.traceability.length > 0 && (
                        <ElementRefList refs={gap.traceability} label="Traces" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
