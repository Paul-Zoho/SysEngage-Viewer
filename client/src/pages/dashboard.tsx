import { useQuery } from "@tanstack/react-query";
import type { LedgerStats, CanonicalLedger } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Search,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  GitBranch,
  Milestone,
  BarChart3,
  Layers,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function StatCard({ title, value, icon, accent }: { title: string; value: number | string; icon: React.ReactNode; accent?: string }) {
  return (
    <Card className="hover-elevate" data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-1">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${accent || ""}`} data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DistributionBar({ segments, height = "h-2" }: { segments: { value: number; color: string; label: string }[]; height?: string }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className={`${height} rounded-full bg-muted w-full`} />;
  return (
    <div className={`flex ${height} rounded-full overflow-hidden w-full gap-0.5`}>
      {segments.filter(s => s.value > 0).map((seg, i) => (
        <div
          key={i}
          className={`${seg.color} rounded-full transition-all`}
          style={{ width: `${(seg.value / total) * 100}%` }}
          title={`${seg.label}: ${seg.value}`}
        />
      ))}
    </div>
  );
}

function DistributionCard({ title, segments }: { title: string; segments: { value: number; color: string; label: string; dotColor: string }[] }) {
  return (
    <Card data-testid={`card-distribution-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-2 p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <DistributionBar segments={segments} />
        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${seg.dotColor}`} />
              <span className="text-xs text-muted-foreground">{seg.label}</span>
              <span className="text-xs font-semibold ml-auto">{seg.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<LedgerStats>({ queryKey: ["/api/ledger/stats"] });
  const { data: ledger, isLoading: ledgerLoading } = useQuery<CanonicalLedger>({ queryKey: ["/api/ledger"] });

  if (statsLoading || ledgerLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (!stats || !ledger) return null;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Ledger Dashboard"
        description={`${ledger.ledger_id} - ${ledger.version} | ${stats.totalElements} total elements across ${stats.registers} registers`}
        icon={<LayoutDashboard className="w-5 h-5 text-primary" />}
      >
        <Badge variant="outline" className="font-mono text-xs">{ledger.version}</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sources" value={stats.sources} icon={<FileText className="w-5 h-5 text-primary" />} />
        <StatCard title="Requirements" value={stats.requirements} icon={<ClipboardList className="w-5 h-5 text-primary" />} />
        <StatCard title="Findings" value={stats.findings} icon={<Search className="w-5 h-5 text-primary" />} />
        <StatCard title="Gaps" value={stats.gaps} icon={<AlertTriangle className="w-5 h-5 text-primary" />} />
        <StatCard title="Risks" value={stats.risks} icon={<ShieldAlert className="w-5 h-5 text-primary" />} />
        <StatCard title="Issues" value={stats.issues} icon={<AlertCircle className="w-5 h-5 text-primary" />} />
        <StatCard title="Traces" value={stats.traces} icon={<GitBranch className="w-5 h-5 text-primary" />} />
        <StatCard title="Decisions" value={stats.decisions} icon={<Milestone className="w-5 h-5 text-primary" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DistributionCard
          title="Finding Severity"
          segments={[
            { value: stats.findingSeverity.high, color: "bg-[hsl(0,84%,42%)]", dotColor: "bg-[hsl(0,84%,42%)]", label: "High" },
            { value: stats.findingSeverity.medium, color: "bg-[hsl(43,74%,42%)]", dotColor: "bg-[hsl(43,74%,42%)]", label: "Medium" },
            { value: stats.findingSeverity.low, color: "bg-[hsl(122,43%,45%)]", dotColor: "bg-[hsl(122,43%,45%)]", label: "Low" },
          ]}
        />
        <DistributionCard
          title="Gap Resolution"
          segments={[
            { value: stats.gapResolution.open, color: "bg-[hsl(211,100%,40%)]", dotColor: "bg-[hsl(211,100%,40%)]", label: "Open" },
            { value: stats.gapResolution.accepted, color: "bg-[hsl(237,43%,48%)]", dotColor: "bg-[hsl(237,43%,48%)]", label: "Accepted" },
            { value: stats.gapResolution.mitigated, color: "bg-[hsl(174,72%,32%)]", dotColor: "bg-[hsl(174,72%,32%)]", label: "Mitigated" },
            { value: stats.gapResolution.closed, color: "bg-muted", dotColor: "bg-muted-foreground", label: "Closed" },
          ]}
        />
        <DistributionCard
          title="Risk Exposure"
          segments={[
            { value: stats.riskExposure.high, color: "bg-[hsl(0,84%,42%)]", dotColor: "bg-[hsl(0,84%,42%)]", label: "High" },
            { value: stats.riskExposure.medium, color: "bg-[hsl(43,74%,42%)]", dotColor: "bg-[hsl(43,74%,42%)]", label: "Medium" },
            { value: stats.riskExposure.low, color: "bg-[hsl(122,43%,45%)]", dotColor: "bg-[hsl(122,43%,45%)]", label: "Low" },
          ]}
        />
        <DistributionCard
          title="Coverage Status"
          segments={[
            { value: stats.coverage.covered, color: "bg-[hsl(122,43%,45%)]", dotColor: "bg-[hsl(122,43%,45%)]", label: "Covered" },
            { value: stats.coverage.partial, color: "bg-[hsl(43,74%,42%)]", dotColor: "bg-[hsl(43,74%,42%)]", label: "Partial" },
            { value: stats.coverage.notCovered, color: "bg-[hsl(0,84%,42%)]", dotColor: "bg-[hsl(0,84%,42%)]", label: "Not Covered" },
            { value: stats.coverage.unknown, color: "bg-muted", dotColor: "bg-muted-foreground", label: "Unknown" },
          ]}
        />
        <DistributionCard
          title="Issue Status"
          segments={[
            { value: stats.issueStatus.open, color: "bg-[hsl(211,100%,40%)]", dotColor: "bg-[hsl(211,100%,40%)]", label: "Open" },
            { value: stats.issueStatus.inProgress, color: "bg-[hsl(43,74%,42%)]", dotColor: "bg-[hsl(43,74%,42%)]", label: "In Progress" },
            { value: stats.issueStatus.resolved, color: "bg-[hsl(122,43%,45%)]", dotColor: "bg-[hsl(122,43%,45%)]", label: "Resolved" },
            { value: stats.issueStatus.closed, color: "bg-muted", dotColor: "bg-muted-foreground", label: "Closed" },
          ]}
        />

        <Card data-testid="card-domains">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium">Domain Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {ledger.domains.map((d) => (
              <div key={d.domain_id} className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs truncate flex-1">{d.name}</span>
                <code className="text-[10px] font-mono text-muted-foreground">{d.domain_id}</code>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <Users className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs text-muted-foreground">{stats.stakeholders} stakeholders</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {ledger.narrative_summaries.length > 0 && (
        <Card data-testid="card-executive-summary">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {ledger.narrative_summaries[0].viewpoint}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{ledger.narrative_summaries[0].summary_text}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
