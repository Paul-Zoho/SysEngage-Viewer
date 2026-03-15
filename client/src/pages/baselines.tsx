import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, Clock, Hash, Layers } from "lucide-react";

interface BaselineItem {
  baseline_id: string;
  name: string;
  description: string;
  baseline_type: string;
  created_utc: string;
  confidence: number;
  stepCounts?: Record<string, number>;
  totalNewElements?: number;
}

export default function Baselines() {
  const { data: baselines, isLoading, isError } = useQuery<BaselineItem[]>({
    queryKey: ["/api/ledger/baselines"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Baselines"
          description="Step history showing ledger upload checkpoints."
          icon={<Flag className="w-5 h-5 text-primary" />}
        />
        <Card>
          <CardContent className="p-8 text-center">
            <Flag className="w-12 h-12 mx-auto text-destructive mb-3" />
            <p className="text-sm text-muted-foreground" data-testid="text-baselines-error">
              Failed to load baselines. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sorted = [...(baselines || [])].map((bl) => {
    if (bl.totalNewElements === undefined && bl.description) {
      const match = bl.description.match(/(\d+)\s+new\s+elements?\s+added/i);
      if (match) {
        return { ...bl, totalNewElements: parseInt(match[1], 10) };
      }
    }
    return bl;
  }).sort((a, b) => {
    const da = a.created_utc ? new Date(a.created_utc).getTime() : 0;
    const dbTime = b.created_utc ? new Date(b.created_utc).getTime() : 0;
    return dbTime - da;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Baselines"
        description="Step history showing ledger upload checkpoints and their element contributions."
        icon={<Flag className="w-5 h-5 text-primary" />}
      />

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Flag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-baselines">
              No baselines yet. Upload a ledger in append mode to create step checkpoints.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {sorted.map((bl, idx) => (
              <div key={bl.baseline_id} className="relative pl-14" data-testid={`card-baseline-${idx}`}>
                <div className="absolute left-[18px] top-4 w-4 h-4 rounded-full bg-primary border-2 border-background z-10" />

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <CardTitle className="text-sm font-semibold" data-testid={`text-baseline-name-${idx}`}>
                        {bl.name || bl.baseline_id}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {bl.baseline_type && (
                          <Badge
                            variant={bl.baseline_type === "LedgerStep" ? "default" : "secondary"}
                            className="text-[10px]"
                            data-testid={`badge-type-${idx}`}
                          >
                            {bl.baseline_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {bl.created_utc && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span data-testid={`text-baseline-date-${idx}`}>
                          {new Date(bl.created_utc).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {bl.description && (
                      <p className="text-xs text-muted-foreground" data-testid={`text-baseline-desc-${idx}`}>
                        {bl.description}
                      </p>
                    )}

                    {bl.totalNewElements !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Hash className="w-3 h-3 text-primary" />
                        <span data-testid={`text-baseline-total-${idx}`}>
                          {bl.totalNewElements} new element{bl.totalNewElements !== 1 ? "s" : ""} added
                        </span>
                      </div>
                    )}

                    {bl.stepCounts && Object.keys(bl.stepCounts).length > 0 && (
                      <div className="flex items-start gap-1.5 text-xs">
                        <Layers className="w-3 h-3 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(bl.stepCounts)
                            .filter(([key]) => key !== "element_refs")
                            .map(([key, count]) => (
                              <Badge key={key} variant="outline" className="text-[10px] font-mono">
                                {key}: {count}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                      <span data-testid={`text-baseline-id-${idx}`}>{bl.baseline_id}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
