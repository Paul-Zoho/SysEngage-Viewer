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
  FolderOpen,
  ChevronsUpDown,
  Network,
  SplitSquareHorizontal,
  Flag,
  Grid3X3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { LedgerStats, ProjectSummary } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Projects", url: "/projects", icon: FolderOpen },
      { title: "Ledger Explorer", url: "/explorer", icon: Database },
      { title: "Baselines", url: "/baselines", icon: Flag },
    ],
  },
  {
    label: "Provenance",
    items: [
      { title: "Sources", url: "/sources", icon: FileText },
      { title: "Segments", url: "/segments", icon: SplitSquareHorizontal },
      { title: "Domains", url: "/domains", icon: Layers },
      { title: "Traceability", url: "/traces", icon: GitBranch },
      { title: "Relationships", url: "/relationships", icon: Network },
    ],
  },
  {
    label: "Requirements",
    items: [
      { title: "Requirements", url: "/requirements", icon: ClipboardList },
      { title: "Coverage", url: "/coverage", icon: BarChart3 },
      { title: "Zachman Grid", url: "/zachman-grid", icon: Grid3X3 },
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
  "Segments": "segments",
};

export function AppSidebar() {
  const [location] = useLocation();
  const { data: stats } = useQuery<LedgerStats>({ queryKey: ["/api/ledger/stats"] });
  const { data: projects } = useQuery<ProjectSummary[]>({ queryKey: ["/api/projects"] });
  const { data: activeData } = useQuery<{ projectId: string }>({ queryKey: ["/api/projects/active"] });

  const activeProject = projects?.find((p) => p.id === activeData?.projectId);

  const switchMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("PUT", "/api/projects/active", { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight" data-testid="text-app-title">SysEngage</h1>
            <p className="text-[10px] text-muted-foreground font-mono">POC 5 / v1.0</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between" data-testid="button-project-selector">
              <span className="truncate text-xs">
                {activeProject ? activeProject.name : "Select Project"}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            {projects?.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => switchMutation.mutate(project.id)}
                data-testid={`menu-project-${project.id}`}
              >
                <span className="flex-1 truncate">{project.name}</span>
                {project.id === activeData?.projectId && (
                  <Badge variant="secondary" className="text-[10px] ml-2">Active</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
