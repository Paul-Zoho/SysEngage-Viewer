import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, type ProjectSummary } from "@shared/schema";
import { Plus, Upload, Trash2, CheckCircle, FolderOpen, FolderKanban, Loader2, Calendar, Hash, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ParseWarning {
  section: string;
  message: string;
}

interface UploadResult {
  projectName: string;
  elementCount: number;
  warnings?: ParseWarning[];
}

export default function Projects() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const { data: projects, isLoading } = useQuery<ProjectSummary[]>({
    queryKey: ["/api/projects"],
  });

  const { data: activeData } = useQuery<{ projectId: string }>({
    queryKey: ["/api/projects/active"],
  });

  const activeProjectId = activeData?.projectId;

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: { name: "", description: "" },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setCreateOpen(false);
      form.reset();
      toast({ title: "Project created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ledger"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ledger/stats"] });
      toast({ title: "Project deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const selectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("PUT", "/api/projects/active", { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Active project changed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Projects"
        description="Manage projects and upload markdown ledger files to populate project data."
        icon={<FolderKanban className="w-5 h-5 text-primary" />}
      >
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-project">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-project">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Add a new project to organize your ledger data.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Ledger Project" {...field} data-testid="input-project-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this project..."
                          className="resize-none"
                          {...field}
                          data-testid="input-project-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} data-testid="button-cancel-create">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-project">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {projects && projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No projects yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={project.id === activeProjectId}
              onSelect={() => selectMutation.mutate(project.id)}
              onDelete={() => deleteMutation.mutate(project.id)}
              selectPending={selectMutation.isPending}
              onUploadResult={setUploadResult}
            />
          ))}
        </div>
      )}

      <Dialog open={!!uploadResult} onOpenChange={(open) => !open && setUploadResult(null)}>
        <DialogContent data-testid="dialog-upload-result">
          <DialogHeader>
            <DialogTitle>Upload Complete</DialogTitle>
            <DialogDescription>
              Ledger data has been parsed and loaded into "{uploadResult?.projectName}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium" data-testid="text-upload-element-count">
                {uploadResult?.elementCount} elements parsed
              </span>
            </div>
            {uploadResult?.warnings && uploadResult.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {uploadResult.warnings.length} warning{uploadResult.warnings.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <ScrollArea className="max-h-40">
                  <div className="space-y-1">
                    {uploadResult.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1" data-testid={`text-warning-${i}`}>
                        [{w.section}] {w.message}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setUploadResult(null)} data-testid="button-close-upload-result">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectCard({
  project,
  isActive,
  onSelect,
  onDelete,
  selectPending,
  onUploadResult,
}: {
  project: ProjectSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  selectPending: boolean;
  onUploadResult: (result: UploadResult) => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      const res = await fetch(`/api/projects/${project.id}/ledger`, {
        method: "POST",
        headers: { "Content-Type": "text/markdown" },
        body: text,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || res.statusText);
      }
      const result = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ledger"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ledger/stats"] });
      onUploadResult({
        projectName: project.name,
        elementCount: result.elementCount ?? 0,
        warnings: result.warnings,
      });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className={isActive ? "ring-2 ring-primary" : ""} data-testid={`card-project-${project.id}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base" data-testid={`text-project-name-${project.id}`}>{project.name}</CardTitle>
          {isActive && <Badge variant="default" data-testid={`badge-active-${project.id}`}>Active</Badge>}
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2" data-testid={`text-project-desc-${project.id}`}>
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(project.created_utc).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1" data-testid={`text-elements-${project.id}`}>
            <Hash className="w-3 h-3" />
            {project.elementCount} elements
          </span>
          {project.hasLedger ? (
            <Badge variant="secondary" className="text-[10px]">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ledger loaded
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              No ledger
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 p-4 pt-0 flex-wrap">
        {!isActive && (
          <Button
            variant="default"
            size="sm"
            onClick={onSelect}
            disabled={selectPending}
            data-testid={`button-select-${project.id}`}
          >
            {selectPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
            Select
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid={`button-upload-${project.id}`}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload Ledger"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          className="hidden"
          onChange={handleUpload}
          data-testid={`input-file-${project.id}`}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-delete-${project.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-testid={`dialog-delete-${project.id}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone. All ledger data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid={`button-cancel-delete-${project.id}`}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} data-testid={`button-confirm-delete-${project.id}`}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
