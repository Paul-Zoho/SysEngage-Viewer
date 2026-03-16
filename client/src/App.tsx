import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Sources from "@/pages/sources";
import Requirements from "@/pages/requirements";
import Findings from "@/pages/findings";
import Gaps from "@/pages/gaps";
import Risks from "@/pages/risks";
import Issues from "@/pages/issues";
import Traces from "@/pages/traces";
import Decisions from "@/pages/decisions";
import Domains from "@/pages/domains";
import Coverage from "@/pages/coverage";
import Stakeholders from "@/pages/stakeholders";
import Explorer from "@/pages/explorer";
import Projects from "@/pages/projects";
import Relationships from "@/pages/relationships";
import Segments from "@/pages/segments";
import Baselines from "@/pages/baselines";
import ZachmanGrid from "@/pages/zachman-grid";
import ElementDetail from "@/pages/element-detail";
import LoginPage from "@/pages/login";
import { ScrollArea } from "@/components/ui/scroll-area";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/sources" component={Sources} />
      <Route path="/requirements" component={Requirements} />
      <Route path="/findings" component={Findings} />
      <Route path="/gaps" component={Gaps} />
      <Route path="/risks" component={Risks} />
      <Route path="/issues" component={Issues} />
      <Route path="/traces" component={Traces} />
      <Route path="/decisions" component={Decisions} />
      <Route path="/domains" component={Domains} />
      <Route path="/coverage" component={Coverage} />
      <Route path="/stakeholders" component={Stakeholders} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/projects" component={Projects} />
      <Route path="/relationships" component={Relationships} />
      <Route path="/segments" component={Segments} />
      <Route path="/baselines" component={Baselines} />
      <Route path="/zachman-grid" component={ZachmanGrid} />
      <Route path="/element/:id" component={ElementDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const logout = useLogout();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-1 p-2 border-b h-12 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="text-xs text-muted-foreground font-mono">SysEngage POC 5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(122,43%,45%)]" />
                Canonical Ledger v1.0
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                data-testid="button-logout"
                className="h-7 px-2 text-xs text-muted-foreground"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1">
            <Router />
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route>
            <AuthGuard />
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
