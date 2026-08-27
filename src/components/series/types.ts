import type { ReactNode } from "react";

/** Badge tones the episode-status meta maps onto (subset of the Badge variants). */
export type SeriesBadgeVariant = "default" | "secondary" | "destructive" | "outline";

/** Render engine shared with Story: "storyboard" (stills) or "video" (AI motion clips). */
export type SeriesEngine = "storyboard" | "video";

/** A recurring cast member: a reusable Look plus Personality, shared across every Episode. */
export interface SeriesCharacter {
  id: string;
  name: string;
  look: string;
  personality: string;
  /** Portrait paths the consumer resolves to URLs; one is the active reference. */
  images: string[];
  referenceImage?: string | null;
}

/** The create brief: the premise, look, and defaults every episode inherits. */
export interface SeriesDraft {
  name: string;
  premise: string;
  style: string;
  engine: SeriesEngine;
  aspectRatio: string;
  language: string;
  resolution: number;
  mature: boolean;
}

export type SeriesEpisodeStatus = "draft" | "queued" | "generating" | "ready" | "failed";

/** One episode: an ordinary story project made from the series. */
export interface SeriesEpisode {
  id: string;
  title: string;
  description?: string;
  status: SeriesEpisodeStatus;
  /** Poster path the consumer resolves to a URL. */
  thumbnail?: string | null;
}

/** A showrunner-proposed episode idea, awaiting the user's approval. */
export interface EpisodeIdea {
  title: string;
  description: string;
}

/** Library-row shape: a series plus its episode count. */
export interface SeriesSummary extends SeriesDraft {
  id: string;
  episodeCount: number;
  /** Poster path (first cast portrait) the consumer resolves to a URL. */
  poster?: string | null;
}

export interface SeriesSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const SERIES_EPISODE_STATUS_META: Record<
  SeriesEpisodeStatus,
  { label: string; variant: SeriesBadgeVariant }
> = {
  draft: { label: "Draft", variant: "outline" },
  queued: { label: "Queued", variant: "secondary" },
  generating: { label: "Generating", variant: "secondary" },
  ready: { label: "Ready", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
};

export interface SeriesCreateCopy {
  briefTitle: string;
  briefDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  premiseLabel: string;
  premisePlaceholder: string;
  styleLabel: string;
  stylePlaceholder: string;
  engineLabel: string;
  aspectLabel: string;
  languageLabel: string;
  resolutionLabel: string;
  matureLabel: string;
  submit: string;
  submitting: string;
}

export interface SeriesCreateClassNames {
  root?: string;
  card?: string;
  form?: string;
  fields?: string;
  navigation?: string;
}

export interface SeriesCreateSlots {
  before?: ReactNode;
  after?: ReactNode;
  nameAction?: ReactNode;
  premiseAction?: ReactNode;
  extraFields?: ReactNode;
}

export interface SeriesFormRenderProps {
  children: ReactNode;
  className: string;
}

export interface ShowrunnerCopy {
  title: string;
  description: string;
  countLabel: string;
  plan: string;
  planning: string;
  createSelected: string;
  creating: string;
  empty: string;
  selectAll: string;
  clear: string;
}

export const DEFAULT_SERIES_COPY: SeriesCreateCopy = {
  briefTitle: "Create a series",
  briefDescription: "Set the premise and look once. Every episode inherits them.",
  nameLabel: "Series name",
  namePlaceholder: "The lighthouse detective",
  premiseLabel: "Premise",
  premisePlaceholder: "What the show is about, its world, and its recurring tension...",
  styleLabel: "Visual style (optional)",
  stylePlaceholder: "Hand-painted noir, muted teal and amber...",
  engineLabel: "Render",
  aspectLabel: "Aspect ratio",
  languageLabel: "Narration language",
  resolutionLabel: "Resolution",
  matureLabel: "Mature audience",
  submit: "Create series",
  submitting: "Creating...",
};

export const DEFAULT_SHOWRUNNER_COPY: ShowrunnerCopy = {
  title: "Showrunner",
  description: "Propose connected episode ideas from the premise, then create the ones you like.",
  countLabel: "Episodes to plan",
  plan: "Plan episodes",
  planning: "Planning...",
  createSelected: "Create selected",
  creating: "Creating...",
  empty: "No ideas yet. Plan a batch to get started.",
  selectAll: "Select all",
  clear: "Clear",
};

export const DEFAULT_SERIES_ASPECTS: SeriesSelectOption[] = [
  { value: "9:16", label: "9:16 (Short-form)" },
  { value: "16:9", label: "16:9 (Landscape)" },
];

export const DEFAULT_SERIES_ENGINES: SeriesSelectOption[] = [
  { value: "storyboard", label: "Storyboard (stills)" },
  { value: "video", label: "Video (AI motion)" },
];

export const DEFAULT_SERIES_RESOLUTIONS: SeriesSelectOption[] = [
  { value: "320", label: "320p (Draft)" },
  { value: "720", label: "720p (HD)" },
  { value: "1080", label: "1080p (Full HD)" },
];

export const DEFAULT_SERIES_LANGUAGES: SeriesSelectOption[] = [
  { value: "", label: "Auto (match the name)" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "pa", label: "Punjabi" },
  { value: "it", label: "Italian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
];
