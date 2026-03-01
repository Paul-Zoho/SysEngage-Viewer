import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementId } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Network, Hash, Link2, Crown, BarChart3, X, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RelNode {
  id: string;
  type: string;
  title: string;
}

interface RelEdge {
  from: string;
  to: string;
  relationship: string;
  detail?: string;
}

interface RelationshipData {
  nodes: RelNode[];
  edges: RelEdge[];
}

const ELEMENT_TYPES = [
  "Source", "Domain", "Requirement", "Finding", "Gap", "Risk", "Issue",
  "Decision", "Trace", "Question", "Answer", "Assumption", "Constraint",
  "CandidateRequirement", "Suggestion", "CoverageItem", "Evaluation",
  "Violation", "Stakeholder", "AnalysisPass", "ZachmanCell", "Segment",
  "SourceAtom", "Signal", "Concern", "Baseline", "ChangeRecord",
  "NarrativeSummary", "StructuralRepresentation", "ControlArtefact",
];

const relationshipColors: Record<string, string> = {
  "trace:ST": "bg-[hsl(211,100%,40%)] text-white",
  "trace:DT": "bg-[hsl(237,43%,48%)] text-white",
  "trace:GT": "bg-[hsl(174,72%,32%)] text-white",
  "trace:AT": "bg-[hsl(43,74%,42%)] text-white",
  "source_ref": "bg-[hsl(280,60%,45%)] text-white",
  "domain_ref": "bg-[hsl(122,43%,45%)] text-white",
  "related": "bg-[hsl(0,84%,42%)] text-white",
  "affected": "bg-[hsl(25,95%,45%)] text-white",
  "affects": "bg-[hsl(25,95%,45%)] text-white",
  "affects_cell": "bg-[hsl(25,95%,45%)] text-white",
  "produced_from": "bg-[hsl(330,65%,45%)] text-white",
  "produced_by": "bg-[hsl(330,65%,45%)] text-white",
  "answers": "bg-[hsl(190,70%,35%)] text-white",
};

export default function Relationships() {
  const { data, isLoading } = useQuery<RelationshipData>({
    queryKey: ["/api/ledger/relationships"],
  });

  const [selectedCell, setSelectedCell] = useState<{ fromType: string; toType: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState("all");

  const nodeMap = useMemo(() => {
    if (!data) return new Map<string, RelNode>();
    const map = new Map<string, RelNode>();
    data.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [data]);

  const activeTypes = useMemo(() => {
    if (!data) return [];
    const types = new Set<string>();
    data.nodes.forEach((n) => types.add(n.type));
    return ELEMENT_TYPES.filter((t) => types.has(t));
  }, [data]);

  const matrixData = useMemo(() => {
    if (!data) return new Map<string, number>();
    const counts = new Map<string, number>();
    data.edges.forEach((e) => {
      const fromNode = nodeMap.get(e.from);
      const toNode = nodeMap.get(e.to);
      if (fromNode && toNode) {
        const key = `${fromNode.type}|${toNode.type}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });
    return counts;
  }, [data, nodeMap]);

  const relationshipTypes = useMemo(() => {
    if (!data) return [];
    const types = new Set<string>();
    data.edges.forEach((e) => types.add(e.relationship));
    return Array.from(types).sort();
  }, [data]);

  const mostConnectedType = useMemo(() => {
    if (!data) return null;
    const typeCounts = new Map<string, number>();
    data.edges.forEach((e) => {
      const fromNode = nodeMap.get(e.from);
      const toNode = nodeMap.get(e.to);
      if (fromNode) typeCounts.set(fromNode.type, (typeCounts.get(fromNode.type) || 0) + 1);
      if (toNode) typeCounts.set(toNode.type, (typeCounts.get(toNode.type) || 0) + 1);
    });
    let max = 0;
    let maxType = "";
    typeCounts.forEach((count, type) => {
      if (count > max) { max = count; maxType = type; }
    });
    return maxType ? { type: maxType, count: max } : null;
  }, [data, nodeMap]);

  const relationshipDistribution = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    data.edges.forEach((e) => {
      counts.set(e.relationship, (counts.get(e.relationship) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([rel, count]) => ({ relationship: rel, count }));
  }, [data]);

  const filteredEdges = useMemo(() => {
    if (!data) return [];
    let edges = data.edges;

    if (selectedCell) {
      edges = edges.filter((e) => {
        const fromNode = nodeMap.get(e.from);
        const toNode = nodeMap.get(e.to);
        return fromNode?.type === selectedCell.fromType && toNode?.type === selectedCell.toType;
      });
    }

    if (relationshipFilter !== "all") {
      edges = edges.filter((e) => e.relationship === relationshipFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      edges = edges.filter((e) => {
        const fromNode = nodeMap.get(e.from);
        const toNode = nodeMap.get(e.to);
        return (
          e.from.toLowerCase().includes(q) ||
          e.to.toLowerCase().includes(q) ||
          e.relationship.toLowerCase().includes(q) ||
          (e.detail && e.detail.toLowerCase().includes(q)) ||
          (fromNode?.title && fromNode.title.toLowerCase().includes(q)) ||
          (toNode?.title && toNode.title.toLowerCase().includes(q))
        );
      });
    }

    return edges;
  }, [data, selectedCell, searchQuery, relationshipFilter, nodeMap]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!data) return null;

  const shortType = (t: string) => {
    const abbrevs: Record<string, string> = {
      Source: "SRC", Domain: "DOM", Requirement: "REQ", Finding: "FND",
      Gap: "GAP", Risk: "RSK", Issue: "ISS", Decision: "DEC", Trace: "TRC",
      Question: "QST", Answer: "ANS", Assumption: "ASM", Constraint: "CON",
      CandidateRequirement: "CRQ", Suggestion: "SUG", CoverageItem: "COV",
      Evaluation: "EVL", Violation: "VIO", Stakeholder: "STK",
      AnalysisPass: "APS", ZachmanCell: "ZCL", Segment: "SEG",
      SourceAtom: "ATM", Signal: "SIG", Concern: "CRN", Baseline: "BSL",
      ChangeRecord: "CHG", NarrativeSummary: "NAR",
      StructuralRepresentation: "STR", ControlArtefact: "CTL",
    };
    return abbrevs[t] || t.slice(0, 3).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Relationship Matrix"
        description="Interactive matrix showing relationships between element types across the ledger"
        icon={<Network className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card data-testid="card-stat-total-nodes">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Nodes</p>
                <p className="text-2xl font-bold mt-1" data-testid="text-total-nodes">{data.nodes.length}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-total-edges">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Edges</p>
                <p className="text-2xl font-bold mt-1" data-testid="text-total-edges">{data.edges.length}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-most-connected">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Most Connected</p>
                <p className="text-lg font-bold mt-1" data-testid="text-most-connected">
                  {mostConnectedType?.type || "—"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {mostConnectedType ? `${mostConnectedType.count} connections` : ""}
                </p>
              </div>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-rel-types">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Rel. Types</p>
                <p className="text-2xl font-bold mt-1" data-testid="text-rel-types">{relationshipTypes.length}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3" data-testid="card-relationship-matrix">
          <CardHeader className="pb-2 p-4">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-sm font-medium">Relationship Matrix</CardTitle>
              {selectedCell && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedCell(null)}
                  data-testid="button-clear-cell-filter"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 overflow-x-auto">
            <div className="min-w-fit">
              <table className="text-[10px]" data-testid="table-matrix">
                <thead>
                  <tr>
                    <th className="p-1 text-left text-muted-foreground font-medium sticky left-0 bg-card z-10" />
                    {activeTypes.map((t) => (
                      <th key={t} className="p-1 text-center font-medium text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{shortType(t)}</span>
                          </TooltipTrigger>
                          <TooltipContent><p className="text-xs">{t}</p></TooltipContent>
                        </Tooltip>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTypes.map((fromType) => (
                    <tr key={fromType}>
                      <td className="p-1 text-right font-medium text-muted-foreground pr-2 sticky left-0 bg-card z-10">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{shortType(fromType)}</span>
                          </TooltipTrigger>
                          <TooltipContent><p className="text-xs">{fromType}</p></TooltipContent>
                        </Tooltip>
                      </td>
                      {activeTypes.map((toType) => {
                        const count = matrixData.get(`${fromType}|${toType}`) || 0;
                        const isSelected =
                          selectedCell?.fromType === fromType && selectedCell?.toType === toType;
                        return (
                          <td
                            key={toType}
                            className={`p-1 text-center cursor-pointer rounded-sm transition-colors ${
                              count > 0
                                ? isSelected
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "bg-primary/10 hover-elevate"
                                : "text-muted-foreground/30"
                            }`}
                            onClick={() =>
                              count > 0 &&
                              setSelectedCell(
                                isSelected ? null : { fromType, toType }
                              )
                            }
                            data-testid={`cell-matrix-${shortType(fromType)}-${shortType(toType)}`}
                          >
                            {count > 0 ? count : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-rel-distribution">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {relationshipDistribution.map(({ relationship, count }) => (
              <div key={relationship} className="flex items-center gap-2">
                <Badge
                  className={`text-[9px] font-mono shrink-0 ${relationshipColors[relationship] || "bg-secondary text-secondary-foreground"}`}
                >
                  {relationship}
                </Badge>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/40 rounded-full"
                    style={{
                      width: `${Math.max(4, (count / (data.edges.length || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-edge-list">
        <CardHeader className="pb-2 p-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-sm font-medium">
              Edge List
              {selectedCell && (
                <span className="ml-2 text-muted-foreground font-normal">
                  {selectedCell.fromType} → {selectedCell.toType}
                </span>
              )}
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {filteredEdges.length}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search edges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs"
                  data-testid="input-edge-search"
                />
              </div>
              <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                <SelectTrigger className="w-[160px] text-xs" data-testid="select-rel-filter">
                  <SelectValue placeholder="All relationships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All relationships</SelectItem>
                  {relationshipTypes.map((rt) => (
                    <SelectItem key={rt} value={rt}>
                      {rt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">From</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead className="w-[120px]">To</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead className="w-[120px]">Relationship</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEdges.slice(0, 200).map((edge, idx) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                return (
                  <TableRow key={`${edge.from}-${edge.to}-${edge.relationship}-${idx}`} data-testid={`row-edge-${idx}`}>
                    <TableCell>
                      <ElementId id={edge.from} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {fromNode ? shortType(fromNode.type) : "?"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ElementId id={edge.to} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {toNode ? shortType(toNode.type) : "?"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-mono ${relationshipColors[edge.relationship] || "bg-secondary text-secondary-foreground"}`}
                      >
                        {edge.relationship}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      <p className="line-clamp-2">{edge.detail || "—"}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredEdges.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                    No edges match the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {filteredEdges.length > 200 && (
            <div className="p-3 text-center text-xs text-muted-foreground border-t">
              Showing 200 of {filteredEdges.length} edges. Refine your search to see more.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
