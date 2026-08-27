import { cn } from "@/lib/utils";

import { SegmentCard } from "./segment-card";
import type { IconRegistry, SegmentDefinition } from "./types";

export interface SegmentPickerProps {
  segments: SegmentDefinition[];
  value?: string;
  icons?: IconRegistry;
  onValueChange?: (codeName: string, segment: SegmentDefinition) => void;
  actionLabel?: string;
  className?: string;
  cardClassName?: string;
}

export function SegmentPicker({
  segments,
  value,
  icons,
  onValueChange,
  actionLabel = "Open",
  className,
  cardClassName,
}: SegmentPickerProps) {
  return (
    <div
      data-slot="vui-segment-picker"
      className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3", className)}
    >
      {segments.map((segment) => (
        <SegmentCard
          key={segment.code_name}
          segment={segment}
          icons={icons}
          selected={value === segment.code_name}
          onSelect={(selected) => onValueChange?.(selected.code_name, selected)}
          actionLabel={actionLabel}
          className={cardClassName}
        />
      ))}
    </div>
  );
}
