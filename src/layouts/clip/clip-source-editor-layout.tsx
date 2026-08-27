import type { ReactNode } from "react";
import { Scissors } from "lucide-react";

import type { ClipSelectOption } from "@/components/clip/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ClipSourceEditorLayoutProps {
  preview: ReactNode;
  timeline: ReactNode;
  clips: ReactNode;
  startLabel: string;
  endLabel: string;
  durationLabel: string;
  format: string;
  formatOptions: ClipSelectOption[];
  adding?: boolean;
  className?: string;
  controlsClassName?: string;
  copy?: Partial<ClipSourceEditorCopy>;
  onFormatChange: (value: string) => void;
  onCreate: () => void;
}

export interface ClipSourceEditorCopy {
  create: string;
  adding: string;
  cropPreset: string;
  cropHint: string;
}

const DEFAULT_COPY: ClipSourceEditorCopy = {
  create: "Cut clip from selection",
  adding: "Adding...",
  cropPreset: "Crop preset",
  cropHint: "Drag preview crop in Original view for custom framing.",
};

export function ClipSourceEditorLayout({
  preview,
  timeline,
  clips,
  startLabel,
  endLabel,
  durationLabel,
  format,
  formatOptions,
  adding,
  className,
  controlsClassName,
  copy: copyOverrides,
  onFormatChange,
  onCreate,
}: ClipSourceEditorLayoutProps) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  return (
    <div data-slot="clip-source-editor-layout" className={cn("flex flex-col gap-4", className)}>
      {preview}
      {timeline}
      <Card className={cn("py-0", controlsClassName)}>
        <CardContent className="flex flex-wrap items-end gap-3 py-4">
          <Button type="button" onClick={onCreate} disabled={adding}>
            <Scissors /> {adding ? copy.adding : copy.create}
          </Button>
          <span className="pb-2 text-xs text-muted-foreground">
            {startLabel}-{endLabel} · {durationLabel}
          </span>
          <Field className="ml-auto w-40">
            <FieldLabel>{copy.cropPreset}</FieldLabel>
            <Select value={format} onValueChange={onFormatChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <p className="w-full text-xs text-muted-foreground">{copy.cropHint}</p>
        </CardContent>
      </Card>
      {clips}
    </div>
  );
}
