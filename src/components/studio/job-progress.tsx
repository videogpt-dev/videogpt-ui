import { Ban, CircleCheck, CircleDashed, CircleX, LoaderCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { JobStatus } from "./types";

const statusIcons = {
  idle: CircleDashed,
  queued: CircleDashed,
  running: LoaderCircle,
  completed: CircleCheck,
  failed: CircleX,
  cancelled: Ban,
} as const;

export interface JobProgressProps {
  status: JobStatus;
  progress?: number;
  stage?: string;
  detail?: string;
  className?: string;
}

export function JobProgress({ status, progress = 0, stage, detail, className }: JobProgressProps) {
  const Icon = statusIcons[status];

  return (
    <div
      data-slot="vui-job-progress"
      data-status={status}
      className={cn("flex flex-col gap-3 rounded-xl border bg-card p-4", className)}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "size-4 text-muted-foreground",
            status === "running" && "animate-spin text-vui-brand",
            status === "completed" && "text-vui-success",
            status === "failed" && "text-destructive",
            status === "cancelled" && "text-muted-foreground",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {stage ?? status[0].toUpperCase() + status.slice(1)}
          </div>
          {detail ? <div className="truncate text-xs text-muted-foreground">{detail}</div> : null}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
