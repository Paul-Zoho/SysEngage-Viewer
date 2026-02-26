import { useQuery } from "@tanstack/react-query";
import type { Issue } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Issues() {
  const { data: issues, isLoading } = useQuery<Issue[]>({ queryKey: ["/api/ledger/issues"] });

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
        title="Issues"
        description="Active problems and defects requiring resolution tracking"
        icon={<AlertCircle className="w-5 h-5 text-primary" />}
      />
      <div className="space-y-3">
        {issues?.map((issue) => (
          <Card key={issue.issue_id} className="hover-elevate" data-testid={`card-issue-${issue.issue_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <ElementId id={issue.issue_id} />
                    <SeverityBadge severity={issue.severity} />
                    <StatusBadge status={issue.status} />
                    <ConfidenceIndicator value={issue.confidence} showLabel />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" data-testid={`text-issue-title-${issue.issue_id}`}>{issue.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{issue.description}</p>
                  {issue.resolution_summary && (
                    <div className="bg-muted/50 rounded-md p-2.5 mb-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Resolution</p>
                      <p className="text-xs">{issue.resolution_summary}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    {issue.owner && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">Owner:</span>
                        <span className="text-xs font-medium">{issue.owner}</span>
                      </div>
                    )}
                    {issue.related_element_ids && <ElementRefList refs={issue.related_element_ids} label="Related" />}
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
