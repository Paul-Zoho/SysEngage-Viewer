import { useQuery } from "@tanstack/react-query";
import type { CoverageItem } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId } from "@/components/element-id";
import { StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Coverage() {
  const { data: coverage, isLoading } = useQuery<CoverageItem[]>({ queryKey: ["/api/ledger/coverage"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  const covered = coverage?.filter(c => c.coverage_state === "Covered").length || 0;
  const partial = coverage?.filter(c => c.coverage_state === "PartiallyCovered").length || 0;
  const notCovered = coverage?.filter(c => c.coverage_state === "NotCovered").length || 0;
  const total = coverage?.length || 0;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Coverage Analysis"
        description="Assessment of completeness and alignment across requirements, cells, and domains"
        icon={<BarChart3 className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card data-testid="card-coverage-covered">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[hsl(122,43%,45%)]">{covered}</p>
            <p className="text-xs text-muted-foreground">Covered</p>
          </CardContent>
        </Card>
        <Card data-testid="card-coverage-partial">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[hsl(43,74%,42%)]">{partial}</p>
            <p className="text-xs text-muted-foreground">Partially Covered</p>
          </CardContent>
        </Card>
        <Card data-testid="card-coverage-not">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-[hsl(0,84%,42%)]">{notCovered}</p>
            <p className="text-xs text-muted-foreground">Not Covered</p>
          </CardContent>
        </Card>
      </div>

      {total > 0 && (
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
          {covered > 0 && <div className="bg-[hsl(122,43%,45%)] rounded-full" style={{ width: `${(covered / total) * 100}%` }} />}
          {partial > 0 && <div className="bg-[hsl(43,74%,42%)] rounded-full" style={{ width: `${(partial / total) * 100}%` }} />}
          {notCovered > 0 && <div className="bg-[hsl(0,84%,42%)] rounded-full" style={{ width: `${(notCovered / total) * 100}%` }} />}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[80px]">Target</TableHead>
                <TableHead className="w-[120px]">State</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]">Pass</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coverage?.map((item) => (
                <TableRow key={item.coverage_id} data-testid={`row-coverage-${item.coverage_id}`}>
                  <TableCell><ElementId id={item.coverage_id} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{item.coverage_type}</Badge>
                  </TableCell>
                  <TableCell><ElementId id={item.target_id} /></TableCell>
                  <TableCell><StatusBadge status={item.coverage_state} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    {item.notes ? <p className="line-clamp-2">{item.notes}</p> : <span>--</span>}
                  </TableCell>
                  <TableCell><ElementId id={item.produced_by_pass_id} /></TableCell>
                  <TableCell className="text-center">
                    <ConfidenceIndicator value={item.confidence} showLabel />
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
