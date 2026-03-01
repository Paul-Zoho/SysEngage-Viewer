import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId, ElementRefList } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SplitSquareHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function getSegmentId(seg: any): string {
  return seg.segment_id || seg.id || "";
}

function getSegmentTitle(seg: any): string {
  return seg.title || seg.classification || "";
}

function getSegmentText(seg: any): string {
  return seg.description || seg.segment_text || "";
}

function getSourceRefs(seg: any): string[] {
  if (seg.source_refs && Array.isArray(seg.source_refs)) return seg.source_refs;
  if (seg.source_id) return [seg.source_id];
  return [];
}

export default function Segments() {
  const { data: segments, isLoading } = useQuery<any[]>({ queryKey: ["/api/ledger/segments"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  const total = segments?.length || 0;

  const classificationCounts = new Map<string, number>();
  segments?.forEach(seg => {
    const title = getSegmentTitle(seg);
    if (title) classificationCounts.set(title, (classificationCounts.get(title) || 0) + 1);
  });

  const topClassifications = Array.from(classificationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Segments"
        description="Logical groupings of source text organized by context and meaning"
        icon={<SplitSquareHorizontal className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Card data-testid="card-segments-total">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Segments</p>
          </CardContent>
        </Card>
        <Card data-testid="card-segments-sources">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">
              {new Set(segments?.flatMap(s => getSourceRefs(s)) || []).size}
            </p>
            <p className="text-xs text-muted-foreground">Linked Sources</p>
          </CardContent>
        </Card>
        <Card data-testid="card-segments-categories">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{classificationCounts.size}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card data-testid="card-segments-confidence">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">
              {total > 0
                ? Math.round((segments!.reduce((sum, s) => sum + (s.confidence || 0), 0) / total) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      {topClassifications.length > 0 && (
        <div className="flex flex-wrap gap-2" data-testid="section-segment-categories">
          {topClassifications.map(([title, count]) => (
            <Badge key={title} variant="outline" className="text-xs gap-1.5 px-2.5 py-1">
              {title}
              <span className="font-mono text-muted-foreground">{count}</span>
            </Badge>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">ID</TableHead>
                <TableHead className="w-[150px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[140px]">Source Refs</TableHead>
                <TableHead className="w-[60px] text-center">Conf.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments?.map((seg: any) => {
                const segId = getSegmentId(seg);
                const title = getSegmentTitle(seg);
                const text = getSegmentText(seg);
                const sourceRefs = getSourceRefs(seg);

                return (
                  <TableRow key={segId} data-testid={`row-segment-${segId}`}>
                    <TableCell><ElementId id={segId} /></TableCell>
                    <TableCell>
                      {title ? (
                        <span className="text-sm font-medium">{title}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm max-w-md">
                      <p className="line-clamp-3">{text || "--"}</p>
                      {seg.segment_index !== undefined && (
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Index: {seg.segment_index}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ElementRefList refs={sourceRefs} />
                    </TableCell>
                    <TableCell className="text-center">
                      {seg.confidence !== undefined ? (
                        <ConfidenceIndicator value={seg.confidence} showLabel />
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
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
