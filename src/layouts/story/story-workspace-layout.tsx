import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StoryStepper } from "@/components/story/stepper";
import {
  STORY_STEPS,
  type StoryStepKind,
  type StoryStepMeta,
  type StoryStepStatus,
} from "@/components/story/types";
import { cn } from "@/lib/utils";

export interface StoryWorkspaceLayoutProps {
  /** Status per step (done / active / busy / pending / error / locked). The step whose
   *  status is "active" is the one whose body is rendered as `children`. */
  status: (kind: StoryStepKind) => StoryStepStatus;
  onStepChange: (kind: StoryStepKind) => void;
  steps?: readonly StoryStepMeta[];
  /** The active step's body. */
  children: ReactNode;
  /** Title/subtitle for the active step. */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Progress bar / job status rendered under the stepper. */
  progress?: ReactNode;
  /** Right-rail panel (spend, variants, versions). */
  aside?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  /** Render a Back / Continue bar under the step body that walks the steps in order. */
  stepNav?: boolean;
  className?: string;
  contentClassName?: string;
}

export function StoryWorkspaceLayout({
  status,
  onStepChange,
  steps = STORY_STEPS,
  children,
  title,
  subtitle,
  progress,
  aside,
  header,
  footer,
  stepNav,
  className,
  contentClassName,
}: StoryWorkspaceLayoutProps) {
  const activeIndex = steps.findIndex((step) => status(step.kind) === "active");
  const prevStep = activeIndex > 0 ? steps[activeIndex - 1] : undefined;
  const nextStep = activeIndex >= 0 ? steps[activeIndex + 1] : undefined;
  return (
    <div
      data-slot="story-workspace-layout"
      className={cn("mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-4", className)}
    >
      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-col items-stretch gap-3 py-4">
          {header}
          <StoryStepper status={status} onPick={onStepChange} steps={steps} />
          {progress}
        </CardHeader>
      </Card>

      <div className={cn("grid min-w-0 gap-4", aside && "lg:grid-cols-[minmax(0,1fr)]")}>
        <Card className="min-w-0 gap-0 py-0">
          <CardContent className={cn("flex flex-col gap-4 p-4", contentClassName)}>
            {title || subtitle ? (
              <div>
                {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
                {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            ) : null}
            {children}
            {stepNav && (prevStep || nextStep) ? (
              <div className="flex items-center justify-between gap-2 border-t pt-4">
                {prevStep ? (
                  <Button variant="ghost" size="sm" onClick={() => onStepChange(prevStep.kind)}>
                    <ArrowLeft /> {prevStep.label}
                  </Button>
                ) : <span />}
                {nextStep ? (
                  <Button variant="outline" size="sm" onClick={() => onStepChange(nextStep.kind)}>
                    Continue to {nextStep.label} <ArrowRight />
                  </Button>
                ) : <span />}
              </div>
            ) : null}
            {footer}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
