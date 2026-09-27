import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
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
  transcriptOptions,
  whisperModels,
  onWhisperChange,
  onMinInterestChange,
  className,
}: ClipMomentFieldsProps) {
  const whisperIndex = Math.max(0, whisperModels.indexOf(whisper));
  return (
    <div data-slot="clip-moment-fields" className={cn("flex flex-col gap-4", className)}>
      <div>
        <CardTitle>{copy.momentsTitle}</CardTitle>
        <CardDescription>{copy.momentsDescription}</CardDescription>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="clip-count">Clips / moments</FieldLabel>
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
        <SelectField
          label="Moment finder"
          name="moment_finder"
          defaultValue={momentFinder || finderOptions[0]?.value || "offline"}
          options={finderOptions}
        />
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
          <FieldDescription>The provider&apos;s own model id, used only when the finder is AI.</FieldDescription>
        </Field>
        <SelectField
          label="Transcript"
          name="transcript_source"
          defaultValue={transcriptOptions[0]?.value ?? "auto"}
          options={transcriptOptions}
        />
        <Field>
          <FieldLabel htmlFor="clip-language">Language</FieldLabel>
          <Input id="clip-language" name="language" placeholder="auto-detect" />
          <FieldDescription>Optional ISO code, for example en, it, or hi.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Whisper model</FieldLabel>
          <input type="hidden" name="whisper_model" value={whisper} />
          <Slider
            aria-label="Whisper model"
            min={0}
            max={Math.max(0, whisperModels.length - 1)}
            step={1}
            value={[whisperIndex]}
            onValueChange={(values) => onWhisperChange(whisperModels[values[0]] ?? whisper)}
          />
          <FieldDescription>{whisper}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Minimum interest</FieldLabel>
          <input type="hidden" name="min_interest" value={minInterest} />
          <Slider
            aria-label="Minimum interest"
            min={0}
            max={1}
            step={0.05}
            value={[minInterest]}
            onValueChange={(values) => onMinInterestChange(values[0] ?? minInterest)}
          />
          <FieldDescription>{minInterest.toFixed(2)}</FieldDescription>
        </Field>
        <Field orientation="horizontal" className="items-center self-end">
          <Checkbox
            id="clip-captions"
            name="captions"
            defaultChecked={defaults?.captions ?? true}
          />
          <FieldLabel htmlFor="clip-captions">Generate captions</FieldLabel>
        </Field>
      </div>
    </div>
  );
}
