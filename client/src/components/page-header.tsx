import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 pb-4 border-b border-border mb-6", className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-page-title">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-page-description">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
