import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { ClipSteps, type ClipStepSlug } from "./types";

export interface ClipStepperProps {
  current: number;
  furthest: number;
  onPick: (step: ClipStepSlug) => void;
  className?: string;
}

export function ClipStepper({ current, furthest, onPick, className }: ClipStepperProps) {
  return (
    <ol data-slot="clip-stepper" className={cn("flex flex-wrap gap-2", className)}>
      {ClipSteps.all.map((step, index) => {
        const reachable = index <= furthest;
        return (
          <li key={step.slug}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onPick(step.slug)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                index === current
                  ? "bg-primary text-primary-foreground"
                  : reachable
                    ? "bg-foreground/8 text-foreground/75 hover:bg-foreground/12 hover:text-foreground"
                    : "cursor-not-allowed bg-foreground/6 text-foreground/40",
              )}
            >
              <span className="grid size-5 place-items-center rounded-full bg-black/20">
                {index < current ? <Check size={11} /> : index + 1}
              </span>
              {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
