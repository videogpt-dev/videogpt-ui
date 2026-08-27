import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClipCreateCopy, ClipStepSlug } from "./types";

export interface ClipNavigationProps {
  step: ClipStepSlug;
  blocker?: string;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy: ClipCreateCopy;
  onStepChange: (step: ClipStepSlug) => void;
  className?: string;
}

export function ClipNavigation({
  step,
  blocker,
  submitting,
  submitDisabled,
  copy,
  onStepChange,
  className,
}: ClipNavigationProps) {
  return (
    <div data-slot="clip-navigation" className={cn("flex flex-col gap-2 pt-2", className)}>
      {blocker ? <p className="text-xs text-vui-warning">{blocker}</p> : null}
      <div className="flex items-center justify-between gap-3">
        {step === "source" ? (
          <span />
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onStepChange(step === "generate" ? "find-moments" : "source")}
          >
            <ArrowLeft /> Back
          </Button>
        )}
        {step === "generate" ? (
          <Button type="submit" disabled={submitting || submitDisabled}>
            {submitting ? (
              copy.submitting
            ) : (
              <>
                <Play /> {copy.submit}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            disabled={Boolean(blocker)}
            onClick={() => onStepChange(step === "source" ? "find-moments" : "generate")}
          >
            Next <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
