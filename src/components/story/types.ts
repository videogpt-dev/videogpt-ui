import type { ReactNode } from "react";

/** The story engine's fixed workflow. Every scene lives inside the single "Scenes"
 *  step (its own accordion/stepper) so the bar stays short however many scenes exist. */
export const STORY_STEPS = [
  { kind: "story", label: "Story", optional: false },
  { kind: "characters", label: "Characters", optional: true },
  { kind: "scenes", label: "Scenes", optional: false },
  { kind: "music", label: "Music", optional: true },
  { kind: "assemble", label: "Assemble", optional: false },
  { kind: "publish", label: "Publish", optional: false },
] as const;

export type StoryStepKind = (typeof STORY_STEPS)[number]["kind"];
export type StoryStepStatus = "done" | "active" | "busy" | "pending" | "error" | "locked";

/** Render engine: "storyboard" (stills over narration) or "video" (AI motion clips). */
export type StoryEngine = "storyboard" | "video";

export interface StoryStepMeta {
  kind: StoryStepKind;
  label: string;
  optional?: boolean;
}

export function storyStepIndex(kind?: string): number {
  const index = STORY_STEPS.findIndex((step) => step.kind === kind);
  return index < 0 ? 0 : index;
}

export interface StoryCharacter {
  name: string;
  description: string;
}

export interface StoryScene {
  prompt: string;
  narration: string;
  motion?: boolean;
  /** Generated media, when present. Relative paths the consumer resolves to URLs. */
  image?: string | null;
  video?: string | null;
  audio?: string | null;
}

export interface StoryPlan {
  logline: string;
  style: string;
  characters: StoryCharacter[];
  scenes: StoryScene[];
}

/** The create brief: everything the writer needs before the first stage runs. */
export interface StoryDraft {
  title: string;
  description: string;
  sceneCount: number;
  language: string;
  aspectRatio: string;
  genre: string;
  engine: StoryEngine;
  agentId: string;
  mature: boolean;
}

export interface StorySelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface StoryCreateCopy {
  briefTitle: string;
  briefDescription: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  sceneCountLabel: string;
  languageLabel: string;
  aspectLabel: string;
  engineLabel: string;
  genreLabel: string;
  genrePlaceholder: string;
  matureLabel: string;
  agentLabel: string;
  submit: string;
  submitting: string;
}

export interface StoryCreateClassNames {
  root?: string;
  card?: string;
  form?: string;
  section?: string;
  fields?: string;
  navigation?: string;
}

export interface StoryCreateSlots {
  before?: ReactNode;
  after?: ReactNode;
  titleAction?: ReactNode;
  descriptionAction?: ReactNode;
  reference?: ReactNode;
  agent?: ReactNode;
  extraFields?: ReactNode;
  estimate?: ReactNode;
}

export interface StoryFormRenderProps {
  children: ReactNode;
  className: string;
}

export const DEFAULT_STORY_COPY: StoryCreateCopy = {
  briefTitle: "Write a story",
  briefDescription: "Give a title and direction. The screenwriter drafts the scenes.",
  titleLabel: "Title",
  titlePlaceholder: "The lighthouse keeper's last night",
  descriptionLabel: "Direction (optional)",
  descriptionPlaceholder: "Tone, characters, what should happen...",
  sceneCountLabel: "Scenes",
  languageLabel: "Narration language",
  aspectLabel: "Aspect ratio",
  engineLabel: "Render",
  genreLabel: "Genre (optional)",
  genrePlaceholder: "Thriller, documentary...",
  matureLabel: "Mature audience",
  agentLabel: "Screenwriter",
  submit: "Write story",
  submitting: "Writing...",
};

export const DEFAULT_STORY_ASPECTS: StorySelectOption[] = [
  { value: "9:16", label: "9:16 (Short-form)" },
  { value: "16:9", label: "16:9 (Landscape)" },
];

export const DEFAULT_STORY_ENGINES: StorySelectOption[] = [
  { value: "storyboard", label: "Storyboard (stills)" },
  { value: "video", label: "Video (AI motion)" },
];

export const DEFAULT_STORY_LANGUAGES: StorySelectOption[] = [
  { value: "", label: "Auto (match the title)" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "pa", label: "Punjabi" },
  { value: "it", label: "Italian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
];
