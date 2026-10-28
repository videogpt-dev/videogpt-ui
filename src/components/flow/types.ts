export const FlowPortType = {
  Text: "text",
  Story: "story",
  Image: "image",
  Video: "video",
  Audio: "audio",
} as const;
export type FlowPortType = (typeof FlowPortType)[keyof typeof FlowPortType];

export const FlowNodeGroup = {
  Input: "input",
  Generate: "generate",
  Story: "story",
  Edit: "edit",
  Output: "output",
} as const;
export type FlowNodeGroup = (typeof FlowNodeGroup)[keyof typeof FlowNodeGroup];

export const FlowRunScope = {
  All: "all",
  Node: "node",
  From: "from",
} as const;
export type FlowRunScope = (typeof FlowRunScope)[keyof typeof FlowRunScope];

export const FlowNodeType = {
  Result: "output.save",
  Episode: "input.episode",
} as const;
export type FlowNodeType = (typeof FlowNodeType)[keyof typeof FlowNodeType];

export const FlowRunStatus = {
  Queued: "queued",
  Running: "running",
  Done: "done",
  Error: "error",
  Cancelled: "cancelled",
} as const;
export type FlowRunStatus = (typeof FlowRunStatus)[keyof typeof FlowRunStatus];

export const FlowNodeState = {
  Waiting: "waiting",
  Running: "running",
  Done: "done",
  Error: "error",
} as const;
export type FlowNodeState = (typeof FlowNodeState)[keyof typeof FlowNodeState];

export const FlowUploadKind = {
  Image: "image",
  Video: "video",
  Audio: "audio",
} as const;
export type FlowUploadKind = (typeof FlowUploadKind)[keyof typeof FlowUploadKind];

export const FlowWidget = {
  Textarea: "textarea",
  Upload: "upload",
  Model: "model",
  Account: "account",
  Style: "style",
} as const;
export type FlowWidget = (typeof FlowWidget)[keyof typeof FlowWidget];

export interface FlowPort {
  name: string;
  label: string;
  type: FlowPortType;
  required: boolean;
  many: boolean;
  most: number;
  hint?: string;
}

export interface FlowSchemaField {
  type?: "string" | "integer" | "number" | "boolean" | "object";
  title?: string;
  description?: string;
  default?: unknown;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  $ref?: string;
  allOf?: FlowSchemaField[];
  widget?: FlowWidget;
  media?: string;
  labels?: Record<string, string>;
  properties?: Record<string, FlowSchemaField>;
}

export interface FlowConfigSchema {
  properties?: Record<string, FlowSchemaField>;
  required?: string[];
  $defs?: Record<string, FlowSchemaField>;
}

export interface FlowNodeSpec {
  type: string;
  group: FlowNodeGroup;
  label: string;
  description: string;
  inputs: FlowPort[];
  outputs: FlowPort[];
  config: FlowConfigSchema;
  media: string | null;
  needs: string[];
  host: boolean;
  one_of: string[];
  most: number;
  block: boolean;
  chain: string;
  holds: number;
}

export interface FlowModel {
  provider: string;
  model: string;
  name: string;
  credits: number | null;
  per?: string;
  own_key?: boolean;
}

export type FlowModels = Record<string, FlowModel[]>;

export interface FlowGraphNode {
  id: string;
  type: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  parent?: string;
}

export interface FlowGraphEdge {
  source: string;
  source_port: string;
  target: string;
  target_port: string;
}

export interface FlowGraph {
  nodes: FlowGraphNode[];
  edges: FlowGraphEdge[];
}

export interface FlowIssue {
  code: string;
  message: string;
  node: string;
  edge: number;
  field: string;
}

export interface FlowEpisode {
  title: string;
  brief: string;
}

export type FlowValue = string | { media: string } | Record<string, unknown> | FlowValue[];

export interface FlowRunNode {
  state: FlowNodeState;
  done: number;
  total: number;
  error: string;
  outputs: Record<string, FlowValue>;
}

export interface FlowRun {
  id: string;
  status: FlowRunStatus;
  error: string;
  credits: number;
  estimate: number;
  order: string[];
  episode: number | null;
  queued: number;
  created_at: string | null;
  ended_at: string | null;
  nodes: Record<string, FlowRunNode>;
}

export interface FlowUploaded {
  path: string;
  media: string;
}

export interface FlowListItem {
  id: string;
  title: string;
  updated_at: string | null;
}

export interface FlowOption {
  id: string;
  title: string;
}

export interface FlowStyleOption {
  key: string;
  name: string;
}

export interface FlowStartOption {
  start: string;
  label: string;
  hint: string;
}

export interface FlowDraft {
  title: string;
  graph: FlowGraph;
  episodes?: FlowEpisode[];
}

export interface FlowRunPart {
  making: number[];
  scope: FlowRunScope;
  node: string;
}

export interface FlowSaveAnswer {
  ok: boolean;
  check?: { issues: FlowIssue[] };
  credits?: number | null;
  error?: string;
}

export interface FlowRunAnswer {
  ok: boolean;
  run?: FlowRun;
  error?: string;
}
