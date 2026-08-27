import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SeriesBriefFields } from "@/components/series/series-fields";
import {
  DEFAULT_SERIES_COPY,
  type SeriesCreateClassNames,
  type SeriesCreateCopy,
  type SeriesCreateSlots,
  type SeriesDraft,
  type SeriesFormRenderProps,
  type SeriesSelectOption,
} from "@/components/series/types";
import { cn } from "@/lib/utils";

export interface SeriesCreateLayoutProps {
  draft: SeriesDraft;
  error?: string | null;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy?: Partial<SeriesCreateCopy>;
  classNames?: SeriesCreateClassNames;
  slots?: SeriesCreateSlots;
  aspectOptions?: SeriesSelectOption[];
  engineOptions?: SeriesSelectOption[];
  languageOptions?: SeriesSelectOption[];
  resolutionOptions?: SeriesSelectOption[];
  renderForm?: (props: SeriesFormRenderProps) => ReactNode;
  onChange: (patch: Partial<SeriesDraft>) => void;
}

export function SeriesCreateLayout({
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
  resolutionOptions,
  renderForm,
  onChange,
}: SeriesCreateLayoutProps) {
  const copy = { ...DEFAULT_SERIES_COPY, ...copyOverrides };
  const content = (
    <fieldset disabled={submitting} className="contents">
      <SeriesBriefFields
        draft={draft}
        copy={copy}
        aspectOptions={aspectOptions}
        engineOptions={engineOptions}
        languageOptions={languageOptions}
        resolutionOptions={resolutionOptions}
        nameAction={slots.nameAction}
        premiseAction={slots.premiseAction}
        extraFieldsSlot={slots.extraFields}
        onChange={onChange}
        className={classNames.fields}
      />
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
      data-slot="series-create-layout"
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
