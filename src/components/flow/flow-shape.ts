import type { Connection, Edge, Node } from "@xyflow/react";

import { FlowLook } from "./flow-look";
import type { FlowSpecs } from "./flow-rules";
import {
  FlowNodeGroup,
  FlowPortType,
  type FlowGraph,
  type FlowGraphEdge,
  type FlowNodeSpec,
  type FlowRun,
  type FlowRunNode,
} from "./types";

export type FlowNodeData = {
  spec: FlowNodeSpec;
  config: Record<string, unknown>;
  run?: FlowRunNode;
  issues: string[];
  number?: number;
  model?: string | null;
};

export const FlowNodeKind = {
  Node: "flow",
  Block: "block",
} as const;
export type FlowNodeKind = (typeof FlowNodeKind)[keyof typeof FlowNodeKind];

export type FlowCanvasNode = Node<FlowNodeData, FlowNodeKind>;

type Point = { x: number; y: number };

/** A saved flow as the canvas draws it, and back. */
export class FlowShape {
  /** A spec for a node whose type this account can no longer place, so it still shows. */
  static missing(type: string, edges: FlowGraphEdge[], id: string): FlowNodeSpec {
    const port = (name: string) => ({
      name,
      label: name,
      type: FlowPortType.Text,
      required: false,
      many: true,
      most: 0,
    });
    return {
      type,
      group: FlowNodeGroup.Input,
      label: type,
      description: "Not available on this account.",
      inputs: edges.filter((e) => e.target === id).map((e) => port(e.target_port)),
      outputs: edges.filter((e) => e.source === id).map((e) => port(e.source_port)),
      config: {},
      media: null,
      needs: [],
      host: false,
      one_of: [],
      most: 1,
      block: false,
      chain: "",
      holds: 0,
    };
  }

  static edge(link: FlowGraphEdge, specs: FlowSpecs, types: Map<string, string>): Edge {
    const out = specs[types.get(link.source) ?? ""]?.outputs.find(
      (p) => p.name === link.source_port,
    );
    return {
      id: `${link.source}.${link.source_port}-${link.target}.${link.target_port}`,
      source: link.source,
      sourceHandle: link.source_port,
      target: link.target,
      targetHandle: link.target_port,
      style: out ? { stroke: FlowLook.PORT_STROKE[out.type], strokeWidth: 2 } : undefined,
    };
  }

  static link(c: Connection | Edge): FlowGraphEdge {
    return {
      source: c.source,
      source_port: c.sourceHandle ?? "",
      target: c.target,
      target_port: c.targetHandle ?? "",
    };
  }

  static graph(nodes: FlowCanvasNode[], edges: Edge[]): FlowGraph {
    return {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.data.spec.type,
        config: n.data.config,
        position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
        ...(n.parentId ? { parent: n.parentId } : {}),
      })),
      edges: edges.map((e) => FlowShape.link(e)),
    };
  }

  /** The later of two runs: a run just started, or one the page loaded since. */
  static newer(a: FlowRun | undefined, b: FlowRun | null): FlowRun | null {
    if (!a || !b) return a ?? b;
    return (a.created_at ?? "") >= (b.created_at ?? "") ? a : b;
  }

  static node(
    id: string,
    spec: FlowNodeSpec,
    config: Record<string, unknown>,
    position: Point,
    parent?: string,
  ): FlowCanvasNode {
    return {
      id,
      type: spec.block ? FlowNodeKind.Block : FlowNodeKind.Node,
      position,
      data: { spec, config, issues: [] },
      ...(parent ? { parentId: parent, extent: "parent" as const } : {}),
    };
  }

  static id(type: string): string {
    return `${type.replace(".", "_")}_${Math.random().toString(36).slice(2, 6)}`;
  }
}
