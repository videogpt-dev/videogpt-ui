import type { ReactNode } from "react";

import { SelectField } from "@/components/forms/option-select";
import type { SelectOption } from "@/components/forms/types";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MediaOptions, type RenderEngine } from "@/lib/media-options";
import { cn } from "@/lib/utils";
import { SeriesCatalog, type SeriesCreateCopy, type SeriesDraft } from "./types";

export interface SeriesBriefFieldsProps {
  draft: SeriesDraft;
  copy: SeriesCreateCopy;
  aspectOptions?: readonly SelectOption[];
  engineOptions?: readonly SelectOption[];
  languageOptions?: readonly SelectOption[];
  resolutionOptions?: readonly SelectOption[];
  nameAction?: ReactNode;
  premiseAction?: ReactNode;
  extraFieldsSlot?: ReactNode;
  onChange: (patch: Partial<SeriesDraft>) => void;
  className?: string;
}

export function SeriesBriefFields({
  draft,
  copy,
  aspectOptions = MediaOptions.aspects,
  engineOptions = MediaOptions.engines,
  languageOptions = MediaOptions.languages,
  resolutionOptions = SeriesCatalog.resolutions,
  nameAction,
  premiseAction,
  extraFieldsSlot,
  onChange,
  className,
}: SeriesBriefFieldsProps) {
  return (
    <div data-slot="series-brief-fields" className={cn("flex flex-col gap-4", className)}>
      <div>
        <CardTitle>{copy.briefTitle}</CardTitle>
        <CardDescription>{copy.briefDescription}</CardDescription>
      </div>

      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="series-name">{copy.nameLabel}</FieldLabel>
          {nameAction}
        </div>
        <Input
          id="series-name"
          name="name"
          value={draft.name}
          placeholder={copy.namePlaceholder}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field>

      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="series-premise">{copy.premiseLabel}</FieldLabel>
          {premiseAction}
        </div>
        <Textarea
          id="series-premise"
          name="premise"
          rows={3}
          value={draft.premise}
          placeholder={copy.premisePlaceholder}
          onChange={(event) => onChange({ premise: event.target.value })}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="series-style">{copy.styleLabel}</FieldLabel>
        <Input
          id="series-style"
          name="style"
          value={draft.style}
          placeholder={copy.stylePlaceholder}
          onChange={(event) => onChange({ style: event.target.value })}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="series-engine"
          name="engine"
          label={copy.engineLabel}
          value={draft.engine}
          options={engineOptions}
          onValueChange={(engine) => onChange({ engine: engine as RenderEngine })}
        />

        <SelectField
          id="series-aspect"
          name="aspect_ratio"
          label={copy.aspectLabel}
          value={draft.aspectRatio}
          options={aspectOptions}
          onValueChange={(aspectRatio) => onChange({ aspectRatio })}
        />

        <SelectField
          id="series-language"
          name="language"
          label={copy.languageLabel}
          value={draft.language}
          options={languageOptions}
          onValueChange={(language) => onChange({ language })}
        />

        <SelectField
          id="series-resolution"
          name="resolution"
          label={copy.resolutionLabel}
          value={String(draft.resolution)}
          options={resolutionOptions}
          onValueChange={(resolution) => onChange({ resolution: Number(resolution) || 720 })}
        />
      </div>

      {extraFieldsSlot}

      <label className="flex items-center gap-3 text-sm" htmlFor="series-mature">
        <Switch
          id="series-mature"
          checked={draft.mature}
          onCheckedChange={(mature) => onChange({ mature })}
        />
        {copy.matureLabel}
        {draft.mature ? <input type="hidden" name="mature" value="on" /> : null}
      </label>
    </div>
  );
}
