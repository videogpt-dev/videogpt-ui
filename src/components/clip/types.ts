import type { ReactNode } from "react";

export const CLIP_STEPS = [
  { slug: "source", label: "Source" },
  { slug: "find-moments", label: "Find moments" },
  { slug: "generate", label: "Generate" },
] as const;

export type ClipStepSlug = (typeof CLIP_STEPS)[number]["slug"];
export type ClipSourceKind = "url" | "file";

export function clipStepIndex(slug?: string): number {
  const index = CLIP_STEPS.findIndex((step) => step.slug === slug);
  return index < 0 ? 0 : index;
}

export interface ClipDraft {
  url: string;
  hasFile: boolean;
  clips: number;
  minLength: number;
  maxLength: number;
  formats: string;
  whisper: string;
  minInterest: number;
  captions: boolean;
  momentFinder: string;
  momentProvider: string;
  momentModel: string;
}

export interface ClipDefaults {
  count?: number;
  min_length?: number;
  max_length?: number;
  formats?: string[];
  quality?: string;
  captions?: boolean;
}

export interface ClipLimits {
  maxClips: number;
  minLengthSeconds: number;
  maxLengthSeconds: number;
  whisperModel: string;
  minInterest: number;
}

export interface ClipSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
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
  /** Sticky side panel beside the wizard card on wide screens. */
  aside?: ReactNode;
  after?: ReactNode;
  /** Replaces the AI provider select and model input with the host's own engine picker,
   *  which must post `moment_provider` and `moment_model`. */
  engine?: ReactNode;
}

export interface ClipFormRenderProps {
  children: ReactNode;
  className: string;
}

export const DEFAULT_CLIP_COPY: ClipCreateCopy = {
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

export const DEFAULT_CLIP_FORMATS: ClipSelectOption[] = [
  { value: "9:16", label: "9:16 (Shorts)" },
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "9:16,16:9", label: "9:16 + 16:9" },
  { value: "1:1", label: "1:1 (Square)" },
];

export const DEFAULT_CLIP_FINDERS: ClipSelectOption[] = [
  { value: "auto", label: "Auto (AI when a model is set)" },
  { value: "ai", label: "AI (reads the transcript)" },
  { value: "offline", label: "Offline (on device)" },
];

export const DEFAULT_CLIP_PROVIDERS: ClipSelectOption[] = [
  { value: "", label: "No AI provider available", disabled: true },
];

export const DEFAULT_CLIP_TRANSCRIPTS: ClipSelectOption[] = [
  { value: "auto", label: "Auto (source captions, else Whisper)" },
  { value: "whisper", label: "Force Whisper" },
];

export const DEFAULT_WHISPER_MODELS = ["tiny", "base", "small", "medium", "large"];
