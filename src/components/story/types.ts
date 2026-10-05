import type { ReactNode } from "react";

import type { RenderEngine } from "@/lib/media-options";

export class StorySteps {
  static readonly all = [
    { kind: "story", label: "Story", optional: false },
    { kind: "characters", label: "Characters", optional: true },
    { kind: "scenes", label: "Scenes", optional: false },
    { kind: "music", label: "Music", optional: true },
    { kind: "assemble", label: "Assemble", optional: false },
    { kind: "publish", label: "Publish", optional: false },
  ] as const;
}

export type StoryStepKind = (typeof StorySteps.all)[number]["kind"];
export type StoryStepStatus = "done" | "active" | "busy" | "pending" | "error" | "locked";

export interface StoryStepMeta {
  kind: StoryStepKind;
  label: string;
  optional?: boolean;
}

export interface StoryScene {
  prompt: string;
  narration: string;
  motion?: boolean;
  image?: string | null;
  video?: string | null;
  audio?: string | null;
}

export interface StoryDraft {
  title: string;
  description: string;
  sceneCount: number;
  language: string;
  aspectRatio: string;
  genre: string;
  engine: RenderEngine;
  agentId: string;
  mature: boolean;
  enhance: boolean;
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
  enhanceLabel: string;
  agentLabel: string;
  submit: string;
  submitting: string;
}

export interface StoryCreateClassNames {
  root?: string;
  card?: string;
  form?: string;
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

export class StoryCatalog {
  static readonly copy: StoryCreateCopy = {
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
    enhanceLabel: "Enhance prompts before generating",
    agentLabel: "Screenwriter",
    submit: "Write story",
    submitting: "Writing...",
  };
}
