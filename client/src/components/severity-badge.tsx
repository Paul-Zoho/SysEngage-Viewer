import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

const severityColors: Record<string, string> = {
  High: "bg-[hsl(0,84%,42%)] text-white",
  Medium: "bg-[hsl(43,74%,42%)] text-white",
  Low: "bg-[hsl(122,43%,45%)] text-white",
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge className={cn("text-[10px] font-medium", severityColors[severity] || "", className)} data-testid={`badge-severity-${severity.toLowerCase()}`}>
      {severity}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  Open: "bg-[hsl(211,100%,40%)] text-white",
  Active: "bg-[hsl(0,84%,42%)] text-white",
  InProgress: "bg-[hsl(43,74%,42%)] text-white",
  Resolved: "bg-[hsl(122,43%,45%)] text-white",
  Closed: "bg-muted text-muted-foreground",
  Mitigated: "bg-[hsl(174,72%,32%)] text-white",
  Accepted: "bg-[hsl(237,43%,48%)] text-white",
  Proposed: "bg-[hsl(211,100%,40%)] text-white",
  Rejected: "bg-[hsl(0,84%,42%)] text-white",
  Superseded: "bg-muted text-muted-foreground",
  Promoted: "bg-[hsl(122,43%,45%)] text-white",
  Answered: "bg-[hsl(122,43%,45%)] text-white",
  Covered: "bg-[hsl(122,43%,45%)] text-white",
  PartiallyCovered: "bg-[hsl(43,74%,42%)] text-white",
  NotCovered: "bg-[hsl(0,84%,42%)] text-white",
  Unknown: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/([A-Z])/g, ' $1').trim();
  return (
    <Badge className={cn("text-[10px] font-medium", statusColors[status] || "bg-secondary text-secondary-foreground", className)} data-testid={`badge-status-${status.toLowerCase()}`}>
      {label}
    </Badge>
  );
}
