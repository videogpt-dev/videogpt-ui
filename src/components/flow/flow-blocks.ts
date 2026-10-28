import type { Edge } from "@xyflow/react";

import type { FlowCanvasNode } from "./flow-shape";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

/** Scene blocks on the canvas: how big each is around its nodes, which one a point falls in,
 *  and their place in the film. */
export class FlowBlocks {
  static readonly NODE: Size = { width: 224, height: 150 };
  static readonly PAD = 40;
  static readonly MIN: Size = { width: 560, height: 260 };

  static size(block: FlowCanvasNode, nodes: FlowCanvasNode[]): Size {
    let { width, height } = FlowBlocks.MIN;
    for (const n of nodes) {
      if (n.parentId !== block.id) continue;
      width = Math.max(
        width,
        n.position.x + (n.measured?.width ?? FlowBlocks.NODE.width) + FlowBlocks.PAD,
      );
      height = Math.max(
        height,
        n.position.y + (n.measured?.height ?? FlowBlocks.NODE.height) + FlowBlocks.PAD,
      );
    }
    return { width, height };
  }

  static at(point: Point, nodes: FlowCanvasNode[]): FlowCanvasNode | undefined {
    return nodes.find((n) => {
      if (!n.data.spec.block || n.parentId) return false;
      const { width, height } = FlowBlocks.size(n, nodes);
      return (
        point.x >= n.position.x &&
        point.x <= n.position.x + width &&
        point.y >= n.position.y &&
        point.y <= n.position.y + height
      );
    });
  }

  static held(block: string, nodes: FlowCanvasNode[]): number {
    return nodes.filter((n) => n.parentId === block).length;
  }

  /** Each block's number: along the chain from the first, then any left unchained. */
  static numbers(nodes: FlowCanvasNode[], edges: Edge[]): Map<string, number> {
    const blocks = nodes.filter((n) => n.data.spec.block);
    const next = new Map<string, string>();
    const fed = new Set<string>();
    for (const e of edges) {
      const target = blocks.find((b) => b.id === e.target);
      if (target && e.targetHandle === target.data.spec.chain) {
        next.set(e.source, e.target);
        fed.add(e.target);
      }
    }
    const out = new Map<string, number>();
    for (const head of blocks.filter((b) => !fed.has(b.id))) {
      for (let id: string | undefined = head.id; id && !out.has(id); id = next.get(id)) {
        out.set(id, out.size + 1);
      }
    }
    for (const b of blocks) if (!out.has(b.id)) out.set(b.id, out.size + 1);
    return out;
  }

  /** Blocks before the nodes they hold, as the canvas needs them. */
  static ordered<T extends { parentId?: string }>(nodes: T[]): T[] {
    return [...nodes.filter((n) => !n.parentId), ...nodes.filter((n) => n.parentId)];
  }
}
