import type { ReactNode } from "react";
import { Layers, ListVideo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SeriesSummary } from "./types";

export interface SeriesSummaryCardProps {
  series: SeriesSummary;
  resolveImage?: (path: string) => string;
  renderPoster?: (path: string, series: SeriesSummary) => ReactNode;
  renderLink?: (children: ReactNode) => ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SeriesSummaryCard({
  series,
  resolveImage = (path) => path,
  renderPoster,
  renderLink,
  actions,
  className,
}: SeriesSummaryCardProps) {
  const episodes = series.episodeCount ?? 0;
  const body = (
    <div className="flex min-w-0 gap-3">
      <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {series.poster ? (
          renderPoster ? (
            renderPoster(series.poster, series)
          ) : (
            <img
              src={resolveImage(series.poster)}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <Layers size={20} />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {series.name || "Untitled series"}
          </span>
          {series.mature ? <Badge variant="destructive">Mature</Badge> : null}
        </span>
        {series.premise ? (
          <span className="line-clamp-2 text-xs text-muted-foreground">{series.premise}</span>
        ) : null}
        <span className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
          <ListVideo size={12} />
          {episodes} {episodes === 1 ? "episode" : "episodes"}
        </span>
      </span>
    </div>
  );

  return (
    <Card data-slot="series-summary-card" className={cn("min-w-0 gap-0 py-0", className)}>
      <CardContent className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">{renderLink ? renderLink(body) : body}</div>
        {actions}
      </CardContent>
    </Card>
  );
}
