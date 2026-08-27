import type { ReactNode } from "react";
import { Clapperboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ClipLibraryItem {
  id: string;
  title?: string;
  text?: string;
  format?: string;
  durationSeconds: number;
  rendered: boolean;
  published?: boolean;
  size?: string | null;
}

export interface ClipLibraryCardProps {
  clip: ClipLibraryItem;
  videoSrc?: string;
  actions?: ReactNode;
  messages?: ReactNode;
  onEdit?: () => void;
  className?: string;
  mediaClassName?: string;
  copy?: Partial<ClipLibraryCardCopy>;
}

export interface ClipLibraryCardCopy {
  pending: string;
  pendingAction: string;
  pendingBadge: string;
  rendered: string;
}

const DEFAULT_COPY: ClipLibraryCardCopy = {
  pending: "Not rendered yet",
  pendingAction: "Open editor to render",
  pendingBadge: "pending",
  rendered: "rendered",
};

export function ClipLibraryCard({
  clip,
  videoSrc,
  actions,
  messages,
  onEdit,
  className,
  mediaClassName,
  copy: copyOverrides,
}: ClipLibraryCardProps) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  return (
    <Card data-slot="clip-library-card" className={cn("min-w-0 gap-3", className)}>
      {clip.rendered && videoSrc ? (
        <video
          controls
          preload="metadata"
          src={videoSrc}
          className={cn("aspect-9/16 max-h-[60vh] w-full bg-black", mediaClassName)}
        />
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className={cn(
            "flex aspect-9/16 max-h-[60vh] w-full flex-col items-center justify-center gap-2 border-y border-dashed bg-muted/40 text-center text-sm text-muted-foreground hover:text-foreground",
            mediaClassName,
          )}
        >
          <Clapperboard className="size-7" />
          <span>{copy.pending}</span>
          <span className="text-xs">{copy.pendingAction}</span>
        </button>
      )}

      <CardContent className="grid gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={clip.rendered ? "secondary" : "outline"}>
            {clip.rendered ? clip.format || copy.rendered : copy.pendingBadge}
          </Badge>
          {clip.published ? <Badge>published</Badge> : null}
          <span className="ml-auto text-xs text-muted-foreground">
            {clip.size || `${clip.durationSeconds.toFixed(1)}s`}
          </span>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="min-w-0 truncate text-left text-xs font-medium hover:text-primary"
            title={clip.text || clip.title || clip.id}
          >
            {clip.id}
            {clip.text ? ` · ${clip.text}` : ""}
          </button>
          {actions}
        </div>
        {messages}
      </CardContent>
    </Card>
  );
}
