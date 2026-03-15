import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ElementId } from "@/components/element-id";
import { Link } from "wouter";
import type { ZachmanGridResponse, ZachmanGridCell, ZachmanCoverageState } from "@shared/schema";
import { ZACHMAN_ROWS, ZACHMAN_COLUMNS, ZACHMAN_ROW_LABELS } from "@shared/schema";

const STATE_COLORS: Record<ZachmanCoverageState, { bg: string; text: string; border: string; label: string }> = {
  FullyCovered: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-300 dark:border-emerald-700",
    label: "Fully Covered",
  },
  PartiallyCovered: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-700",
    label: "Partially Covered",
  },
  NotCovered: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    label: "Not Covered",
  },
  NotDeclared: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-muted",
    label: "Not Declared",
  },
};

function CellPopover({ cell }: { cell: ZachmanGridCell }) {
  const style = STATE_COLORS[cell.coverageState];
  return (
    <PopoverContent className="w-80" data-testid={`popover-cell-${cell.row}-${cell.column}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {cell.cellId ? (
            <Link
              href={`/element/${encodeURIComponent(cell.cellId)}`}
              className="text-sm font-semibold text-primary hover:underline"
              data-testid={`link-cell-detail-${cell.row}-${cell.column}`}
            >
              {cell.cellId}
            </Link>
          ) : (
            <span className="text-sm font-semibold" data-testid={`text-popover-title-${cell.row}-${cell.column}`}>
              R{cell.row} / {cell.column}
            </span>
          )}
          <Badge variant="outline" className={`text-[10px] ${style.text}`}>
            {style.label}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Row</span>
            <span className="font-medium text-foreground">{ZACHMAN_ROW_LABELS[cell.row]}</span>
          </div>
          <div className="flex justify-between">
            <span>Column</span>
            <span className="font-medium text-foreground">{cell.column}</span>
          </div>
          {cell.confidence != null && (
            <div className="flex justify-between">
              <span>Confidence</span>
              <span className="font-medium text-foreground">{(cell.confidence * 100).toFixed(0)}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Content Items</span>
            <span className="font-medium text-foreground">{cell.contentCount}</span>
          </div>
        </div>

        {cell.coverageItems.length > 0 && (
          <div className="border-t pt-2 space-y-2">
            <p className="text-xs font-semibold">Coverage Items ({cell.coverageItems.length})</p>
            {cell.coverageItems.map((ci) => (
              <div key={ci.coverageId} className="text-xs p-2 rounded bg-muted/50 space-y-1" data-testid={`popover-coverage-${ci.coverageId}`}>
                <div className="flex items-center justify-between">
                  <ElementId id={ci.coverageId} />
                  <Badge variant="outline" className="text-[10px]">{ci.coverageState}</Badge>
                </div>
                {ci.confidence != null && (
                  <div className="text-muted-foreground">Confidence: {(ci.confidence * 100).toFixed(0)}%</div>
                )}
                {ci.notes && (
                  <p className="text-muted-foreground line-clamp-2">{ci.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {cell.coverageState === "NotDeclared" && (
          <p className="text-xs text-muted-foreground italic">
            No Zachman cell declared for this position yet.
          </p>
        )}
      </div>
    </PopoverContent>
  );
}

function GridCell({ cell }: { cell: ZachmanGridCell }) {
  const style = STATE_COLORS[cell.coverageState];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`w-full h-full min-h-[80px] p-2 rounded-md border ${style.bg} ${style.border} transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center gap-1`}
          data-testid={`cell-${cell.row}-${cell.column}`}
        >
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
            {style.label}
          </span>
          {cell.cellId && (
            <>
              {cell.confidence != null && (
                <span className={`text-lg font-bold ${style.text}`}>
                  {(cell.confidence * 100).toFixed(0)}%
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {cell.contentCount} item{cell.contentCount !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <CellPopover cell={cell} />
    </Popover>
  );
}

export default function ZachmanGrid() {
  const { data, isLoading, isError } = useQuery<ZachmanGridResponse>({
    queryKey: ["/api/ledger/zachman-grid"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <PageHeader
          title="Zachman Coverage Grid"
          description="Failed to load grid data. Please try again."
          icon={<Grid3X3 className="w-5 h-5 text-destructive" />}
        />
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground" data-testid="text-grid-error">
            Unable to load the Zachman coverage grid. Check that a project is selected and has ledger data.
          </CardContent>
        </Card>
      </div>
    );
  }

  const grid = data?.grid || {};
  const totalDeclared = data?.totalDeclared || 0;
  const totalCovered = data?.totalCovered || 0;
  const totalPartial = data?.totalPartial || 0;
  const totalNotCovered = data?.totalNotCovered || 0;
  const totalNotDeclared = 36 - totalDeclared;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Zachman Coverage Grid"
        description="6x6 coverage heatmap showing Zachman Framework completeness across perspectives and interrogatives"
        icon={<Grid3X3 className="w-5 h-5 text-primary" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card data-testid="card-grid-declared">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{totalDeclared}</p>
            <p className="text-xs text-muted-foreground">Declared</p>
          </CardContent>
        </Card>
        <Card data-testid="card-grid-covered">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{totalCovered}</p>
            <p className="text-xs text-muted-foreground">Fully Covered</p>
          </CardContent>
        </Card>
        <Card data-testid="card-grid-partial">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{totalPartial}</p>
            <p className="text-xs text-muted-foreground">Partial</p>
          </CardContent>
        </Card>
        <Card data-testid="card-grid-notcovered">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{totalNotCovered + totalNotDeclared}</p>
            <p className="text-xs text-muted-foreground">Not Covered / Absent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full border-collapse" data-testid="table-zachman-grid">
            <thead>
              <tr>
                <th className="p-2 text-xs font-semibold text-muted-foreground text-left w-[160px]">
                  Perspective
                </th>
                {ZACHMAN_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="p-2 text-xs font-semibold text-center min-w-[110px]"
                    data-testid={`header-col-${col}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ZACHMAN_ROWS.map((row) => (
                <tr key={row} data-testid={`row-zachman-${row}`}>
                  <td className="p-2 text-xs font-medium text-muted-foreground align-middle" data-testid={`label-row-${row}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-[10px] font-bold shrink-0">
                        {row}
                      </span>
                      <span className="leading-tight">{ZACHMAN_ROW_LABELS[row]}</span>
                    </div>
                  </td>
                  {ZACHMAN_COLUMNS.map((col) => {
                    const key = `${row}-${col}`;
                    const cell: ZachmanGridCell = grid[key] || {
                      cellId: null, row, column: col,
                      coverageState: "NotDeclared" as ZachmanCoverageState,
                      confidence: null, contentCount: 0, coverageItems: [],
                    };
                    return (
                      <td key={col} className="p-1">
                        <GridCell cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4 px-1" data-testid="legend-zachman-grid">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span className="font-medium">Legend:</span>
        </div>
        {(Object.entries(STATE_COLORS) as [ZachmanCoverageState, typeof STATE_COLORS[ZachmanCoverageState]][]).map(([state, style]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm border ${style.bg} ${style.border}`} />
            <span className="text-xs text-muted-foreground">{style.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
