import type { ReactNode } from "react";

import type { SelectOption } from "@/components/forms/types";

export class ClipSteps {
  static readonly all = [
    { slug: "source", label: "Source" },
    { slug: "find-moments", label: "Find moments" },
    { slug: "generate", label: "Generate" },
  ] as const;

  static index(slug?: string): number {
    return Math.max(
      0,
      ClipSteps.all.findIndex((step) => step.slug === slug),
    );
  }
}

export type ClipStepSlug = (typeof ClipSteps.all)[number]["slug"];
export type ClipSourceKind = "url" | "file";

export interface ClipDraft {
  url: string;
  hasFile: boolean;
  clips: number;
  minLength: number;
  maxLength: number;
  formats: string;
  quality: string;
  whisper: string;
  minInterest: number;
  captions: boolean;
  momentFinder: string;
  momentProvider: string;
  momentModel: string;
  transcript: string;
  language: string;
}

export interface ClipLimits {
  maxClips: number;
  minLengthSeconds: number;
  maxLengthSeconds: number;
}

export interface ClipCreateCopy {
  sourceTitle: string;
  sourceDescription: string;
  urlSource: string;
  fileSource: string;
  urlLabel: string;
  urlPlaceholder: string;
  fileLabel: string;
  momentsTitle: string;
  momentsDescription: string;
  reviewTitle: string;
  reviewDescription: string;
  submit: string;
  submitting: string;
}

export interface ClipCreateClassNames {
  root?: string;
  card?: string;
  stepper?: string;
  form?: string;
  section?: string;
  fields?: string;
  navigation?: string;
  summary?: string;
}

export interface ClipCreateSlots {
  source?: ReactNode;
  moments?: ReactNode;
  review?: ReactNode;
  summary?: ReactNode;
  estimate?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
  engine?: ReactNode;
}

export class ClipCatalog {
  static readonly copy: ClipCreateCopy = {
    sourceTitle: "Bring a video",
    sourceDescription: "Paste a video URL or upload a file.",
    urlSource: "Video URL",
    fileSource: "Upload file",
    urlLabel: "Video URL",
    urlPlaceholder: "https://www.youtube.com/watch?v=...",
    fileLabel: "Video file",
    momentsTitle: "Find moments with AI",
    momentsDescription: "Choose discovery bounds. Fine-tune each clip later.",
    reviewTitle: "Review and find moments",
    reviewDescription: "Transcribe and score source first. Render selected clips afterwards.",
    submit: "Find moments",
    submitting: "Starting...",
  };

  static readonly formats: readonly SelectOption[] = [
    { value: "9:16", label: "9:16 (Shorts)" },
    { value: "16:9", label: "16:9 (Landscape)" },
    { value: "9:16,16:9", label: "9:16 + 16:9" },
    { value: "1:1", label: "1:1 (Square)" },
  ];

  static readonly qualities: readonly SelectOption[] = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  static readonly finders: readonly SelectOption[] = [
    { value: "auto", label: "Auto (AI when a model is set)" },
    { value: "ai", label: "AI (reads the transcript)" },
    { value: "offline", label: "Offline (on device)" },
  ];

  static readonly providers: readonly SelectOption[] = [
    { value: "", label: "No AI provider available", disabled: true },
  ];

  static readonly transcripts: readonly SelectOption[] = [
    { value: "auto", label: "Auto (source captions, else Whisper)" },
    { value: "whisper", label: "Force Whisper" },
  ];

  static readonly whisperModels: readonly string[] = ["tiny", "base", "small", "medium", "large"];
}
