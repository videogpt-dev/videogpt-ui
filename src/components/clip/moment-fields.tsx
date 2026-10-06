import type { ReactNode } from "react";

import { SelectField } from "@/components/forms/option-select";
import type { SelectOption } from "@/components/forms/types";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { ClipCreateCopy, ClipDraft, ClipLimits } from "./types";

export interface ClipMomentFieldsProps {
  copy: ClipCreateCopy;
  draft: ClipDraft;
  limits: ClipLimits;
  formatOptions: readonly SelectOption[];
  finderOptions: readonly SelectOption[];
  providerOptions: readonly SelectOption[];
  transcriptOptions: readonly SelectOption[];
  qualityOptions: readonly SelectOption[];
  whisperModels: readonly string[];
  engine?: ReactNode;
  onWhisperChange: (value: string) => void;
  onMinInterestChange: (value: number) => void;
  className?: string;
}

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-border pt-5 lg:grid-cols-4 lg:gap-6">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function SliderField({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{value}</span>
      </div>
      <div className="flex h-9 items-center">{children}</div>
    </Field>
  );
}

function withValue(options: readonly SelectOption[], value: string): readonly SelectOption[] {
  if (!value || options.some((option) => option.value === value)) return options;
  return [...options, { value, label: value.split(",").join(" + ") }];
}

function first(options: readonly SelectOption[], value: string): string {
  return options.some((option) => option.value === value) ? value : (options[0]?.value ?? "");
}

export function ClipMomentFields({
  copy,
  draft,
  limits,
  formatOptions,
  finderOptions,
  providerOptions,
  transcriptOptions,
  qualityOptions,
  whisperModels,
  engine,
  onWhisperChange,
  onMinInterestChange,
  className,
}: ClipMomentFieldsProps) {
  const whisperIndex = Math.max(0, whisperModels.indexOf(draft.whisper));
  return (
    <div data-slot="clip-moment-fields" className={cn("flex flex-col gap-6", className)}>
      <div>
        <CardTitle>{copy.momentsTitle}</CardTitle>
        <CardDescription>{copy.momentsDescription}</CardDescription>
      </div>
      <Section title="Clips" hint="How many clips and how long.">
        <Field>
          <FieldLabel htmlFor="clip-count">Count</FieldLabel>
          <Input
            id="clip-count"
            name="clips"
            type="number"
            defaultValue={draft.clips}
            min={1}
            max={limits.maxClips}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="clip-min-length">Min length (s)</FieldLabel>
          <Input
            id="clip-min-length"
            name="min_length"
            type="number"
            defaultValue={draft.minLength}
            min={limits.minLengthSeconds}
            max={limits.maxLengthSeconds}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="clip-max-length">Max length (s)</FieldLabel>
          <Input
            id="clip-max-length"
            name="max_length"
            type="number"
            defaultValue={draft.maxLength}
            min={limits.minLengthSeconds}
            max={limits.maxLengthSeconds}
          />
        </Field>
        <SliderField label="Minimum interest" value={draft.minInterest.toFixed(2)}>
          <input type="hidden" name="min_interest" value={draft.minInterest} />
          <Slider
            aria-label="Minimum interest"
            min={0}
            max={1}
            step={0.05}
            value={[draft.minInterest]}
            onValueChange={(values) => onMinInterestChange(values[0] ?? draft.minInterest)}
          />
        </SliderField>
      </Section>
      <Section title="Discovery" hint="Who picks the moments.">
        <SelectField
          id="clip-moment-finder"
          label="Moment finder"
          name="moment_finder"
          defaultValue={first(finderOptions, draft.momentFinder)}
          options={finderOptions}
        />
        {engine ?? (
          <>
            <SelectField
              id="clip-moment-provider"
              label="AI provider"
              name="moment_provider"
              defaultValue={first(providerOptions, draft.momentProvider)}
              options={providerOptions}
            />
            <Field>
              <FieldLabel htmlFor="clip-moment-model">AI model</FieldLabel>
              <Input
                id="clip-moment-model"
                name="moment_model"
                defaultValue={draft.momentModel}
                placeholder="e.g. deepseek/deepseek-chat"
              />
            </Field>
          </>
        )}
      </Section>
      <Section title="Transcript" hint="Where the words come from.">
        <SelectField
          id="clip-transcript"
          label="Source"
          name="transcript_source"
          defaultValue={first(transcriptOptions, draft.transcript)}
          options={transcriptOptions}
        />
        <Field>
          <FieldLabel htmlFor="clip-language">Language</FieldLabel>
          <Input
            id="clip-language"
            name="language"
            defaultValue={draft.language}
            placeholder="Auto-detect (en, it, hi...)"
          />
        </Field>
        <SliderField label="Whisper model" value={draft.whisper}>
          <input type="hidden" name="whisper_model" value={draft.whisper} />
          <Slider
            aria-label="Whisper model"
            min={0}
            max={Math.max(0, whisperModels.length - 1)}
            step={1}
            value={[whisperIndex]}
            onValueChange={(values) => onWhisperChange(whisperModels[values[0]] ?? draft.whisper)}
          />
        </SliderField>
      </Section>
      <Section title="Output" hint="Shape of the rendered files.">
        <SelectField
          id="clip-formats"
          label="Formats"
          name="formats"
          defaultValue={first(withValue(formatOptions, draft.formats), draft.formats)}
          options={withValue(formatOptions, draft.formats)}
        />
        <SelectField
          id="clip-quality"
          label="Quality"
          name="quality"
          defaultValue={first(qualityOptions, draft.quality)}
          options={qualityOptions}
        />
        <Field orientation="horizontal" className="items-center self-end sm:h-9">
          <Checkbox id="clip-captions" name="captions" defaultChecked={draft.captions} />
          <FieldLabel htmlFor="clip-captions">Generate captions</FieldLabel>
        </Field>
      </Section>
    </div>
  );
}
