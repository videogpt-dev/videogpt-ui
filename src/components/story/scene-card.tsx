import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { StoryScene } from "./types";

export interface StorySceneCardProps {
  index: number;
  scene: StoryScene;
  /** Show the motion toggle (Video Mode). Off for storyboard-only projects. */
  showMotion?: boolean;
  /** Generated media preview (image/video/player) supplied by the consumer. */
  media?: ReactNode;
  /** Per-scene actions (regenerate, engine picker) supplied by the consumer. */
  actions?: ReactNode;
  readOnly?: boolean;
  onChange?: (patch: Partial<StoryScene>) => void;
  className?: string;
}

export function StorySceneCard({
  index,
  scene,
  showMotion = false,
  media,
  actions,
  readOnly = false,
  onChange,
  className,
}: StorySceneCardProps) {
  const patch = (next: Partial<StoryScene>) => onChange?.(next);
  return (
    <Card data-slot="story-scene-card" className={cn("gap-0 py-0", className)}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Scene {index + 1}</span>
          {actions}
        </div>

        {media ? <div data-slot="story-scene-media">{media}</div> : null}

        <Field>
          <FieldLabel htmlFor={`scene-${index}-prompt`}>Visual prompt</FieldLabel>
          <Textarea
            id={`scene-${index}-prompt`}
            rows={2}
            readOnly={readOnly}
            value={scene.prompt}
            onChange={(event) => patch({ prompt: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`scene-${index}-narration`}>Narration</FieldLabel>
          <Textarea
            id={`scene-${index}-narration`}
            rows={2}
            readOnly={readOnly}
            value={scene.narration}
            onChange={(event) => patch({ narration: event.target.value })}
          />
        </Field>

        {showMotion ? (
          <label className="flex items-center gap-3 text-sm" htmlFor={`scene-${index}-motion`}>
            <Switch
              id={`scene-${index}-motion`}
              checked={Boolean(scene.motion)}
              disabled={readOnly}
              onCheckedChange={(motion) => patch({ motion })}
            />
            Animate this scene
          </label>
        ) : null}
      </CardContent>
    </Card>
  );
}
