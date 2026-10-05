import type { ReactNode } from "react";

import { ClipMomentFields } from "@/components/clip/moment-fields";
import { ClipNavigation } from "@/components/clip/navigation";
import { ClipReview } from "@/components/clip/review";
import { ClipSourceFields } from "@/components/clip/source-fields";
import { ClipStepper } from "@/components/clip/stepper";
import {
  ClipCatalog,
  ClipSteps,
  type ClipCreateClassNames,
  type ClipCreateCopy,
  type ClipCreateSlots,
  type ClipDraft,
  type ClipLimits,
  type ClipSourceKind,
  type ClipStepSlug,
} from "@/components/clip/types";
import type { FormRenderProps, SelectOption } from "@/components/forms/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ClipCreateLayoutProps {
  step: ClipStepSlug;
  furthest: number;
  draft: ClipDraft;
  source: ClipSourceKind;
  limits: ClipLimits;
  blocker?: string;
  error?: string | null;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy?: Partial<ClipCreateCopy>;
  classNames?: ClipCreateClassNames;
  slots?: ClipCreateSlots;
  formatOptions?: readonly SelectOption[];
  finderOptions?: readonly SelectOption[];
  providerOptions?: readonly SelectOption[];
  transcriptOptions?: readonly SelectOption[];
  qualityOptions?: readonly SelectOption[];
  whisperModels?: readonly string[];
  renderForm?: (props: FormRenderProps) => ReactNode;
  onStepChange: (step: ClipStepSlug) => void;
  onSourceChange: (source: ClipSourceKind) => void;
  onWhisperChange: (value: string) => void;
  onMinInterestChange: (value: number) => void;
}

export function ClipCreateLayout({
  step,
  furthest,
  draft,
  source,
  limits,
  blocker,
  error,
  submitting,
  submitDisabled,
  copy: copyOverrides,
  classNames = {},
  slots = {},
  formatOptions = ClipCatalog.formats,
  finderOptions = ClipCatalog.finders,
  providerOptions = ClipCatalog.providers,
  transcriptOptions = ClipCatalog.transcripts,
  qualityOptions = ClipCatalog.qualities,
  whisperModels = ClipCatalog.whisperModels,
  renderForm,
  onStepChange,
  onSourceChange,
  onWhisperChange,
  onMinInterestChange,
}: ClipCreateLayoutProps) {
  const copy = { ...ClipCatalog.copy, ...copyOverrides };
  const sectionClassName = cn("flex flex-col gap-4", classNames.section);
  const formClassName = cn("flex flex-col gap-6", classNames.form);
  const content = (
    <>
      <input type="hidden" name="mode" value="analyze" />
      <fieldset inert={submitting} aria-busy={submitting} className="contents">
        <section
          data-slot="clip-source-step"
          className={cn(sectionClassName, step !== "source" && "hidden")}
        >
          {slots.source ?? (
            <ClipSourceFields
              source={source}
              url={draft.url}
              copy={copy}
              onSourceChange={onSourceChange}
              className={classNames.fields}
            />
          )}
          <ClipNavigation
            step="source"
            blocker={blocker}
            copy={copy}
            onStepChange={onStepChange}
            className={classNames.navigation}
          />
        </section>
        <section
          data-slot="clip-moments-step"
          className={cn(sectionClassName, step !== "find-moments" && "hidden")}
        >
          {slots.moments ?? (
            <ClipMomentFields
              copy={copy}
              draft={draft}
              limits={limits}
              formatOptions={formatOptions}
              finderOptions={finderOptions}
              providerOptions={providerOptions}
              transcriptOptions={transcriptOptions}
              qualityOptions={qualityOptions}
              whisperModels={whisperModels}
              engine={slots.engine}
              onWhisperChange={onWhisperChange}
              onMinInterestChange={onMinInterestChange}
              className={classNames.fields}
            />
          )}
          <ClipNavigation
            step="find-moments"
            blocker={blocker}
            copy={copy}
            onStepChange={onStepChange}
            className={classNames.navigation}
          />
        </section>
        <section
          data-slot="clip-review-step"
          className={cn(sectionClassName, step !== "generate" && "hidden")}
        >
          {slots.review ?? (
            <ClipReview
              copy={copy}
              draft={draft}
              source={source}
              summary={slots.summary}
              estimate={slots.estimate}
              summaryClassName={classNames.summary}
            />
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <ClipNavigation
            step="generate"
            blocker={submitDisabled ? "" : blocker}
            submitting={submitting}
            submitDisabled={submitDisabled}
            copy={copy}
            onStepChange={onStepChange}
            className={classNames.navigation}
          />
        </section>
      </fieldset>
    </>
  );

  return (
    <div data-slot="clip-create-layout" className={cn("w-full", classNames.root)}>
      <Card className={cn("gap-0 py-0", classNames.card)}>
        <CardHeader className="border-b py-4">
          <ClipStepper
            current={ClipSteps.index(step)}
            furthest={furthest}
            onPick={onStepChange}
            className={classNames.stepper}
          />
        </CardHeader>
        <CardContent className="py-5">
          {slots.before}
          {renderForm ? (
            renderForm({ children: content, className: formClassName })
          ) : (
            <form method="post" encType="multipart/form-data" className={formClassName}>
              {content}
            </form>
          )}
          {slots.after}
        </CardContent>
      </Card>
    </div>
  );
}
