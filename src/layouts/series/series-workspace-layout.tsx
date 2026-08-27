import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SeriesWorkspaceLayoutProps {
  /** Series title/eyebrow row. */
  header?: ReactNode;
  /** Header-side controls (rename, settings, delete). */
  headerActions?: ReactNode;
  /** Cast editor. */
  cast?: ReactNode;
  /** Episode list. */
  episodes?: ReactNode;
  /** Right-rail panel, typically the showrunner. */
  aside?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function SeriesWorkspaceLayout({
  header,
  headerActions,
  cast,
  episodes,
  aside,
  footer,
  className,
}: SeriesWorkspaceLayoutProps) {
  return (
    <div
      data-slot="series-workspace-layout"
      className={cn("mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4", className)}
    >
      {header || headerActions ? (
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
            <div className="min-w-0">{header}</div>
            {headerActions ? (
              <div className="flex flex-wrap gap-2 sm:shrink-0">{headerActions}</div>
            ) : null}
          </CardHeader>
        </Card>
      ) : null}

      <div className={cn("grid min-w-0 gap-4", aside && "lg:grid-cols-[minmax(0,1fr)_22rem]")}>
        <div className="flex min-w-0 flex-col gap-4">
          {cast ? (
            <Card className="min-w-0 gap-0 py-0">
              <CardContent className="p-4">{cast}</CardContent>
            </Card>
          ) : null}
          {episodes ? (
            <Card className="min-w-0 gap-0 py-0">
              <CardContent className="p-4">{episodes}</CardContent>
            </Card>
          ) : null}
          {footer}
        </div>
        {aside ? <div className="flex min-w-0 flex-col gap-4">{aside}</div> : null}
      </div>
    </div>
  );
}
