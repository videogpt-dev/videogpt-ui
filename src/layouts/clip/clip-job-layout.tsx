import type { ReactNode } from "react";
import { Ban, CircleAlert, CircleCheck, Clock, Loader, MinusCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ClipStageStatus = "pending" | "running" | "done" | "skipped" | "failed" | "cancelled";

export interface ClipStageItem {
  name: string;
  status: ClipStageStatus;
}

export interface ClipJobLayoutProps {
  stages: ClipStageItem[];
  controls?: ReactNode;
  logs?: ReactNode;
  labels?: Record<string, string>;
  waitingText?: string;
  title?: ReactNode;
  className?: string;
  progressClassName?: string;
}

const icons = {
  pending: Clock,
  running: Loader,
  done: CircleCheck,
  skipped: MinusCircle,
  failed: CircleAlert,
  cancelled: Ban,
};

const tones: Record<ClipStageStatus, string> = {
  pending: "text-muted-foreground",
  running: "animate-spin text-vui-brand",
  done: "text-vui-success",
  skipped: "text-muted-foreground",
  failed: "text-destructive",
  cancelled: "text-muted-foreground",
};

export function ClipJobLayout({
  stages,
  controls,
  logs,
  labels = {},
  waitingText = "Waiting for run to start...",
  title = "Progress",
  className,
  progressClassName,
}: ClipJobLayoutProps) {
  return (
    <div
      data-slot="clip-job-layout"
      className={cn("grid gap-6 lg:grid-cols-[1fr_1.2fr]", className)}
    >
      <Card className={cn("gap-0 py-0", progressClassName)}>
        <CardHeader className="border-b py-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <ol className="grid gap-2">
            {stages.length === 0 ? (
              <li className="text-sm text-muted-foreground">{waitingText}</li>
            ) : null}
            {stages.map((stage) => {
              const Icon = icons[stage.status];
              return (
                <li key={stage.name} className="flex items-center gap-2.5 text-sm">
                  <Icon className={cn("size-4 shrink-0", tones[stage.status])} />
                  <span className={stage.status === "pending" ? "text-muted-foreground" : ""}>
                    {labels[stage.name] || stage.name}
                  </span>
                  {stage.status === "skipped" || stage.status === "cancelled" ? (
                    <span className="text-xs text-muted-foreground">{stage.status}</span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          {controls}
        </CardContent>
      </Card>
      {logs}
    </div>
  );
}
