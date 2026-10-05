import type { ReactNode } from "react";
import { Check, Clapperboard, Save, X } from "lucide-react";

import { OptionSelect } from "@/components/forms/option-select";
import type { SelectOption } from "@/components/forms/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ClipEditorClassNames {
  root?: string;
  card?: string;
  framing?: string;
  export?: string;
  variants?: string;
}

export interface ClipEditorSlots {
  before?: ReactNode;
  preview: ReactNode;
  timeline: ReactNode;
  estimate?: ReactNode;
  status?: ReactNode;
  variants?: ReactNode;
  after?: ReactNode;
}

export interface ClipEditorLayoutProps {
  format: string;
  formatOptions: readonly SelectOption[];
  showCaptions: boolean;
  inSec: number;
  outSec: number;
  quality: string;
  qualityOptions: readonly SelectOption[];
  rendering?: boolean;
  busy?: boolean;
  cannotAfford?: boolean;
  saved?: boolean;
  slots: ClipEditorSlots;
  classNames?: ClipEditorClassNames;
  copy?: Partial<ClipEditorCopy>;
  onFormatChange: (value: string) => void;
  onCaptionsChange: (value: boolean) => void;
  onTrimChange: (value: { inSec?: number; outSec?: number }) => void;
  onQualityChange: (value: string) => void;
  onRender: () => void;
  onCancel?: () => void;
  onSave: () => void;
}

export interface ClipEditorCopy {
  aspectRatio: string;
  aspectHint: string;
  previewCaptions: string;
  captionsHint: string;
  trim: string;
  start: string;
  end: string;
  exportTitle: string;
  exportDescription: (durationSeconds: number) => ReactNode;
  quality: string;
  exportAction: string;
  cancelAction: string;
  saveAction: string;
  saved: string;
}

const DEFAULT_COPY: ClipEditorCopy = {
  aspectRatio: "Aspect ratio",
  aspectHint: "Use preview crop handles for custom framing.",
  previewCaptions: "Preview captions",
  captionsHint: "Captioned export remains separate.",
  trim: "Fine-tune start and end",
  start: "Start (s)",
  end: "End (s)",
  exportTitle: "Export clip",
  exportDescription: (duration) =>
    `Save trim and crop, then render ${duration.toFixed(1)} seconds.`,
  quality: "Quality",
  exportAction: "Export clip",
  cancelAction: "Cancel render",
  saveAction: "Save for later",
  saved: "Saved",
};

export function ClipEditorLayout({
  format,
  formatOptions,
  showCaptions,
  inSec,
  outSec,
  quality,
  qualityOptions,
  rendering,
  busy,
  cannotAfford,
  saved,
  slots,
  classNames = {},
  copy: copyOverrides,
  onFormatChange,
  onCaptionsChange,
  onTrimChange,
  onQualityChange,
  onRender,
  onCancel,
  onSave,
}: ClipEditorLayoutProps) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  return (
    <div data-slot="clip-editor-layout" className={cn("flex flex-col gap-4", classNames.root)}>
      {slots.before}
      {slots.preview}
      {slots.timeline}

      <Card className={cn("gap-0 py-0", classNames.card)}>
        <CardContent className="grid gap-6 py-5">
          <section className={cn("grid gap-4", classNames.framing)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>{copy.aspectRatio}</FieldLabel>
                <OptionSelect
                  value={format}
                  options={formatOptions}
                  onValueChange={onFormatChange}
                />
                <FieldDescription>{copy.aspectHint}</FieldDescription>
              </Field>
              <Field orientation="horizontal" className="items-start pt-6">
                <Checkbox
                  id="clip-editor-captions"
                  checked={showCaptions}
                  onCheckedChange={(value) => onCaptionsChange(value === true)}
                />
                <div>
                  <FieldLabel htmlFor="clip-editor-captions">{copy.previewCaptions}</FieldLabel>
                  <FieldDescription>{copy.captionsHint}</FieldDescription>
                </div>
              </Field>
            </div>
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer select-none">{copy.trim}</summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="clip-editor-start">{copy.start}</FieldLabel>
                  <Input
                    id="clip-editor-start"
                    type="number"
                    step="0.1"
                    value={inSec}
                    onChange={(event) =>
                      onTrimChange({ inSec: Math.max(0, Number(event.target.value) || 0) })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="clip-editor-end">{copy.end}</FieldLabel>
                  <Input
                    id="clip-editor-end"
                    type="number"
                    step="0.1"
                    value={outSec}
                    onChange={(event) =>
                      onTrimChange({ outSec: Number(event.target.value) || inSec + 1 })
                    }
                  />
                </Field>
              </div>
            </details>
          </section>

          <section className={cn("grid gap-4 border-t pt-5", classNames.export)}>
            <div>
              <h3 className="text-sm font-semibold">{copy.exportTitle}</h3>
              <p className="mt-1 max-w-prose text-xs text-muted-foreground">
                {copy.exportDescription(outSec - inSec)}
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Field className="w-44">
                <FieldLabel>{copy.quality}</FieldLabel>
                <OptionSelect
                  value={quality}
                  options={qualityOptions}
                  onValueChange={onQualityChange}
                />
              </Field>
              <Button type="button" onClick={onRender} disabled={rendering || cannotAfford}>
                <Clapperboard /> {copy.exportAction}
              </Button>
              {rendering && onCancel ? (
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X /> {copy.cancelAction}
                </Button>
              ) : null}
              {slots.estimate}
              <Button type="button" variant="ghost" onClick={onSave} disabled={busy}>
                <Save /> {copy.saveAction}
              </Button>
            </div>
            <div className="flex min-h-6 items-center gap-3">
              {saved ? (
                <span className="inline-flex items-center gap-1 text-xs text-vui-success">
                  <Check className="size-3.5" /> {copy.saved}
                </span>
              ) : null}
              {slots.status}
            </div>
          </section>

          {slots.variants ? (
            <section className={cn("border-t pt-5", classNames.variants)}>{slots.variants}</section>
          ) : null}
        </CardContent>
      </Card>
      {slots.after}
    </div>
  );
}
