import { useQuery } from "@tanstack/react-query";
import type { Stakeholder } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function Stakeholders() {
  const { data: stakeholders, isLoading } = useQuery<Stakeholder[]>({ queryKey: ["/api/ledger/stakeholders"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Stakeholders"
        description="Key stakeholders and their roles, concerns, and domain associations"
        icon={<Users className="w-5 h-5 text-primary" />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stakeholders?.map((sh) => (
          <Card key={sh.stakeholder_id} className="hover-elevate" data-testid={`card-stakeholder-${sh.stakeholder_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ElementId id={sh.stakeholder_id} />
                    <ConfidenceIndicator value={sh.confidence} />
                  </div>
                  <h3 className="text-sm font-semibold" data-testid={`text-stakeholder-name-${sh.stakeholder_id}`}>{sh.name}</h3>
                  {sh.role && <Badge variant="outline" className="text-[10px] mt-1">{sh.role}</Badge>}
                  {sh.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{sh.description}</p>
                  )}
                  {sh.domain_refs && sh.domain_refs.length > 0 && (
                    <div className="mt-2">
                      <ElementRefList refs={sh.domain_refs} label="Domains" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
