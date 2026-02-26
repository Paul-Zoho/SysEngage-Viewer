import { useQuery } from "@tanstack/react-query";
import type { Decision } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Milestone } from "lucide-react";

export default function Decisions() {
  const { data: decisions, isLoading } = useQuery<Decision[]>({ queryKey: ["/api/ledger/decisions"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Decisions"
        description="Governance and architectural decisions with traceability and rationale"
        icon={<Milestone className="w-5 h-5 text-primary" />}
      />
      <div className="space-y-3">
        {decisions?.map((dec) => (
          <Card key={dec.decision_id} className="hover-elevate" data-testid={`card-decision-${dec.decision_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <ElementId id={dec.decision_id} />
                    <StatusBadge status={dec.status} />
                    {dec.decision_type && <Badge variant="outline" className="text-[10px]">{dec.decision_type}</Badge>}
                    <ConfidenceIndicator value={dec.confidence} showLabel />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" data-testid={`text-decision-title-${dec.decision_id}`}>{dec.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{dec.description}</p>
                  {dec.rationale && (
                    <div className="bg-muted/50 rounded-md p-2.5 mb-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Rationale</p>
                      <p className="text-xs">{dec.rationale}</p>
                    </div>
                  )}
                  {dec.related_element_ids && <ElementRefList refs={dec.related_element_ids} label="Related" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
