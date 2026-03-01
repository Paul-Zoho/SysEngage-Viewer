import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId } from "@/components/element-id";
import { StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function getState(item: any): string {
  return item.coverage_state || item.row1_relevance || "Unknown";
}

function getTarget(item: any): string {
  return item.target_id || item.target_ref || "";
}

function getNotes(item: any): string {
  return item.notes || item.coverage_statement || "";
}

function getPassId(item: any): string {
  return item.produced_by_pass_id || "";
}

export default function Coverage() {
  const { data: coverage, isLoading } = useQuery<any[]>({ queryKey: ["/api/ledger/coverage"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  const total = coverage?.length || 0;

  const stateCounts = new Map<string, number>();
  coverage?.forEach(c => {
    const state = getState(c);
    stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
  });

  const stateColorMap: Record<string, string> = {
    Covered: "text-[hsl(122,43%,45%)]",
    RELEVANT: "text-[hsl(122,43%,45%)]",
    PartiallyCovered: "text-[hsl(43,74%,42%)]",
    NOT_RELEVANT: "text-[hsl(43,74%,42%)]",
    NotCovered: "text-[hsl(0,84%,42%)]",
    Unknown: "text-muted-foreground",
  };

  const stateBarColorMap: Record<string, string> = {
    Covered: "bg-[hsl(122,43%,45%)]",
    RELEVANT: "bg-[hsl(122,43%,45%)]",
    PartiallyCovered: "bg-[hsl(43,74%,42%)]",
    NOT_RELEVANT: "bg-[hsl(43,74%,42%)]",
    NotCovered: "bg-[hsl(0,84%,42%)]",
    Unknown: "bg-muted",
  };

  const sortedStates = Array.from(stateCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Coverage Analysis"
        description="Assessment of completeness and alignment across requirements, cells, and domains"
        icon={<BarChart3 className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Card data-testid="card-coverage-total">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        {sortedStates.slice(0, 3).map(([state, count]) => (
          <Card key={state} data-testid={`card-coverage-${state.toLowerCase()}`}>
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold ${stateColorMap[state] || "text-muted-foreground"}`}>{count}</p>
              <p className="text-xs text-muted-foreground">{state.replace(/_/g, " ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {total > 0 && (
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
          {sortedStates.map(([state, count]) => (
            <div key={state} className={`${stateBarColorMap[state] || "bg-muted"} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[130px]">Type</TableHead>
                <TableHead className="w-[120px]">Target</TableHead>
                <TableHead className="w-[120px]">State</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coverage?.map((item: any) => {
                const state = getState(item);
                const target = getTarget(item);
                const notes = getNotes(item);
                const passId = getPassId(item);
                return (
                  <TableRow key={item.coverage_id || item.id} data-testid={`row-coverage-${item.coverage_id || item.id}`}>
                    <TableCell><ElementId id={item.coverage_id || item.id} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{item.coverage_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {/^[A-Z]+-\d+/.test(target) ? <ElementId id={target} /> : <span className="text-xs font-mono text-muted-foreground">{target || "--"}</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={state} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      <div className="space-y-0.5">
                        {notes && <p className="line-clamp-2">{notes}</p>}
                        {passId && <div className="flex items-center gap-1"><span className="text-[10px]">Pass:</span> <ElementId id={passId} /></div>}
                        {item.section_anchor && <span className="text-[10px] font-mono">Anchor: {item.section_anchor}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ConfidenceIndicator value={item.confidence} showLabel />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
