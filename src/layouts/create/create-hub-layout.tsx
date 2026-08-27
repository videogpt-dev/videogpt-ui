import type { ReactNode } from "react";

import { SegmentPicker } from "@/components/studio/segment-picker";
import type { SegmentDefinition } from "@/components/studio/types";
import { cn } from "@/lib/utils";

export interface CreateHubLayoutProps {
  segments: SegmentDefinition[];
  onOpen: (codeName: string, segment: SegmentDefinition) => void;
  title?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  notice?: ReactNode;
  empty?: ReactNode;
  children?: ReactNode;
  className?: string;
  pickerClassName?: string;
}

export function CreateHubLayout({
  segments,
  onOpen,
  title = "What do you want to make?",
  description = "Choose an available workflow.",
  headerAction,
  notice,
  empty,
  children,
  className,
  pickerClassName,
}: CreateHubLayoutProps) {
  return (
    <div data-slot="create-hub-layout" className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            New
          </p>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {headerAction}
      </div>

      {notice}
      {segments.length > 0 ? (
        <SegmentPicker
          segments={segments}
          actionLabel="Open"
          onValueChange={onOpen}
          className={pickerClassName}
        />
      ) : (
        empty
      )}
      {children}
    </div>
  );
}
