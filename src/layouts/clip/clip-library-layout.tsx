import type { ReactNode } from "react";
import { Clapperboard } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export interface ClipLibraryLayoutProps<T> {
  clips: T[];
  getKey: (clip: T) => string;
  renderClip: (clip: T) => ReactNode;
  empty?: ReactNode;
  className?: string;
  gridClassName?: string;
}

export function ClipLibraryLayout<T>({
  clips,
  getKey,
  renderClip,
  empty,
  className,
  gridClassName,
}: ClipLibraryLayoutProps<T>) {
  return (
    <section data-slot="clip-library-layout" className={cn("min-w-0", className)}>
      {clips.length === 0 ? (
        (empty ?? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clapperboard />
              </EmptyMedia>
              <EmptyTitle>No clips yet</EmptyTitle>
              <EmptyDescription>Find moments or add a manual selection first.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ))
      ) : (
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", gridClassName)}>
          {clips.map((clip) => (
            <div key={getKey(clip)}>{renderClip(clip)}</div>
          ))}
        </div>
      )}
    </section>
  );
}
