import type { ReactNode } from "react";
import { Clapperboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SERIES_EPISODE_STATUS_META, type SeriesEpisode } from "./types";

export interface SeriesEpisodeCardProps {
  episode: SeriesEpisode;
  index?: number;
  /** Turn the stored thumbnail path into a URL. Defaults to the path unchanged. */
  resolveImage?: (path: string) => string;
  /** Wraps the card as a link (consumer supplies an anchor/router Link). */
  renderLink?: (children: ReactNode) => ReactNode;
  /** Trailing controls (menu, delete) supplied by the consumer. */
  actions?: ReactNode;
  className?: string;
}

export function SeriesEpisodeCard({
  episode,
  index,
  resolveImage = (path) => path,
  renderLink,
  actions,
  className,
}: SeriesEpisodeCardProps) {
  const status = SERIES_EPISODE_STATUS_META[episode.status] ?? SERIES_EPISODE_STATUS_META.draft;
  const body = (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {episode.thumbnail ? (
          <img
            src={resolveImage(episode.thumbnail)}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <Clapperboard size={18} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {typeof index === "number" ? (
            <span className="text-xs font-semibold text-muted-foreground">E{index + 1}</span>
          ) : null}
          <span className="truncate text-sm font-medium text-foreground">
            {episode.title || "Untitled episode"}
          </span>
        </span>
        {episode.description ? (
          <span className="block truncate text-xs text-muted-foreground">
            {episode.description}
          </span>
        ) : null}
      </span>
      <Badge variant={status.variant}>{status.label}</Badge>
    </div>
  );

  return (
    <Card data-slot="series-episode-card" className={cn("gap-0 py-0", className)}>
      <CardContent className="flex items-center gap-2 p-3">
        <div className="min-w-0 flex-1">{renderLink ? renderLink(body) : body}</div>
        {actions}
      </CardContent>
    </Card>
  );
}
