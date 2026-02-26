import { useQuery } from "@tanstack/react-query";
import type { Trace } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const traceTypeLabels: Record<string, { label: string; desc: string }> = {
  ST: { label: "Source Trace", desc: "Direct provenance from source" },
  DT: { label: "Derived Trace", desc: "Interpretive derivation" },
  GT: { label: "General Trace", desc: "General relationship" },
  AT: { label: "Analytical Trace", desc: "Analysis-produced relationship" },
};

export default function Traces() {
  const { data: traces, isLoading } = useQuery<Trace[]>({ queryKey: ["/api/ledger/traces"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Traceability"
        description="Explicit relationships between ledger elements supporting provenance and impact analysis"
        icon={<GitBranch className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {Object.entries(traceTypeLabels).map(([key, val]) => {
          const count = traces?.filter(t => t.trace_type === key).length || 0;
          return (
            <Card key={key} data-testid={`card-trace-type-${key}`}>
              <CardContent className="p-3 text-center">
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{key}</Badge>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] text-muted-foreground">{val.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">ID</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead className="w-[80px]">From</TableHead>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead className="w-[80px]">To</TableHead>
                <TableHead>Rationale</TableHead>
                <TableHead className="w-[70px]">Magnitude</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traces?.map((trace) => (
                <TableRow key={trace.trace_id} data-testid={`row-trace-${trace.trace_id}`}>
                  <TableCell><ElementId id={trace.trace_id} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">{trace.trace_type}</Badge>
                  </TableCell>
                  <TableCell><ElementId id={trace.from_id} /></TableCell>
                  <TableCell>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </TableCell>
                  <TableCell><ElementId id={trace.to_id} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    <p className="line-clamp-2">{trace.rationale}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {trace.interpretation_magnitude !== undefined ? (
                      <span className="text-xs font-mono">{trace.interpretation_magnitude.toFixed(1)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <ConfidenceIndicator value={trace.confidence} showLabel />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
