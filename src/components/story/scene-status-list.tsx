import type { ReactNode } from "react";
import { Check, Loader2, MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";

export type StorySceneItemStatus = "pending" | "busy" | "done" | "error";

export interface StorySceneStatusItem<TId extends string | number = string | number> {
  id: TId;
  title: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  badge?: ReactNode;
  trailing?: ReactNode;
  status?: StorySceneItemStatus;
}

export interface StorySceneStatusListProps<TId extends string | number = string | number> {
  items: readonly StorySceneStatusItem<TId>[];
  activeId?: TId | null;
  onOpen: (id: TId) => void;
  className?: string;
}

export function StorySceneStatusList<TId extends string | number>({
  items,
  activeId,
  onOpen,
  className,
}: StorySceneStatusListProps<TId>) {
  return (
    <div data-slot="story-scene-status-list" className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors hover:bg-muted/40",
            activeId === item.id ? "border-primary" : "border-border",
          )}
        >
          <button
            type="button"
            onClick={() => onOpen(item.id)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded bg-muted text-xs text-muted-foreground">
              {item.media}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {item.title}
                {item.badge}
                {item.status === "busy" ? (
                  <Loader2 size={12} className="animate-spin text-primary" />
                ) : item.status === "done" ? (
                  <Check size={12} className="text-vui-success" />
                ) : item.status === "error" ? (
                  <span className="text-xs text-destructive">Failed</span>
                ) : null}
              </span>
              {item.description ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </span>
            <MoreVertical size={16} className="shrink-0 text-muted-foreground" />
          </button>
          {item.trailing}
        </div>
      ))}
    </div>
  );
}
