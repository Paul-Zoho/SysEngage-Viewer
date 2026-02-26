import { cn } from "@/lib/utils";

interface ElementIdProps {
  id: string;
  className?: string;
}

export function ElementId({ id, className }: ElementIdProps) {
  return (
    <code className={cn("text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded-sm text-primary", className)} data-testid={`element-id-${id}`}>
      {id}
    </code>
  );
}

interface ElementRefListProps {
  refs: string[];
  label?: string;
  className?: string;
}

export function ElementRefList({ refs, label, className }: ElementRefListProps) {
  if (!refs || refs.length === 0) return null;
  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {label && <span className="text-[10px] text-muted-foreground mr-0.5">{label}:</span>}
      {refs.map((ref) => (
        <ElementId key={ref} id={ref} />
      ))}
    </div>
  );
}
