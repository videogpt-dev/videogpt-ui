import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipMomentFields } from "@/components/clip/moment-fields";
import { ClipNavigation } from "@/components/clip/navigation";
import { ClipReview } from "@/components/clip/review";
import { ClipSourceFields } from "@/components/clip/source-fields";
import { ClipStepper } from "@/components/clip/stepper";
import {
  DEFAULT_CLIP_COPY,
  DEFAULT_CLIP_FINDERS,
  DEFAULT_CLIP_FORMATS,
  DEFAULT_CLIP_PROVIDERS,
  DEFAULT_CLIP_TRANSCRIPTS,
  DEFAULT_WHISPER_MODELS,
  clipStepIndex,
  type ClipCreateClassNames,
  type ClipCreateCopy,
  type ClipCreateSlots,
  type ClipDefaults,
  type ClipDraft,
  type ClipFormRenderProps,
  type ClipLimits,
  type ClipSelectOption,
  type ClipSourceKind,
  type ClipStepSlug,
} from "@/components/clip/types";

export interface ClipCreateLayoutProps {
  step: ClipStepSlug;
  furthest: number;
  draft: ClipDraft;
  source: ClipSourceKind;
  defaults?: ClipDefaults | null;
  limits: ClipLimits;
  whisper: string;
  minInterest: number;
  blocker?: string;
  error?: string | null;
  submitting?: boolean;
  submitDisabled?: boolean;
  copy?: Partial<ClipCreateCopy>;
  classNames?: ClipCreateClassNames;
  slots?: ClipCreateSlots;
  formatOptions?: ClipSelectOption[];
  finderOptions?: ClipSelectOption[];
  providerOptions?: ClipSelectOption[];
  transcriptOptions?: ClipSelectOption[];
  whisperModels?: string[];
  renderForm?: (props: ClipFormRenderProps) => ReactNode;
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
  defaults,
  limits,
  whisper,
  minInterest,
  blocker,
  error,
  submitting,
  submitDisabled,
  copy: copyOverrides,
  classNames = {},
  slots = {},
  formatOptions = DEFAULT_CLIP_FORMATS,
  finderOptions = DEFAULT_CLIP_FINDERS,
  providerOptions = DEFAULT_CLIP_PROVIDERS,
  transcriptOptions = DEFAULT_CLIP_TRANSCRIPTS,
  whisperModels = DEFAULT_WHISPER_MODELS,
  renderForm,
  onStepChange,
  onSourceChange,
  onWhisperChange,
  onMinInterestChange,
}: ClipCreateLayoutProps) {
  const copy = { ...DEFAULT_CLIP_COPY, ...copyOverrides };
  const current = clipStepIndex(step);
  const sectionClassName = cn("flex flex-col gap-4", classNames.section);
  const content = (
    <>
      <input type="hidden" name="mode" value="analyze" />
      <fieldset disabled={submitting} className="contents">
        <section
          data-slot="clip-source-step"
          className={cn(sectionClassName, step !== "source" && "hidden")}
        >
          {slots.source ?? (
            <ClipSourceFields
              source={source}
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
              defaults={defaults}
              limits={limits}
              whisper={whisper}
              minInterest={minInterest}
              formatOptions={formatOptions}
              finderOptions={finderOptions}
              providerOptions={providerOptions}
              momentFinder={draft.momentFinder}
              momentProvider={draft.momentProvider}
              momentModel={draft.momentModel}
              engine={slots.engine}
              transcriptOptions={transcriptOptions}
              whisperModels={whisperModels}
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
  const formClassName = cn("flex flex-col gap-6", classNames.form);

  const card = (
    <Card className={cn("gap-0 py-0", classNames.card)}>
      <CardHeader className="border-b py-4">
        <ClipStepper
          current={current}
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
  );

  return (
    <div data-slot="clip-create-layout" className={cn("w-full", classNames.root)}>
      {card}
    </div>
  );
}
