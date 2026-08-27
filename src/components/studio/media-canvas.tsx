import type { ReactNode } from "react";
import { Film, Play } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MediaCanvasProps {
  src?: string;
  poster?: string;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
  overlay?: ReactNode;
  aspect?: "portrait" | "landscape" | "square";
  className?: string;
}

const aspectClasses = {
  portrait: "aspect-[9/16] max-h-[70vh]",
  landscape: "aspect-video",
  square: "aspect-square max-h-[70vh]",
};

export function MediaCanvas({
  src,
  poster,
  title,
  emptyTitle = "Nothing rendered yet",
  emptyDescription = "Generated media will appear here.",
  toolbar,
  overlay,
  aspect = "landscape",
  className,
}: MediaCanvasProps) {
  return (
    <section
      data-slot="vui-media-canvas"
      className={cn("overflow-hidden rounded-2xl border bg-vui-stage", className)}
    >
      <div className="flex min-h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Film className="size-4 text-muted-foreground" />
          {title ?? "Preview"}
        </div>
        {toolbar}
      </div>
      <div className="flex min-h-80 items-center justify-center p-5 md:p-8">
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black shadow-2xl",
            aspectClasses[aspect],
          )}
        >
          {src ? (
            <video src={src} poster={poster} controls className="size-full object-contain" />
          ) : (
            <div className="max-w-xs p-8 text-center text-white/70">
              <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white/10">
                <Play className="size-5 fill-current" />
              </span>
              <h3 className="font-medium text-white">{emptyTitle}</h3>
              <p className="mt-1 text-sm leading-relaxed">{emptyDescription}</p>
            </div>
          )}
          {overlay}
        </div>
      </div>
    </section>
  );
}
