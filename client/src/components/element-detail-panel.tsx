import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ElementId } from "@/components/element-id";
import { ConfidenceIndicator } from "@/components/confidence-indicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ElementDetailPanelProps {
  elementId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
};

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge className={cn("text-[10px] font-medium", typeColors[type] || "bg-secondary text-secondary-foreground")} data-testid={`badge-type-${type.toLowerCase()}`}>
      {type}
    </Badge>
  );
}

interface RelationshipGroupProps {
  label: string;
  edges: RelEdge[];
  nodeMap: Map<string, RelNode>;
  direction: "outgoing" | "incoming";
}

function RelationshipGroup({ label, edges, nodeMap, direction }: RelationshipGroupProps) {
  const grouped = new Map<string, { edge: RelEdge; node: RelNode | undefined }[]>();
  for (const edge of edges) {
    const targetId = direction === "outgoing" ? edge.to : edge.from;
    const node = nodeMap.get(targetId);
    const items = grouped.get(edge.relationship) || [];
    items.push({ edge, node });
    grouped.set(edge.relationship, items);
  }

  if (grouped.size === 0) return null;

  return (
    <div className="space-y-3" data-testid={`section-${direction}-relationships`}>
      <div className="flex items-center gap-2">
        {direction === "outgoing" ? (
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        )}
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-muted-foreground">({edges.length})</span>
      </div>
      {Array.from(grouped.entries()).map(([relType, items]) => (
        <div key={relType} className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-mono" data-testid={`badge-rel-type-${relType}`}>
              {relType}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{items.length} connection{items.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-1 pl-2 border-l-2 border-muted ml-1">
            {items.map(({ edge, node }, idx) => {
              const targetId = direction === "outgoing" ? edge.to : edge.from;
              const confidence = relType.startsWith("trace:") ? parseTraceConfidence(edge.detail) : undefined;
              return (
                <div
                  key={`${edge.from}-${edge.to}-${relType}-${idx}`}
                  className="flex items-center gap-2 py-1 flex-wrap"
                  data-testid={`row-relationship-${targetId}`}
                >
                  <ElementId id={targetId} />
                  {node && <TypeBadge type={node.type} />}
                  {node && (
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]" data-testid={`text-rel-title-${targetId}`}>
                      {node.title}
                    </span>
                  )}
                  {confidence !== undefined && (
                    <ConfidenceIndicator value={confidence} showLabel />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function parseTraceConfidence(_detail?: string): number | undefined {
  return undefined;
}

export function ElementDetailPanel({ elementId, open, onOpenChange }: ElementDetailPanelProps) {
  const { data, isLoading } = useQuery<RelationshipData>({
    queryKey: ["/api/ledger/relationships"],
    enabled: open && !!elementId,
  });

  const nodeMap = new Map<string, RelNode>();
  data?.nodes.forEach(n => nodeMap.set(n.id, n));

  const currentNode = elementId ? nodeMap.get(elementId) : undefined;
  const outgoingEdges = data?.edges.filter(e => e.from === elementId) || [];
  const incomingEdges = data?.edges.filter(e => e.to === elementId) || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col" data-testid="panel-element-detail">
        <div className="p-6 pb-3 border-b shrink-0">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 flex-wrap" data-testid="text-panel-title">
              {elementId && <ElementId id={elementId} />}
              {currentNode && <TypeBadge type={currentNode.type} />}
            </SheetTitle>
            <SheetDescription data-testid="text-panel-description">
              {currentNode?.title || "Element details and relationships"}
            </SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="space-y-4" data-testid="skeleton-panel-loading">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : !elementId ? (
            <p className="text-sm text-muted-foreground" data-testid="text-no-element">No element selected</p>
          ) : (
            <div className="space-y-6">
              {currentNode && (
                <div className="space-y-2" data-testid="section-element-info">
                  <h3 className="text-sm font-semibold">Element Info</h3>
                  <div className="bg-muted/50 rounded-md p-3 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Type</span>
                      <TypeBadge type={currentNode.type} />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Title</span>
                      <p className="text-xs mt-0.5" data-testid="text-element-title">{currentNode.title}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                      <span data-testid="text-outgoing-count">{outgoingEdges.length} outgoing</span>
                      <span data-testid="text-incoming-count">{incomingEdges.length} incoming</span>
                    </div>
                  </div>
                </div>
              )}

              <RelationshipGroup
                label="Outgoing Relationships"
                edges={outgoingEdges}
                nodeMap={nodeMap}
                direction="outgoing"
              />

              <RelationshipGroup
                label="Incoming Relationships"
                edges={incomingEdges}
                nodeMap={nodeMap}
                direction="incoming"
              />

              {outgoingEdges.length === 0 && incomingEdges.length === 0 && (
                <div className="text-center py-8" data-testid="text-no-relationships">
                  <p className="text-sm text-muted-foreground">No relationships found for this element</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
