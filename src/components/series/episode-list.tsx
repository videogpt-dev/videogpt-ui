import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Clapperboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { SeriesEpisodeCard } from "./episode-card";
import type { SeriesEpisode } from "./types";

export interface SeriesEpisodeListProps {
  episodes: SeriesEpisode[];
  title?: ReactNode;
  description?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  resolveImage?: (path: string) => string;
  renderLink?: (episode: SeriesEpisode, children: ReactNode) => ReactNode;
  renderActions?: (episode: SeriesEpisode) => ReactNode;
  action?: ReactNode;
  pageSize?: number;
  className?: string;
}

export function SeriesEpisodeList({
  episodes,
  title = "Episodes",
  description,
  emptyTitle = "No episodes yet",
  emptyDescription = "Plan a batch with the showrunner, or add one by hand.",
  resolveImage,
  renderLink,
  renderActions,
  action,
  pageSize = 5,
  className,
}: SeriesEpisodeListProps) {
  const [page, setPage] = useState(0);
  const newestFirst = episodes.map((episode, index) => ({ episode, index })).reverse();
  const pages = Math.max(1, Math.ceil(newestFirst.length / pageSize));
  const current = Math.min(page, pages - 1);
  const shown = newestFirst.slice(current * pageSize, (current + 1) * pageSize);

  return (
    <div data-slot="series-episode-list" className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </div>

      {episodes.length ? (
        <div className="flex flex-col gap-2">
          {shown.map(({ episode, index }) => (
            <SeriesEpisodeCard
              key={episode.id}
              episode={episode}
              index={index}
              resolveImage={resolveImage}
              renderLink={renderLink ? (children) => renderLink(episode, children) : undefined}
              actions={renderActions?.(episode)}
            />
          ))}
          {pages > 1 ? (
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {current * pageSize + 1}-{current * pageSize + shown.length} of {episodes.length}
              </span>
              <span className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Newer episodes"
                  disabled={current === 0}
                  onClick={() => setPage(current - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Older episodes"
                  disabled={current === pages - 1}
                  onClick={() => setPage(current + 1)}
                >
                  <ChevronRight />
                </Button>
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Clapperboard />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
