import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  value: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function ConfidenceIndicator({ value, size = "sm", showLabel = false }: ConfidenceIndicatorProps) {
  const percent = Math.round(value * 100);
  const color = percent >= 90 ? "text-[hsl(122,43%,45%)]" : percent >= 70 ? "text-[hsl(43,74%,42%)]" : "text-[hsl(0,84%,42%)]";
  const bgColor = percent >= 90 ? "bg-[hsl(122,43%,45%)]" : percent >= 70 ? "bg-[hsl(43,74%,42%)]" : "bg-[hsl(0,84%,42%)]";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1.5", size === "sm" ? "text-xs" : "text-sm")}>
          <div className={cn("rounded-full", bgColor, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
          {showLabel && <span className={cn("font-mono", color)}>{percent}%</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Confidence: {percent}%</p>
      </TooltipContent>
    </Tooltip>
  );
}
