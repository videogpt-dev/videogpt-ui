import { Fragment } from "react";
import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { STORY_STEPS, type StoryStepKind, type StoryStepMeta, type StoryStepStatus } from "./types";

export interface StoryStepperProps {
  status: (kind: StoryStepKind) => StoryStepStatus;
  onPick: (kind: StoryStepKind) => void;
  steps?: readonly StoryStepMeta[];
  className?: string;
}

const TONE: Record<StoryStepStatus, string> = {
  active: "bg-primary text-primary-foreground",
  done: "bg-foreground/10 text-foreground",
  busy: "bg-primary/15 text-primary",
  pending: "bg-foreground/8 text-foreground/75 hover:bg-foreground/12 hover:text-foreground",
  error: "bg-destructive/15 text-destructive",
  locked: "cursor-not-allowed bg-foreground/6 text-foreground/40",
};

export function StoryStepper({
  status,
  onPick,
  steps = STORY_STEPS,
  className,
}: StoryStepperProps) {
  return (
    <ol
      data-slot="story-stepper"
      className={cn(
        "-mx-1 flex w-auto items-center overflow-x-auto px-1 pb-1 sm:mx-0 sm:w-full sm:px-0 sm:pb-0",
        className,
      )}
    >
      {steps.map((step, index) => {
        const state = status(step.kind);
        const previousState = index > 0 ? status(steps[index - 1].kind) : null;
        const locked = state === "locked";
        return (
          <Fragment key={step.kind}>
            {previousState ? (
              <li
                role="presentation"
                aria-hidden="true"
                className={cn(
                  "mx-1 h-px min-w-4 flex-1",
                  previousState === "done"
                    ? "bg-vui-brand/55"
                    : previousState === "error"
                      ? "bg-destructive/55"
                      : "bg-border",
                )}
              />
            ) : null}
            <li className="shrink-0">
              <button
                type="button"
                disabled={locked}
                onClick={() => onPick(step.kind)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  TONE[state],
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-black/20 text-[0.6875rem]">
                  {state === "done" ? <Check size={11} /> : locked ? <Lock size={10} /> : index + 1}
                </span>
                {step.label}
                {step.optional ? (
                  <span className="text-[0.625rem] opacity-60">optional</span>
                ) : null}
              </button>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
