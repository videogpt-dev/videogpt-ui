import { Fragment } from "react";
import { Check, Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StoryStepStatus } from "./types";

export interface StoryPhaseItem<TId extends string = string> {
  id: TId;
  label: string;
}

export interface StoryPhaseStepperProps<TId extends string = string> {
  items: readonly StoryPhaseItem<TId>[];
  status: (id: TId) => StoryStepStatus;
  onPick: (id: TId) => void;
  className?: string;
}

const NODE_TONE: Record<StoryStepStatus, string> = {
  done: "border-primary bg-primary text-primary-foreground",
  active: "border-primary bg-background text-primary ring-4 ring-primary/15",
  busy: "border-primary bg-background text-primary",
  error: "border-destructive bg-background text-destructive",
  locked: "border-border bg-background text-muted-foreground/50",
  pending: "border-border bg-background text-muted-foreground",
};

export function StoryPhaseStepper<TId extends string>({
  items,
  status,
  onPick,
  className,
}: StoryPhaseStepperProps<TId>) {
  return (
    <nav
      data-slot="story-phase-stepper"
      className={cn(
        "flex items-center overflow-x-auto rounded-md border bg-muted/30 p-2",
        className,
      )}
      aria-label="Story phase"
    >
      {items.map((item, index) => {
        const state = status(item.id);
        const locked = state === "locked";
        return (
          <Fragment key={item.id}>
            {index > 0 ? (
              <span className="h-px min-w-4 flex-1 bg-border sm:min-w-8" aria-hidden />
            ) : null}
            <button
              type="button"
              disabled={locked}
              onClick={() => onPick(item.id)}
              title={locked ? "Complete previous phase first" : item.label}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs transition-colors",
                state === "active"
                  ? "bg-muted text-foreground"
                  : locked
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-semibold",
                  NODE_TONE[state],
                )}
              >
                {state === "done" ? (
                  <Check size={13} />
                ) : state === "busy" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : locked ? (
                  <Lock size={13} />
                ) : (
                  index + 1
                )}
              </span>
              <span>{item.label}</span>
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}
