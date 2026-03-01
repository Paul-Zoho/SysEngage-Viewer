import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

export const ElementDetailContext = createContext<((id: string) => void) | null>(null);

interface ElementIdProps {
  id: string;
  className?: string;
  clickable?: boolean;
}

export function ElementId({ id, className, clickable = true }: ElementIdProps) {
  const openDetail = useContext(ElementDetailContext);
  const isClickable = clickable && openDetail && id;

  if (!id) {
    return (
      <code className={cn("text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground", className)}>
        --
      </code>
    );
  }

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={() => openDetail(id)}
        className={cn(
          "text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded-sm text-primary",
          "hover:bg-primary/10 hover:underline cursor-pointer transition-colors",
          className
        )}
        data-testid={`element-id-${id}`}
      >
        {id}
      </button>
    );
  }

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
