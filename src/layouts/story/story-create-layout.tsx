import type { ReactNode } from "react";

import type { FormRenderProps, SelectOption } from "@/components/forms/types";
import { StoryBriefFields } from "@/components/story/story-fields";
import {
  StoryCatalog,
  type StoryCreateClassNames,
  type StoryCreateCopy,
  type StoryCreateSlots,
  type StoryDraft,
} from "@/components/story/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StoryCreateLayoutProps {
  draft: StoryDraft;
  error?: string | null;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy?: Partial<StoryCreateCopy>;
  classNames?: StoryCreateClassNames;
  slots?: StoryCreateSlots;
  aspectOptions?: readonly SelectOption[];
  engineOptions?: readonly SelectOption[];
  languageOptions?: readonly SelectOption[];
  genreOptions?: readonly SelectOption[];
  minScenes?: number;
  maxScenes?: number;
  renderForm?: (props: FormRenderProps) => ReactNode;
  onChange: (patch: Partial<StoryDraft>) => void;
}

export function StoryCreateLayout({
  draft,
  error,
  submitting,
  submitDisabled,
  copy: copyOverrides,
  classNames = {},
  slots = {},
  aspectOptions,
  engineOptions,
  languageOptions,
  genreOptions,
  minScenes,
  maxScenes,
  renderForm,
  onChange,
}: StoryCreateLayoutProps) {
  const copy = { ...StoryCatalog.copy, ...copyOverrides };
  const content = (
    <fieldset inert={submitting} aria-busy={submitting} className="contents">
      <StoryBriefFields
        draft={draft}
        copy={copy}
        aspectOptions={aspectOptions}
        engineOptions={engineOptions}
        languageOptions={languageOptions}
        genreOptions={genreOptions}
        titleAction={slots.titleAction}
        descriptionAction={slots.descriptionAction}
        referenceSlot={slots.reference}
        agentSlot={slots.agent}
        extraFieldsSlot={slots.extraFields}
        minScenes={minScenes}
        maxScenes={maxScenes}
        onChange={onChange}
        className={classNames.fields}
      />
      {slots.estimate}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className={cn("flex justify-end", classNames.navigation)}>
        <Button type="submit" disabled={submitting || submitDisabled}>
          {submitting ? copy.submitting : copy.submit}
        </Button>
      </div>
    </fieldset>
  );
  const formClassName = cn("flex flex-col gap-6", classNames.form);

  return (
    <div
      data-slot="story-create-layout"
      className={cn("mx-auto w-full min-w-0 max-w-4xl", classNames.root)}
    >
      <Card className={cn("py-0", classNames.card)}>
        <CardContent className="p-4">
          {slots.before}
          {renderForm ? (
            renderForm({ children: content, className: formClassName })
          ) : (
            <form method="post" className={formClassName}>
              {content}
            </form>
          )}
          {slots.after}
        </CardContent>
      </Card>
    </div>
  );
}
