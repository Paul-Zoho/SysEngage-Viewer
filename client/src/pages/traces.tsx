import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Trace } from "@shared/schema";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ElementId } from "@/components/element-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GitBranch, ArrowRight, List, Layers, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const traceTypeLabels: Record<string, { label: string; desc: string }> = {
  ST: { label: "Source Trace", desc: "Direct provenance from source" },
  DT: { label: "Derived Trace", desc: "Interpretive derivation" },
  GT: { label: "General Trace", desc: "General relationship" },
  AT: { label: "Analytical Trace", desc: "Analysis-produced relationship" },
};

interface RelNode {
  id: string;
  type: string;
  title: string;
}

interface RelationshipsData {
  nodes: RelNode[];
  edges: { from: string; to: string; relationship: string; detail?: string }[];
}

function getElementType(id: string, nodeMap: Map<string, RelNode>): string {
  const node = nodeMap.get(id);
  if (node) return node.type;
  const prefix = id.split("-")[0]?.toUpperCase();
  const prefixMap: Record<string, string> = {
    SRC: "Source", FND: "Finding", GAP: "Gap", REQ: "Requirement",
    RSK: "Risk", ISS: "Issue", DOM: "Domain", TRC: "Trace",
    QST: "Question", ANS: "Answer", ASM: "Assumption", CON: "Constraint",
    CRQ: "CandidateReq", SUG: "Suggestion", DEC: "Decision",
    COV: "Coverage", RUL: "Rule", EVL: "Evaluation", VIO: "Violation",
    STK: "Stakeholder", NAR: "Narrative", SEG: "Segment", ATM: "Atom",
  };
  return prefixMap[prefix] || "Unknown";
}

function TraceTable({ traces }: { traces: Trace[] }) {
  return (
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
        {traces.map((trace) => (
          <TableRow key={trace.trace_id} data-testid={`row-trace-${trace.trace_id}`}>
            <TableCell><ElementId id={trace.trace_id} /></TableCell>
            <TableCell>
              <Badge variant="outline" className="text-[10px] font-mono">{trace.trace_type}</Badge>
            </TableCell>
            <TableCell><ElementId id={trace.from_id || (trace as any).from_ref || ""} /></TableCell>
            <TableCell>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </TableCell>
            <TableCell><ElementId id={trace.to_id || (trace as any).to_ref || ""} /></TableCell>
            <TableCell className="text-xs text-muted-foreground max-w-xs">
              <p className="line-clamp-2">{trace.rationale || (trace as any).description || ""}</p>
            </TableCell>
            <TableCell className="text-center">
              {trace.interpretation_magnitude != null ? (
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
  );
}

function GroupCard({ groupKey, traces, defaultOpen }: { groupKey: string; traces: Trace[]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card data-testid={`card-group-${groupKey}`}>
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center gap-2 p-3 text-left hover-elevate rounded-md"
            data-testid={`button-toggle-group-${groupKey}`}
          >
            {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span className="text-sm font-medium">{groupKey}</span>
            <Badge variant="secondary" className="ml-auto">{traces.length}</Badge>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0 border-t">
            <TraceTable traces={traces} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function Traces() {
  const [viewMode, setViewMode] = useState<"flat" | "grouped">("flat");
  const [traceTypeFilter, setTraceTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: traces, isLoading } = useQuery<Trace[]>({ queryKey: ["/api/ledger/traces"] });
  const { data: relationships } = useQuery<RelationshipsData>({ queryKey: ["/api/ledger/relationships"] });

  const nodeMap = useMemo(() => {
    const map = new Map<string, RelNode>();
    relationships?.nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [relationships]);

  const filteredTraces = useMemo(() => {
    if (!traces) return [];
    let result = traces;
    if (traceTypeFilter !== "All") {
      result = result.filter(t => t.trace_type === traceTypeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => {
        const fromId = t.from_id || (t as any).from_ref || "";
        const toId = t.to_id || (t as any).to_ref || "";
        return t.trace_id.toLowerCase().includes(q) ||
          fromId.toLowerCase().includes(q) ||
          toId.toLowerCase().includes(q) ||
          (t.rationale && t.rationale.toLowerCase().includes(q)) ||
          ((t as any).description && (t as any).description.toLowerCase().includes(q));
      });
    }
    return result;
  }, [traces, traceTypeFilter, searchQuery]);

  const groupedTraces = useMemo(() => {
    const groups = new Map<string, Trace[]>();
    filteredTraces.forEach(t => {
      const fromId = t.from_id || (t as any).from_ref || "";
      const toId = t.to_id || (t as any).to_ref || "";
      const fromType = getElementType(fromId, nodeMap);
      const toType = getElementType(toId, nodeMap);
      const key = `${fromType} → ${toType}`;
      const arr = groups.get(key) || [];
      arr.push(t);
      groups.set(key, arr);
    });
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filteredTraces, nodeMap]);

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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 border rounded-md p-0.5" data-testid="toggle-view-mode">
          <Button
            variant={viewMode === "flat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("flat")}
            data-testid="button-view-flat"
          >
            <List className="w-4 h-4 mr-1.5" />
            Flat
          </Button>
          <Button
            variant={viewMode === "grouped" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grouped")}
            data-testid="button-view-grouped"
          >
            <Layers className="w-4 h-4 mr-1.5" />
            Grouped
          </Button>
        </div>

        <Select value={traceTypeFilter} onValueChange={setTraceTypeFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-trace-type-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" data-testid="select-item-All">All Types</SelectItem>
            <SelectItem value="ST" data-testid="select-item-ST">ST - Source</SelectItem>
            <SelectItem value="DT" data-testid="select-item-DT">DT - Derived</SelectItem>
            <SelectItem value="GT" data-testid="select-item-GT">GT - General</SelectItem>
            <SelectItem value="AT" data-testid="select-item-AT">AT - Analytical</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or rationale..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            data-testid="input-search-traces"
          />
        </div>

        <span className="text-xs text-muted-foreground ml-auto" data-testid="text-trace-count">
          {filteredTraces.length} trace{filteredTraces.length !== 1 ? "s" : ""}
          {(traceTypeFilter !== "All" || searchQuery.trim()) && traces
            ? ` of ${traces.length}`
            : ""}
        </span>
      </div>

      {viewMode === "flat" ? (
        <Card>
          <CardContent className="p-0">
            <TraceTable traces={filteredTraces} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groupedTraces.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground" data-testid="text-no-traces">
                No traces match the current filters.
              </CardContent>
            </Card>
          )}
          {groupedTraces.map(([key, groupTraces], idx) => (
            <GroupCard key={key} groupKey={key} traces={groupTraces} defaultOpen={idx < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
