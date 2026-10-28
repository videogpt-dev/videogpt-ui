import { cn } from "@/lib/utils";

import { FlowLook } from "./flow-look";
import { FlowEyebrow } from "./flow-parts";
import { FlowNodeGroup, type FlowNodeSpec } from "./types";

export const FLOW_DRAG_TYPE = "application/x-flow-node";

/** The node types to drag onto the canvas (or click to drop in the middle), by group. */
export function FlowPalette({
  specs,
  counts,
  onAdd,
}: {
  specs: FlowNodeSpec[];
  counts: Map<string, number>;
  onAdd: (type: string) => void;
}) {
  return (
    <div className="space-y-4 p-3">
      {Object.values(FlowNodeGroup).map((group) => {
        const items = specs.filter((s) => s.group === group);
        if (!items.length) return null;
        return (
          <div key={group} className="space-y-1.5">
            <FlowEyebrow>{FlowLook.GROUP_LABEL[group]}</FlowEyebrow>
            {items.map((spec) => {
              const full = (counts.get(spec.type) ?? 0) >= spec.most;
              return (
                <button
                  key={spec.type}
                  type="button"
                  draggable={!full}
                  disabled={full}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(FLOW_DRAG_TYPE, spec.type);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => onAdd(spec.type)}
                  title={full ? `At most ${spec.most} in one flow.` : spec.description}
                  className="flex w-full cursor-grab items-center gap-2 rounded border border-border bg-muted px-2.5 py-1.5 text-left text-xs text-foreground hover:border-foreground/30 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex gap-0.5">
                    {spec.outputs.slice(0, 3).map((p) => (
                      <span
                        key={p.name}
                        className={cn("size-1.5 rounded-full", FlowLook.PORT_COLOR[p.type])}
                      />
                    ))}
                  </span>
                  <span className="truncate">{spec.label}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
