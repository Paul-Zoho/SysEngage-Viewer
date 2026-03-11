import { useQuery } from "@tanstack/react-query";
import type { Risk } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";

export default function Risks() {
  const { data: risks, isLoading } = useQuery<Risk[]>({ queryKey: ["/api/ledger/risks"] });

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
        title="Risk Register"
        description="Potential adverse conditions and uncertainties affecting objectives"
        icon={<ShieldAlert className="w-5 h-5 text-primary" />}
      />
      <div className="space-y-3">
        {risks?.map((risk) => {
          const desc = risk.description || risk.risk_description;
          const likelihood = risk.likelihood || risk.risk_likelihood;
          const impact = risk.impact || risk.risk_impact;
          const mitText = risk.mitigation || risk.mitigation_strategy;
          const refs = risk.related_element_ids || risk.linked_elements;

          return (
            <Card key={risk.risk_id} className="hover-elevate" data-testid={`card-risk-${risk.risk_id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <ElementId id={risk.risk_id} />
                      <StatusBadge status={risk.status} />
                      {risk.risk_level && (
                        <Badge variant="outline" className="text-[10px]" data-testid={`badge-risk-level-${risk.risk_id}`}>
                          {risk.risk_level}
                        </Badge>
                      )}
                      {risk.category && <Badge variant="outline" className="text-[10px]">{risk.category}</Badge>}
                      <ConfidenceIndicator value={risk.confidence} showLabel />
                    </div>
                    {risk.title && <h3 className="text-sm font-semibold mb-1" data-testid={`text-risk-title-${risk.risk_id}`}>{risk.title}</h3>}
                    {desc && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{desc}</p>}

                    {(likelihood || impact || risk.exposure) && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-muted/50 rounded-md p-2">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Likelihood</p>
                          <SeverityBadge severity={likelihood} />
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Impact</p>
                          <SeverityBadge severity={impact} />
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Exposure</p>
                          <SeverityBadge severity={risk.exposure} />
                        </div>
                      </div>
                    )}

                    {mitText && (
                      <div className="bg-muted/50 rounded-md p-2.5 mb-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Mitigation</p>
                        <p className="text-xs">{mitText}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      {risk.owner && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Owner:</span>
                          <span className="text-xs font-medium">{risk.owner}</span>
                        </div>
                      )}
                      {refs && refs.length > 0 && <ElementRefList refs={refs} label="Related" />}
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
