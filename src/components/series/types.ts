import type { ReactNode } from "react";

import type { SelectOption } from "@/components/forms/types";
import type { RenderEngine } from "@/lib/media-options";

export interface SeriesCharacter {
  id: string;
  name: string;
  look: string;
  personality: string;
  images: string[];
  referenceImage?: string | null;
}

export interface SeriesDraft {
  name: string;
  premise: string;
  style: string;
  engine: RenderEngine;
  aspectRatio: string;
  language: string;
  resolution: number;
  mature: boolean;
}

export type SeriesEpisodeStatus = "draft" | "queued" | "generating" | "ready" | "failed";

export interface SeriesEpisode {
  id: string;
  title: string;
  description?: string;
  status: SeriesEpisodeStatus;
  thumbnail?: string | null;
}

export interface EpisodeIdea {
  title: string;
  description: string;
}

export interface SeriesSummary extends SeriesDraft {
  id: string;
  episodeCount: number;
  poster?: string | null;
}

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

type EpisodeBadge = "default" | "secondary" | "destructive" | "outline";

export class SeriesCatalog {
  static readonly copy: SeriesCreateCopy = {
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

  static readonly showrunnerCopy: ShowrunnerCopy = {
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

  static readonly resolutions: readonly SelectOption[] = [
    { value: "320", label: "320p (Draft)" },
    { value: "720", label: "720p (HD)" },
    { value: "1080", label: "1080p (Full HD)" },
  ];

  static readonly episodeStatus: Record<
    SeriesEpisodeStatus,
    { label: string; variant: EpisodeBadge }
  > = {
    draft: { label: "Draft", variant: "outline" },
    queued: { label: "Queued", variant: "secondary" },
    generating: { label: "Generating", variant: "secondary" },
    ready: { label: "Ready", variant: "default" },
    failed: { label: "Failed", variant: "destructive" },
  };
}
