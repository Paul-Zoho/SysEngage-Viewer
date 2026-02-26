import { useQuery } from "@tanstack/react-query";
import type { Gap } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ElementId, ElementRefList } from "@/components/element-id";
import { StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

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
        {gaps?.map((gap) => (
          <Card key={gap.gap_id} className="hover-elevate" data-testid={`card-gap-${gap.gap_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <ElementId id={gap.gap_id} />
                    {gap.resolution_state && <StatusBadge status={gap.resolution_state} />}
                  </div>
                  <p className="text-sm leading-relaxed mb-2">{gap.description}</p>
                  <div className="bg-muted/50 rounded-md p-2.5 mb-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Impact</p>
                    <p className="text-xs">{gap.impact}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md p-2.5 mb-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Proposed Resolution</p>
                    <p className="text-xs">{gap.proposed_resolution}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <ElementRefList refs={gap.affected_cells} label="Cells" />
                    <ElementRefList refs={gap.domain_refs} label="Domains" />
                    <ElementRefList refs={gap.produced_from_finding_ids} label="From Findings" />
                    <ElementRefList refs={gap.traceability} label="Traces" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
