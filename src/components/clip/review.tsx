import type { ReactNode } from "react";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClipCreateCopy, ClipDraft, ClipSourceKind } from "./types";

export interface ClipReviewProps {
  copy: ClipCreateCopy;
  draft: ClipDraft;
  source: ClipSourceKind;
  summary?: ReactNode;
  estimate?: ReactNode;
  className?: string;
  summaryClassName?: string;
}

function ClipSummary({
  draft,
  source,
  className,
}: {
  draft: ClipDraft;
  source: ClipSourceKind;
  className?: string;
}) {
  const rows: Array<[string, string]> = [
    ["Source", source === "url" ? draft.url || "Not set" : "Uploaded file"],
    ["Clips", String(draft.clips)],
    ["Length", `${draft.minLength}-${draft.maxLength}s`],
    ["Formats", draft.formats],
    ["Transcription", draft.whisper || "default"],
    ["Minimum interest", draft.minInterest.toFixed(2)],
    ["Captions", draft.captions ? "On" : "Off"],
  ];
  return (
    <dl
      data-slot="clip-summary"
      className={cn(
        "grid gap-x-4 gap-y-2 rounded-lg border border-border bg-muted/50 p-3 sm:grid-cols-2",
        className,
      )}
    >
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-3 text-xs">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0 truncate font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ClipReview({
  copy,
  draft,
  source,
  summary,
  estimate,
  className,
  summaryClassName,
}: ClipReviewProps) {
  return (
    <div data-slot="clip-review" className={cn("flex flex-col gap-4", className)}>
      <div>
        <CardTitle>{copy.reviewTitle}</CardTitle>
        <CardDescription>{copy.reviewDescription}</CardDescription>
      </div>
      {summary ?? <ClipSummary draft={draft} source={source} className={summaryClassName} />}
      {estimate}
    </div>
  );
}
