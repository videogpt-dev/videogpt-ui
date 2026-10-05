import type { ReactNode } from "react";

import type { FormRenderProps, SelectOption } from "@/components/forms/types";
import { SeriesBriefFields } from "@/components/series/series-fields";
import {
  SeriesCatalog,
  type SeriesCreateClassNames,
  type SeriesCreateCopy,
  type SeriesCreateSlots,
  type SeriesDraft,
} from "@/components/series/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SeriesCreateLayoutProps {
  draft: SeriesDraft;
  error?: string | null;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy?: Partial<SeriesCreateCopy>;
  classNames?: SeriesCreateClassNames;
  slots?: SeriesCreateSlots;
  aspectOptions?: readonly SelectOption[];
  engineOptions?: readonly SelectOption[];
  languageOptions?: readonly SelectOption[];
  resolutionOptions?: readonly SelectOption[];
  renderForm?: (props: FormRenderProps) => ReactNode;
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
  const copy = { ...SeriesCatalog.copy, ...copyOverrides };
  const content = (
    <fieldset inert={submitting} aria-busy={submitting} className="contents">
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
