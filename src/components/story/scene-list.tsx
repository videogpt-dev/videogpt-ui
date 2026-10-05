import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { StorySceneCard } from "./scene-card";
import type { StoryScene } from "./types";

export interface StorySceneListProps {
  scenes: StoryScene[];
  showMotion?: boolean;
  readOnly?: boolean;
  onSceneChange?: (index: number, patch: Partial<StoryScene>) => void;
  renderMedia?: (index: number, scene: StoryScene) => ReactNode;
  renderActions?: (index: number, scene: StoryScene) => ReactNode;
  empty?: ReactNode;
  className?: string;
}

export function StorySceneList({
  scenes,
  showMotion = false,
  readOnly = false,
  onSceneChange,
  renderMedia,
  renderActions,
  empty,
  className,
}: StorySceneListProps) {
  if (scenes.length === 0 && empty) {
    return <>{empty}</>;
  }
  return (
    <div data-slot="story-scene-list" className={cn("flex flex-col gap-4", className)}>
      {scenes.map((scene, index) => (
        <StorySceneCard
          key={index}
          index={index}
          scene={scene}
          showMotion={showMotion}
          readOnly={readOnly}
          media={renderMedia?.(index, scene)}
          actions={renderActions?.(index, scene)}
          onChange={onSceneChange ? (patch) => onSceneChange(index, patch) : undefined}
        />
      ))}
    </div>
  );
}
