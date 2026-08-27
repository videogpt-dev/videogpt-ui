import type { ReactNode } from "react";
import { Clapperboard } from "lucide-react";

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
  /** Header-side control (e.g. "New episode"). */
  action?: ReactNode;
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
  className,
}: SeriesEpisodeListProps) {
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
          {episodes.map((episode, index) => (
            <SeriesEpisodeCard
              key={episode.id}
              episode={episode}
              index={index}
              resolveImage={resolveImage}
              renderLink={renderLink ? (children) => renderLink(episode, children) : undefined}
              actions={renderActions?.(episode)}
            />
          ))}
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
