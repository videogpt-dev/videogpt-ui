import { FlowNodeGroup, FlowNodeState, FlowPortType } from "./types";

export const FlowTone = {
  Neutral: "neutral",
  Brand: "brand",
  Success: "success",
  Danger: "danger",
} as const;
export type FlowTone = (typeof FlowTone)[keyof typeof FlowTone];

/** How a flow reads at a glance: each port type's colour, each group's name, each state's
 *  tone. Colours come from the theme tokens, so a host theme restyles them. */
export class FlowLook {
  static readonly PORT_COLOR: Record<FlowPortType, string> = {
    [FlowPortType.Text]: "bg-muted-foreground",
    [FlowPortType.Story]: "bg-vui-info",
    [FlowPortType.Image]: "bg-primary",
    [FlowPortType.Video]: "bg-vui-warning",
    [FlowPortType.Audio]: "bg-vui-success",
  };

  static readonly PORT_STROKE: Record<FlowPortType, string> = {
    [FlowPortType.Text]: "var(--color-muted-foreground)",
    [FlowPortType.Story]: "var(--color-vui-info)",
    [FlowPortType.Image]: "var(--color-primary)",
    [FlowPortType.Video]: "var(--color-vui-warning)",
    [FlowPortType.Audio]: "var(--color-vui-success)",
  };

  static readonly GROUP_LABEL: Record<FlowNodeGroup, string> = {
    [FlowNodeGroup.Input]: "Inputs",
    [FlowNodeGroup.Generate]: "Generate",
    [FlowNodeGroup.Story]: "Story",
    [FlowNodeGroup.Edit]: "Edit",
    [FlowNodeGroup.Output]: "Output",
  };

  static readonly STATE_TONE: Record<FlowNodeState, FlowTone> = {
    [FlowNodeState.Waiting]: FlowTone.Neutral,
    [FlowNodeState.Running]: FlowTone.Brand,
    [FlowNodeState.Done]: FlowTone.Success,
    [FlowNodeState.Error]: FlowTone.Danger,
  };

  static readonly TONE_CLASS: Record<FlowTone, string> = {
    [FlowTone.Neutral]: "bg-muted text-muted-foreground",
    [FlowTone.Brand]: "bg-primary/15 text-primary",
    [FlowTone.Success]: "bg-vui-success/15 text-vui-success",
    [FlowTone.Danger]: "bg-destructive/15 text-destructive",
  };
}
