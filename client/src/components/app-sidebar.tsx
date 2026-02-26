import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
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
  BookOpen,
  Users,
  Layers,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { LedgerStats } from "@shared/schema";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Ledger Explorer", url: "/explorer", icon: Database },
    ],
  },
  {
    label: "Provenance",
    items: [
      { title: "Sources", url: "/sources", icon: FileText },
      { title: "Domains", url: "/domains", icon: Layers },
      { title: "Traceability", url: "/traces", icon: GitBranch },
    ],
  },
  {
    label: "Requirements",
    items: [
      { title: "Requirements", url: "/requirements", icon: ClipboardList },
      { title: "Coverage", url: "/coverage", icon: BarChart3 },
    ],
  },
  {
    label: "Analysis",
    items: [
      { title: "Findings", url: "/findings", icon: Search },
      { title: "Gaps", url: "/gaps", icon: AlertTriangle },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Risks", url: "/risks", icon: ShieldAlert },
      { title: "Issues", url: "/issues", icon: AlertCircle },
      { title: "Decisions", url: "/decisions", icon: Milestone },
      { title: "Stakeholders", url: "/stakeholders", icon: Users },
    ],
  },
];

const countKeys: Record<string, keyof LedgerStats> = {
  "Sources": "sources",
  "Requirements": "requirements",
  "Findings": "findings",
  "Gaps": "gaps",
  "Risks": "risks",
  "Issues": "issues",
  "Traceability": "traces",
  "Decisions": "decisions",
  "Domains": "domains",
  "Stakeholders": "stakeholders",
};

export function AppSidebar() {
  const [location] = useLocation();
  const { data: stats } = useQuery<LedgerStats>({ queryKey: ["/api/ledger/stats"] });

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight" data-testid="text-app-title">SysEngage</h1>
            <p className="text-[10px] text-muted-foreground font-mono">POC 5 / v1.0</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                  const count = countKeys[item.title] && stats ? stats[countKeys[item.title]] : undefined;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        data-active={isActive}
                        className="data-[active=true]:bg-sidebar-accent"
                      >
                        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1">{item.title}</span>
                          {typeof count === "number" && count > 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 min-w-[20px] justify-center">
                              {count}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <div className="w-2 h-2 rounded-full bg-[hsl(122,43%,45%)]" />
          <span>Ledger Active</span>
          {stats && (
            <span className="ml-auto">{stats.totalElements} elements</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
