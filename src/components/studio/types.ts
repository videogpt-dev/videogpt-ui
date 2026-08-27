import type { ComponentType, SVGProps } from "react";

export type SegmentStatus = "available" | "planned" | "disabled";
export type JobStatus = "idle" | "queued" | "running" | "completed" | "failed" | "cancelled";
export type UiIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface SegmentFeature {
  code_name: string;
  name: string;
  description: string;
  icon: string;
  status: SegmentStatus;
}

export interface SegmentDefinition {
  id: string;
  code_name: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  status: SegmentStatus;
  features: SegmentFeature[];
  definition_requirements?: SegmentDefinitionRequirement[];
  api_version?: string | null;
  execute_path?: string | null;
}

export interface SegmentDefinitionRequirement {
  type: "screenwriter" | "agent" | "preset" | "fragment";
  key: string;
  purpose: string;
  required: boolean;
}

export interface IconRegistry {
  [name: string]: UiIcon;
}
