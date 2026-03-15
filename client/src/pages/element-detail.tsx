import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ElementId } from "@/components/element-id";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  FileSearch, ArrowLeft, ArrowRight, ArrowLeftRight, ChevronDown, ChevronRight,
  Search, Filter
} from "lucide-react";

interface RelNode { id: string; type: string; title: string }
interface RelEdge { from: string; to: string; relationship: string; detail?: string }
interface RelationshipData { nodes: RelNode[]; edges: RelEdge[] }
interface ElementData { element: Record<string, any>; type: string }
interface BatchData { elements: Record<string, { element: Record<string, any>; type: string }> }

const typeColors: Record<string, string> = {
  Source: "bg-[hsl(211,100%,40%)] text-white",
  Finding: "bg-[hsl(0,84%,42%)] text-white",
  Gap: "bg-[hsl(43,74%,42%)] text-white",
  Requirement: "bg-[hsl(262,52%,47%)] text-white",
  Risk: "bg-[hsl(0,84%,42%)] text-white",
  Issue: "bg-[hsl(25,95%,45%)] text-white",
  Trace: "bg-[hsl(174,72%,32%)] text-white",
  Domain: "bg-[hsl(211,100%,40%)] text-white",
  Decision: "bg-[hsl(237,43%,48%)] text-white",
  Question: "bg-[hsl(43,74%,42%)] text-white",
  Answer: "bg-[hsl(122,43%,45%)] text-white",
  Assumption: "bg-muted text-muted-foreground",
  Constraint: "bg-[hsl(25,95%,45%)] text-white",
  CandidateRequirement: "bg-[hsl(262,52%,47%)] text-white",
  Suggestion: "bg-[hsl(174,72%,32%)] text-white",
  CoverageItem: "bg-[hsl(122,43%,45%)] text-white",
  Stakeholder: "bg-[hsl(211,100%,40%)] text-white",
  Violation: "bg-[hsl(0,84%,42%)] text-white",
  Signal: "bg-[hsl(211,80%,55%)] text-white",
  CellContentItem: "bg-[hsl(262,40%,55%)] text-white",
  ZachmanCell: "bg-[hsl(200,60%,45%)] text-white",
  ControlArtefact: "bg-[hsl(0,60%,50%)] text-white",
  Evaluation: "bg-[hsl(174,50%,40%)] text-white",
  AnalysisPass: "bg-[hsl(237,30%,55%)] text-white",
  Rule: "bg-[hsl(25,70%,50%)] text-white",
  Segment: "bg-muted text-muted-foreground",
  SourceAtom: "bg-muted text-muted-foreground",
  Unknown: "bg-muted text-muted-foreground",
};

const skipFields = new Set(["id"]);
const refFields = new Set([
  "source_refs", "domain_refs", "related_element_ids", "affected_element_ids",
  "produced_from_finding_ids", "supporting_signal_refs", "supporting_cellcontent_refs",
  "cell_content_refs", "question_id", "from_ref", "to_ref", "from_id", "to_id",
]);

function isRefArray(key: string, value: any): boolean {
  if (refFields.has(key)) return true;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string" && /^[A-Z]+-\d+/.test(value[0])) return true;
  return false;
}

function isRefValue(key: string, value: any): boolean {
  if (typeof value !== "string") return false;
  if (refFields.has(key)) return true;
  if (/^[A-Z]+-\d+$/.test(value) && (key.endsWith("_id") || key.endsWith("_ref"))) return true;
  return false;
}

function AttributeValue({ fieldKey, value }: { fieldKey: string; value: any }) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">--</span>;

  if (isRefArray(fieldKey, value) && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((ref: string) => <ElementId key={ref} id={ref} />)}
      </div>
    );
  }

  if (isRefValue(fieldKey, value)) {
    return <ElementId id={value} />;
  }

  if (typeof value === "number") {
    if (fieldKey === "confidence" || fieldKey.includes("confidence")) {
      return <ConfidenceIndicator value={value} showLabel />;
    }
    return <span className="font-mono text-xs">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <Badge variant={value ? "default" : "secondary"} className="text-[10px]">{value ? "Yes" : "No"}</Badge>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground text-xs">--</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, i) => (
          <Badge key={i} variant="outline" className="text-[10px] font-normal">{String(item)}</Badge>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return <pre className="text-[10px] font-mono bg-muted rounded p-1.5 max-h-24 overflow-auto whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>;
  }

  const str = String(value);
  if (str.length > 200) {
    return <p className="text-xs leading-relaxed">{str}</p>;
  }
  return <span className="text-xs">{str}</span>;
}

function formatFieldName(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()).replace(/\bId\b/g, "ID").replace(/\bIds\b/g, "IDs").replace(/\bRef\b/g, "Ref").replace(/\bRefs\b/g, "Refs");
}

function ElementAttributeCard({ element, type }: { element: Record<string, any>; type: string }) {
  const entries = Object.entries(element).filter(([key]) => !skipFields.has(key));
  const primaryFields = entries.filter(([key]) =>
    ["name", "title", "statement", "description", "source_text", "summary", "text", "observed_text", "signal_text",
      "meaning_key", "classification_type", "requirement_type", "severity", "priority", "status",
      "resolution_state", "trace_type", "confidence", "domain_id", "source_id", "requirement_id",
      "finding_id", "gap_id", "risk_id", "issue_id", "trace_id", "decision_id", "question_id",
      "cell_id", "cell_content_item_id", "signal_id", "pass_id", "coverage_item_id",
    ].includes(key)
  );
  const secondaryFields = entries.filter(([key]) => !primaryFields.some(([pk]) => pk === key));

  return (
    <Card data-testid="card-element-attributes">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge className={cn("text-[10px]", typeColors[type] || typeColors.Unknown)}>{type}</Badge>
          <span>Element Attributes</span>
          <span className="text-xs text-muted-foreground font-normal ml-auto">{entries.length} fields</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] text-[10px] uppercase tracking-wider">Field</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {primaryFields.map(([key, value]) => (
              <TableRow key={key} data-testid={`row-attr-${key}`}>
                <TableCell className="font-mono text-xs text-muted-foreground align-top py-2">{formatFieldName(key)}</TableCell>
                <TableCell className="py-2"><AttributeValue fieldKey={key} value={value} /></TableCell>
              </TableRow>
            ))}
            {secondaryFields.map(([key, value]) => (
              <TableRow key={key} data-testid={`row-attr-${key}`} className="border-t-0">
                <TableCell className="font-mono text-xs text-muted-foreground align-top py-2">{formatFieldName(key)}</TableCell>
                <TableCell className="py-2"><AttributeValue fieldKey={key} value={value} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RelatedElementRow({ relatedId, edge, batchData, nodeMap, direction }: {
  relatedId: string;
  edge: RelEdge;
  batchData?: BatchData;
  nodeMap: Map<string, RelNode>;
  direction: "outgoing" | "incoming";
}) {
  const batchEl = batchData?.elements[relatedId];
  const node = nodeMap.get(relatedId);
  const element = batchEl?.element;
  const type = batchEl?.type || node?.type || "Unknown";

  const displayTitle = element?.title || element?.name || element?.statement || element?.description || element?.source_text || element?.observed_text || element?.signal_text || element?.summary || element?.meaning_key || node?.title || "";
  const displayTitleTrunc = displayTitle.length > 120 ? displayTitle.slice(0, 120) + "..." : displayTitle;

  const extraAttrs: [string, any][] = [];
  if (element) {
    const interestingFields = ["confidence", "severity", "priority", "status", "requirement_type",
      "trace_type", "classification_type", "resolution_state", "cell_id", "meaning_key",
      "interpretation_magnitude", "likelihood", "impact", "exposure"];
    for (const field of interestingFields) {
      if (element[field] !== undefined && element[field] !== null) {
        extraAttrs.push([field, element[field]]);
      }
    }
  }

  return (
    <TableRow data-testid={`row-related-${relatedId}`}>
      <TableCell className="w-[100px] align-top">
        <ElementId id={relatedId} />
      </TableCell>
      <TableCell className="w-[110px] align-top">
        <Badge className={cn("text-[10px]", typeColors[type] || typeColors.Unknown)}>{type}</Badge>
      </TableCell>
      <TableCell className="w-[90px] align-top">
        <Badge variant="outline" className="text-[10px] font-mono">{edge.relationship}</Badge>
      </TableCell>
      <TableCell className="align-top">
        <div className="space-y-1">
          <p className="text-xs leading-relaxed">{displayTitleTrunc || <span className="text-muted-foreground">--</span>}</p>
          {extraAttrs.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {extraAttrs.map(([key, val]) => (
                <span key={key} className="text-[10px] text-muted-foreground">
                  <span className="font-medium">{formatFieldName(key)}:</span>{" "}
                  {key === "confidence" ? <ConfidenceIndicator value={val} showLabel /> : <span className="font-mono">{String(val)}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[40px] align-top text-center">
        {direction === "outgoing" ?
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground inline" /> :
          <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground inline" />
        }
      </TableCell>
    </TableRow>
  );
}

interface RelGroupProps {
  groupKey: string;
  edges: RelEdge[];
  direction: "outgoing" | "incoming";
  batchData?: BatchData;
  nodeMap: Map<string, RelNode>;
  defaultOpen: boolean;
}

function RelationshipGroupSection({ groupKey, edges, direction, batchData, nodeMap, defaultOpen }: RelGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const type = groupKey.split(":")[0] || groupKey;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center gap-2 p-3 text-left hover:bg-muted/50 rounded-md transition-colors"
          data-testid={`button-toggle-relgroup-${groupKey}`}
        >
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <Badge variant="outline" className="text-[10px] font-mono">{groupKey}</Badge>
          <Badge variant="secondary" className="text-[10px]">{edges.length}</Badge>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] uppercase w-[100px]">ID</TableHead>
              <TableHead className="text-[10px] uppercase w-[110px]">Type</TableHead>
              <TableHead className="text-[10px] uppercase w-[90px]">Relationship</TableHead>
              <TableHead className="text-[10px] uppercase">Details / Attributes</TableHead>
              <TableHead className="text-[10px] uppercase w-[40px]">Dir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {edges.map((edge, idx) => {
              const relatedId = direction === "outgoing" ? edge.to : edge.from;
              return (
                <RelatedElementRow
                  key={`${relatedId}-${idx}`}
                  relatedId={relatedId}
                  edge={edge}
                  batchData={batchData}
                  nodeMap={nodeMap}
                  direction={direction}
                />
              );
            })}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ElementDetail() {
  const [, params] = useRoute("/element/:id");
  const [, navigate] = useLocation();
  const elementId = params?.id || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [relTypeFilter, setRelTypeFilter] = useState("All");
  const [directionFilter, setDirectionFilter] = useState<"all" | "outgoing" | "incoming">("all");

  const { data: elementData, isLoading: elementLoading } = useQuery<ElementData>({
    queryKey: ["/api/ledger/element", elementId],
    queryFn: async () => {
      const res = await fetch(`/api/ledger/element/${encodeURIComponent(elementId)}`);
      if (!res.ok) throw new Error("Element not found");
      return res.json();
    },
    enabled: !!elementId,
  });

  const { data: relationships, isLoading: relLoading } = useQuery<RelationshipData>({
    queryKey: ["/api/ledger/relationships"],
    enabled: !!elementId,
  });

  const nodeMap = useMemo(() => {
    const map = new Map<string, RelNode>();
    relationships?.nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [relationships]);

  const outgoingEdges = useMemo(() => relationships?.edges.filter(e => e.from === elementId) || [], [relationships, elementId]);
  const incomingEdges = useMemo(() => relationships?.edges.filter(e => e.to === elementId) || [], [relationships, elementId]);

  const relatedIds = useMemo(() => {
    const ids = new Set<string>();
    outgoingEdges.forEach(e => ids.add(e.to));
    incomingEdges.forEach(e => ids.add(e.from));
    return Array.from(ids);
  }, [outgoingEdges, incomingEdges]);

  const { data: batchData } = useQuery<BatchData>({
    queryKey: ["/api/ledger/elements/batch", relatedIds.join(",")],
    queryFn: async () => {
      if (relatedIds.length === 0) return { elements: {} };
      const res = await fetch(`/api/ledger/elements/batch?ids=${encodeURIComponent(relatedIds.join(","))}`);
      return res.json();
    },
    enabled: relatedIds.length > 0,
  });

  const allRelTypes = useMemo(() => {
    const types = new Set<string>();
    outgoingEdges.forEach(e => types.add(e.relationship));
    incomingEdges.forEach(e => types.add(e.relationship));
    return Array.from(types).sort();
  }, [outgoingEdges, incomingEdges]);

  const filteredOutgoing = useMemo(() => {
    let edges = outgoingEdges;
    if (relTypeFilter !== "All") edges = edges.filter(e => e.relationship === relTypeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      edges = edges.filter(e => {
        const node = nodeMap.get(e.to);
        const batch = batchData?.elements[e.to];
        const title = batch?.element?.title || batch?.element?.name || batch?.element?.statement || batch?.element?.description || node?.title || "";
        return e.to.toLowerCase().includes(q) || title.toLowerCase().includes(q) || (batch?.type || "").toLowerCase().includes(q);
      });
    }
    return edges;
  }, [outgoingEdges, relTypeFilter, searchQuery, nodeMap, batchData]);

  const filteredIncoming = useMemo(() => {
    let edges = incomingEdges;
    if (relTypeFilter !== "All") edges = edges.filter(e => e.relationship === relTypeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      edges = edges.filter(e => {
        const node = nodeMap.get(e.from);
        const batch = batchData?.elements[e.from];
        const title = batch?.element?.title || batch?.element?.name || batch?.element?.statement || batch?.element?.description || node?.title || "";
        return e.from.toLowerCase().includes(q) || title.toLowerCase().includes(q) || (batch?.type || "").toLowerCase().includes(q);
      });
    }
    return edges;
  }, [incomingEdges, relTypeFilter, searchQuery, nodeMap, batchData]);

  const outgoingGroups = useMemo(() => {
    const groups = new Map<string, RelEdge[]>();
    filteredOutgoing.forEach(e => {
      const arr = groups.get(e.relationship) || [];
      arr.push(e);
      groups.set(e.relationship, arr);
    });
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filteredOutgoing]);

  const incomingGroups = useMemo(() => {
    const groups = new Map<string, RelEdge[]>();
    filteredIncoming.forEach(e => {
      const arr = groups.get(e.relationship) || [];
      arr.push(e);
      groups.set(e.relationship, arr);
    });
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filteredIncoming]);

  const isLoading = elementLoading || relLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!elementData) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground" data-testid="text-not-found">Element "{elementId}" not found in the current ledger.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentNode = nodeMap.get(elementId);
  const elementTitle = elementData.element.title || elementData.element.name || elementData.element.statement || elementData.element.description || elementData.element.source_text || elementId;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={() => { if (window.history.length > 1) window.history.back(); else navigate("/"); }} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
      </div>

      <PageHeader
        title={elementId}
        description={typeof elementTitle === "string" ? (elementTitle.length > 150 ? elementTitle.slice(0, 150) + "..." : elementTitle) : elementId}
        icon={<FileSearch className="w-5 h-5 text-primary" />}
      >
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", typeColors[elementData.type] || typeColors.Unknown)}>
            {elementData.type}
          </Badge>
          {elementData.element.confidence !== undefined && (
            <ConfidenceIndicator value={elementData.element.confidence} size="md" showLabel />
          )}
        </div>
      </PageHeader>

      <ElementAttributeCard element={elementData.element} type={elementData.type} />

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold flex items-center gap-2" data-testid="text-relationships-heading">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            Relationships
          </h2>
          <Badge variant="secondary" data-testid="badge-total-relationships">
            {outgoingEdges.length + incomingEdges.length} total
          </Badge>
          <Badge variant="outline" data-testid="badge-outgoing-count">{outgoingEdges.length} outgoing</Badge>
          <Badge variant="outline" data-testid="badge-incoming-count">{incomingEdges.length} incoming</Badge>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 border rounded-md p-0.5" data-testid="toggle-direction-filter">
            <Button variant={directionFilter === "all" ? "default" : "ghost"} size="sm" onClick={() => setDirectionFilter("all")} data-testid="button-dir-all">
              All
            </Button>
            <Button variant={directionFilter === "outgoing" ? "default" : "ghost"} size="sm" onClick={() => setDirectionFilter("outgoing")} data-testid="button-dir-outgoing">
              <ArrowRight className="w-3.5 h-3.5 mr-1" /> Outgoing
            </Button>
            <Button variant={directionFilter === "incoming" ? "default" : "ghost"} size="sm" onClick={() => setDirectionFilter("incoming")} data-testid="button-dir-incoming">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Incoming
            </Button>
          </div>

          <Select value={relTypeFilter} onValueChange={setRelTypeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-rel-type-filter">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {allRelTypes.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search related elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              data-testid="input-search-related"
            />
          </div>

          <span className="text-xs text-muted-foreground ml-auto" data-testid="text-filtered-count">
            {(directionFilter === "incoming" ? 0 : filteredOutgoing.length) + (directionFilter === "outgoing" ? 0 : filteredIncoming.length)} shown
          </span>
        </div>

        {(directionFilter === "all" || directionFilter === "outgoing") && outgoingGroups.length > 0 && (
          <Card data-testid="card-outgoing-relationships">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Outgoing Relationships
                <Badge variant="secondary" className="text-[10px]">{filteredOutgoing.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <div className="divide-y">
                {outgoingGroups.map(([relType, edges], idx) => (
                  <RelationshipGroupSection
                    key={relType}
                    groupKey={relType}
                    edges={edges}
                    direction="outgoing"
                    batchData={batchData}
                    nodeMap={nodeMap}
                    defaultOpen={idx < 3}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(directionFilter === "all" || directionFilter === "incoming") && incomingGroups.length > 0 && (
          <Card data-testid="card-incoming-relationships">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-primary" />
                Incoming Relationships
                <Badge variant="secondary" className="text-[10px]">{filteredIncoming.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <div className="divide-y">
                {incomingGroups.map(([relType, edges], idx) => (
                  <RelationshipGroupSection
                    key={relType}
                    groupKey={relType}
                    edges={edges}
                    direction="incoming"
                    batchData={batchData}
                    nodeMap={nodeMap}
                    defaultOpen={idx < 3}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredOutgoing.length === 0 && filteredIncoming.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground" data-testid="text-no-relationships">
              No relationships match the current filters.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
