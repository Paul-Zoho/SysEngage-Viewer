import { useQuery } from "@tanstack/react-query";
import type { Domain } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ElementId } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";

export default function Domains() {
  const { data: domains, isLoading } = useQuery<Domain[]>({ queryKey: ["/api/ledger/domains"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Domains"
        description="Classification domains organising and contextualising ledger elements"
        icon={<Layers className="w-5 h-5 text-primary" />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {domains?.map((domain) => (
          <Card key={domain.domain_id} className="hover-elevate" data-testid={`card-domain-${domain.domain_id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ElementId id={domain.domain_id} />
                    <h3 className="text-sm font-semibold" data-testid={`text-domain-name-${domain.domain_id}`}>{domain.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{domain.description}</p>
                  {domain.parent_domain_ref && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[10px] text-muted-foreground">Parent:</span>
                      <ElementId id={domain.parent_domain_ref} />
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
