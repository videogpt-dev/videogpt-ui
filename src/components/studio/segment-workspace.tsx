import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { resolveIcon } from "./icons";
import type { IconRegistry, SegmentDefinition } from "./types";

export interface SegmentWorkspaceProps {
  segment: SegmentDefinition;
  children: ReactNode;
  icons?: IconRegistry;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  navigation?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SegmentWorkspace({
  segment,
  children,
  icons,
  eyebrow = "Generation workspace",
  actions,
  navigation,
  className,
  contentClassName,
}: SegmentWorkspaceProps) {
  const Icon = resolveIcon(segment.icon, icons);

  return (
    <section data-slot="vui-segment-workspace" className={cn("grid gap-6", className)}>
      <header className="relative overflow-hidden rounded-2xl border bg-card px-5 py-5 shadow-sm sm:px-6">
        <div
          className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-vui-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-vui-brand/10 text-vui-brand ring-1 ring-vui-brand/20">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {eyebrow}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{segment.name}</h1>
                <Badge variant="outline" className="bg-background/60 capitalize">
                  {segment.status}
                </Badge>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {segment.description}
              </p>
            </div>
          </div>
          {actions ? <div className="relative flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
        {navigation ? <div className="relative mt-5 border-t pt-4">{navigation}</div> : null}
      </header>

      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </section>
  );
}
