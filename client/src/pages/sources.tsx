import { useQuery } from "@tanstack/react-query";
import type { Source } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Sources() {
  const { data: sources, isLoading } = useQuery<Source[]>({ queryKey: ["/api/ledger/sources"] });

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
        title="Sources"
        description="Traceable excerpts from immutable input artefacts providing provenance anchors"
        icon={<FileText className="w-5 h-5 text-primary" />}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Source Text</TableHead>
                <TableHead className="w-[200px]">Segmentation Context</TableHead>
                <TableHead className="w-[80px]">Parent</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources?.map((source) => (
                <TableRow key={source.source_id} data-testid={`row-source-${source.source_id}`}>
                  <TableCell><ElementId id={source.source_id} /></TableCell>
                  <TableCell className="text-sm max-w-md">
                    <p className="line-clamp-3">{source.source_text}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{source.segmentation_context}</TableCell>
                  <TableCell>
                    {source.parent_source_ref ? <ElementId id={source.parent_source_ref} /> : <span className="text-xs text-muted-foreground">--</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <ConfidenceIndicator value={source.confidence} showLabel />
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
