import type { ReactNode } from "react";
import { Layers } from "lucide-react";

import { SeriesSummaryCard } from "@/components/series/series-summary-card";
import type { SeriesSummary } from "@/components/series/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export interface SeriesLibraryLayoutProps {
  series: SeriesSummary[];
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  resolveImage?: (path: string) => string;
  renderPoster?: (path: string, series: SeriesSummary) => ReactNode;
  renderLink?: (series: SeriesSummary, children: ReactNode) => ReactNode;
  renderActions?: (series: SeriesSummary) => ReactNode;
  className?: string;
}

export function SeriesLibraryLayout({
  series,
  title = "Series",
  subtitle,
  action,
  emptyTitle = "No series yet",
  emptyDescription = "Create a series to build a recurring show with a persistent cast.",
  emptyAction,
  resolveImage,
  renderPoster,
  renderLink,
  renderActions,
  className,
}: SeriesLibraryLayoutProps) {
  return (
    <div
      data-slot="series-library-layout"
      className={cn("mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4", className)}
    >
      {title || action ? (
        <div className="flex items-end justify-between gap-3">
          <div>
            {title ? <h1 className="text-xl font-semibold">{title}</h1> : null}
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}

      {series.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {series.map((item) => (
            <SeriesSummaryCard
              key={item.id}
              series={item}
              resolveImage={resolveImage}
              renderPoster={renderPoster}
              renderLink={renderLink ? (children) => renderLink(item, children) : undefined}
              actions={renderActions?.(item)}
            />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Layers />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
          {emptyAction ? <EmptyContent>{emptyAction}</EmptyContent> : null}
        </Empty>
      )}
    </div>
  );
}
