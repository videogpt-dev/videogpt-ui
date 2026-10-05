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
import type { StoryCreateCopy, StoryDraft } from "./types";

export interface StoryBriefFieldsProps {
  draft: StoryDraft;
  copy: StoryCreateCopy;
  aspectOptions?: readonly SelectOption[];
  engineOptions?: readonly SelectOption[];
  languageOptions?: readonly SelectOption[];
  genreOptions?: readonly SelectOption[];
  titleAction?: ReactNode;
  descriptionAction?: ReactNode;
  referenceSlot?: ReactNode;
  agentSlot?: ReactNode;
  extraFieldsSlot?: ReactNode;
  minScenes?: number;
  maxScenes?: number;
  onChange: (patch: Partial<StoryDraft>) => void;
  className?: string;
}

export function StoryBriefFields({
  draft,
  copy,
  aspectOptions = MediaOptions.aspects,
  engineOptions = MediaOptions.engines,
  languageOptions = MediaOptions.languages,
  genreOptions,
  titleAction,
  descriptionAction,
  referenceSlot,
  agentSlot,
  extraFieldsSlot,
  minScenes = 1,
  maxScenes = 20,
  onChange,
  className,
}: StoryBriefFieldsProps) {
  return (
    <div data-slot="story-brief-fields" className={cn("flex flex-col gap-4", className)}>
      <div>
        <CardTitle>{copy.briefTitle}</CardTitle>
        <CardDescription>{copy.briefDescription}</CardDescription>
      </div>

      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="story-title">{copy.titleLabel}</FieldLabel>
          {titleAction}
        </div>
        <Input
          id="story-title"
          name="title"
          value={draft.title}
          placeholder={copy.titlePlaceholder}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </Field>

      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="story-description">{copy.descriptionLabel}</FieldLabel>
          {descriptionAction}
        </div>
        <Textarea
          id="story-description"
          name="description"
          rows={3}
          value={draft.description}
          placeholder={copy.descriptionPlaceholder}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </Field>

      {referenceSlot}

      {agentSlot ? (
        <Field>
          <FieldLabel>{copy.agentLabel}</FieldLabel>
          {agentSlot}
        </Field>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="story-scene-count">{copy.sceneCountLabel}</FieldLabel>
          <Input
            id="story-scene-count"
            name="scene_count"
            type="number"
            min={minScenes}
            max={maxScenes}
            value={draft.sceneCount}
            onChange={(event) => onChange({ sceneCount: Number(event.target.value) || minScenes })}
          />
        </Field>

        <SelectField
          id="story-language"
          name="language"
          label={copy.languageLabel}
          value={draft.language}
          options={languageOptions}
          onValueChange={(language) => onChange({ language })}
        />

        <SelectField
          id="story-aspect"
          name="aspect_ratio"
          label={copy.aspectLabel}
          value={draft.aspectRatio}
          options={aspectOptions}
          onValueChange={(aspectRatio) => onChange({ aspectRatio })}
        />

        <SelectField
          id="story-engine"
          name="engine"
          label={copy.engineLabel}
          value={draft.engine}
          options={engineOptions}
          onValueChange={(engine) => onChange({ engine: engine as RenderEngine })}
        />
      </div>

      {genreOptions ? (
        <SelectField
          id="story-genre"
          name="genre"
          label={copy.genreLabel}
          value={draft.genre}
          options={genreOptions}
          onValueChange={(genre) => onChange({ genre })}
        />
      ) : (
        <Field>
          <FieldLabel htmlFor="story-genre">{copy.genreLabel}</FieldLabel>
          <Input
            id="story-genre"
            name="genre"
            value={draft.genre}
            placeholder={copy.genrePlaceholder}
            onChange={(event) => onChange({ genre: event.target.value })}
          />
        </Field>
      )}

      {extraFieldsSlot}

      <label className="flex items-center gap-3 text-sm" htmlFor="story-mature">
        <Switch
          id="story-mature"
          checked={draft.mature}
          onCheckedChange={(mature) => onChange({ mature })}
        />
        {copy.matureLabel}
        {draft.mature ? <input type="hidden" name="mature" value="on" /> : null}
      </label>

      <label className="flex items-center gap-3 text-sm" htmlFor="story-enhance">
        <Switch
          id="story-enhance"
          checked={draft.enhance}
          onCheckedChange={(enhance) => onChange({ enhance })}
        />
        {copy.enhanceLabel}
        {draft.enhance ? <input type="hidden" name="enhance" value="on" /> : null}
      </label>
    </div>
  );
}
