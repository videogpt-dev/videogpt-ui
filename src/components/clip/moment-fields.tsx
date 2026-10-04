import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { ClipCreateCopy, ClipDefaults, ClipLimits, ClipSelectOption } from "./types";

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: ClipSelectOption[];
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <FieldSet className="gap-3 border-t border-border pt-5">
      <FieldLegend variant="label" className="text-xs tracking-wide text-muted-foreground uppercase">
        {title}
      </FieldLegend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </FieldSet>
  );
}

function SliderField({ label, value, children }: { label: string; value: string; children: ReactNode }) {
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

function formatsToOption(formats: string[] | undefined, options: ClipSelectOption[]): string {
  const joined = (formats ?? []).join(",");
  return options.some((option) => option.value === joined) ? joined : (options[0]?.value ?? "9:16");
}

export interface ClipMomentFieldsProps {
  copy: ClipCreateCopy;
  defaults?: ClipDefaults | null;
  limits: ClipLimits;
  whisper: string;
  minInterest: number;
  formatOptions: ClipSelectOption[];
  finderOptions: ClipSelectOption[];
  providerOptions: ClipSelectOption[];
  momentFinder: string;
  momentProvider: string;
  momentModel: string;
  engine?: ReactNode;
  transcriptOptions: ClipSelectOption[];
  whisperModels: string[];
  onWhisperChange: (value: string) => void;
  onMinInterestChange: (value: number) => void;
  className?: string;
}

export function ClipMomentFields({
  copy,
  defaults,
  limits,
  whisper,
  minInterest,
  formatOptions,
  finderOptions,
  providerOptions,
  momentFinder,
  momentProvider,
  momentModel,
  engine,
  transcriptOptions,
  whisperModels,
  onWhisperChange,
  onMinInterestChange,
  className,
}: ClipMomentFieldsProps) {
  const whisperIndex = Math.max(0, whisperModels.indexOf(whisper));
  return (
    <div data-slot="clip-moment-fields" className={cn("flex flex-col gap-6", className)}>
      <div>
        <CardTitle>{copy.momentsTitle}</CardTitle>
        <CardDescription>{copy.momentsDescription}</CardDescription>
      </div>
      <Section title="Clips">
        <Field>
          <FieldLabel htmlFor="clip-count">Count</FieldLabel>
          <Input
            id="clip-count"
            name="clips"
            type="number"
            defaultValue={defaults?.count ?? 10}
            min={1}
            max={limits.maxClips}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="clip-min-length">Min length (s)</FieldLabel>
            <Input
              id="clip-min-length"
              name="min_length"
              type="number"
              defaultValue={defaults?.min_length ?? 20}
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
              defaultValue={defaults?.max_length ?? 60}
              min={limits.minLengthSeconds}
              max={limits.maxLengthSeconds}
            />
          </Field>
        </div>
        <SliderField label="Minimum interest" value={minInterest.toFixed(2)}>
          <input type="hidden" name="min_interest" value={minInterest} />
          <Slider
            aria-label="Minimum interest"
            min={0}
            max={1}
            step={0.05}
            value={[minInterest]}
            onValueChange={(values) => onMinInterestChange(values[0] ?? minInterest)}
          />
        </SliderField>
      </Section>
      <Section title="Discovery">
        <SelectField
          label="Moment finder"
          name="moment_finder"
          defaultValue={momentFinder || finderOptions[0]?.value || "offline"}
          options={finderOptions}
        />
        {engine ?? (
          <>
            <SelectField
              label="AI provider"
              name="moment_provider"
              defaultValue={momentProvider || providerOptions[0]?.value || ""}
              options={providerOptions}
            />
            <Field>
              <FieldLabel htmlFor="clip-moment-model">AI model</FieldLabel>
              <Input
                id="clip-moment-model"
                name="moment_model"
                defaultValue={momentModel}
                placeholder="e.g. deepseek/deepseek-chat"
              />
            </Field>
          </>
        )}
      </Section>
      <Section title="Transcript">
        <SelectField
          label="Source"
          name="transcript_source"
          defaultValue={transcriptOptions[0]?.value ?? "auto"}
          options={transcriptOptions}
        />
        <Field>
          <FieldLabel htmlFor="clip-language">Language</FieldLabel>
          <Input id="clip-language" name="language" placeholder="Auto-detect (en, it, hi...)" />
        </Field>
        <SliderField label="Whisper model" value={whisper}>
          <input type="hidden" name="whisper_model" value={whisper} />
          <Slider
            aria-label="Whisper model"
            min={0}
            max={Math.max(0, whisperModels.length - 1)}
            step={1}
            value={[whisperIndex]}
            onValueChange={(values) => onWhisperChange(whisperModels[values[0]] ?? whisper)}
          />
        </SliderField>
      </Section>
      <Section title="Output">
        <SelectField
          label="Formats"
          name="formats"
          defaultValue={formatsToOption(defaults?.formats, formatOptions)}
          options={formatOptions}
        />
        <SelectField
          label="Quality"
          name="quality"
          defaultValue={defaults?.quality ?? "high"}
          options={[
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
        />
        <Field orientation="horizontal" className="items-center sm:col-span-2">
          <Checkbox
            id="clip-captions"
            name="captions"
            defaultChecked={defaults?.captions ?? true}
          />
          <FieldLabel htmlFor="clip-captions">Generate captions</FieldLabel>
        </Field>
      </Section>
    </div>
  );
}
