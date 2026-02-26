import { useQuery } from "@tanstack/react-query";
import type { Requirement } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { SeverityBadge, StatusBadge } from "@/components/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Requirements() {
  const { data: requirements, isLoading } = useQuery<Requirement[]>({ queryKey: ["/api/ledger/requirements"] });

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
        title="Requirements"
        description="Normative obligations and constraints within the ledger scope"
        icon={<ClipboardList className="w-5 h-5 text-primary" />}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">ID</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[80px]">Priority</TableHead>
                <TableHead className="w-[100px]">Verification</TableHead>
                <TableHead className="w-[100px]">Sources</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements?.map((req) => (
                <TableRow key={req.requirement_id} data-testid={`row-req-${req.requirement_id}`}>
                  <TableCell><ElementId id={req.requirement_id} /></TableCell>
                  <TableCell className="text-sm max-w-sm">
                    <p className="line-clamp-2">{req.statement}</p>
                    {req.fit_criteria && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">Fit: {req.fit_criteria}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{req.requirement_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {req.priority && <SeverityBadge severity={req.priority} />}
                  </TableCell>
                  <TableCell>
                    {req.verification_method && (
                      <Badge variant="secondary" className="text-[10px]">{req.verification_method}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <ElementRefList refs={req.source_refs} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ConfidenceIndicator value={req.confidence} showLabel />
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
