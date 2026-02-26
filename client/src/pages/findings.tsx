import { useQuery } from "@tanstack/react-query";
import type { Finding } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { SeverityBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function Findings() {
  const { data: findings, isLoading } = useQuery<Finding[]>({ queryKey: ["/api/ledger/findings"] });

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
        title="Findings"
        description="Analytical observations and assessment results from evaluation passes"
        icon={<Search className="w-5 h-5 text-primary" />}
      />
      <div className="space-y-3">
        {findings?.map((finding) => (
          <Card key={finding.finding_id} className="hover-elevate" data-testid={`card-finding-${finding.finding_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <ElementId id={finding.finding_id} />
                    <SeverityBadge severity={finding.severity} />
                    <Badge variant="outline" className="text-[10px]">{finding.type}</Badge>
                    <ConfidenceIndicator value={finding.confidence} showLabel />
                  </div>
                  <p className="text-sm leading-relaxed">{finding.description}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <ElementRefList refs={finding.source_refs} label="Sources" />
                    <ElementRefList refs={finding.related_items} label="Related" />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Pass:</span>
                      <ElementId id={finding.produced_by_pass_id} />
                    </div>
                    {finding.rule_triggered && finding.rule_triggered.length > 0 && (
                      <ElementRefList refs={finding.rule_triggered} label="Rules" />
                    )}
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
