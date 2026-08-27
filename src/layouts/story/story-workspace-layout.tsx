import type { ReactNode } from "react";

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
  className,
  contentClassName,
}: StoryWorkspaceLayoutProps) {
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

      <div className={cn("grid min-w-0 gap-4", aside && "lg:grid-cols-[minmax(0,1fr)_20rem]")}>
        <Card className="min-w-0 gap-0 py-0">
          <CardContent className={cn("flex flex-col gap-4 p-4", contentClassName)}>
            {title || subtitle ? (
              <div>
                {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
                {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
            ) : null}
            {children}
            {footer}
          </CardContent>
        </Card>
        {aside ? <div className="flex min-w-0 flex-col gap-4">{aside}</div> : null}
      </div>
    </div>
  );
}
