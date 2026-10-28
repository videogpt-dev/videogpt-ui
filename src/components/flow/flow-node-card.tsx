import { Handle, Position, type NodeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

import { FlowLook, FlowTone } from "./flow-look";
import { FlowValuePreview } from "./flow-outputs";
import { FlowBadge } from "./flow-parts";
import type { FlowCanvasNode } from "./flow-shape";
import { FlowNodeState, type FlowPort } from "./types";

function PortRow({ port, side }: { port: FlowPort; side: "in" | "out" }) {
  const input = side === "in";
  return (
    <div
      title={port.hint}
      className={cn(
        "relative flex h-6 items-center px-3 text-[11px] pointer-coarse:h-9",
        !input && "justify-end",
      )}
    >
      <Handle
        id={port.name}
        type={input ? "target" : "source"}
        position={input ? Position.Left : Position.Right}
        className={cn(
          "!size-2.5 !border-2 !border-card pointer-coarse:!size-4",
          FlowLook.PORT_COLOR[port.type],
        )}
      />
      <span className="text-muted-foreground">
        {port.label}
        {port.required && input ? <span className="text-destructive">*</span> : null}
      </span>
      {port.hint ? (
        <span
          aria-label={port.hint}
          className="ml-1 size-1.5 shrink-0 cursor-help rounded-full bg-muted-foreground/60"
        />
      ) : null}
      {port.many ? (
        <span className="ml-1 font-mono text-muted-foreground opacity-70">[ ]</span>
      ) : null}
    </div>
  );
}

export function FlowNodeCard({ data, selected }: NodeProps<FlowCanvasNode>) {
  const { spec, run, issues, model } = data;
  const state = run?.state ?? FlowNodeState.Waiting;
  const [name, first] = run ? (Object.entries(run.outputs)[0] ?? []) : [];
  const port = [...spec.outputs, ...spec.inputs].find((p) => p.name === name);
  return (
    <div
      className={cn(
        "w-56 rounded-md border bg-card shadow-lg",
        selected ? "border-primary" : issues.length ? "border-destructive/70" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="truncate text-xs font-semibold text-foreground">{spec.label}</span>
        {run && state !== FlowNodeState.Waiting ? (
          <FlowBadge tone={FlowLook.STATE_TONE[state]}>
            {run.total > 1 ? `${run.done}/${run.total}` : state}
          </FlowBadge>
        ) : issues.length ? (
          <FlowBadge tone={FlowTone.Danger}>{issues.length}</FlowBadge>
        ) : null}
      </div>
      {model ? (
        <p className="truncate border-b border-border px-3 py-1 text-[11px] text-muted-foreground">
          {model}
        </p>
      ) : null}
      <div className="py-1">
        {spec.inputs.map((p) => (
          <PortRow key={`in-${p.name}`} port={p} side="in" />
        ))}
        {spec.outputs.map((p) => (
          <PortRow key={`out-${p.name}`} port={p} side="out" />
        ))}
      </div>
      {run?.error ? (
        <p className="border-t border-border px-3 py-2 text-[11px] text-destructive">{run.error}</p>
      ) : first !== undefined && port ? (
        <div className="border-t border-border p-2">
          <FlowValuePreview value={first} type={port.type} compact />
        </div>
      ) : null}
    </div>
  );
}

/** A scene: a box its nodes sit in. Its clip comes from inside, the film so far goes on. */
export function FlowBlockCard({ data, selected }: NodeProps<FlowCanvasNode>) {
  const { spec, run, issues, number } = data;
  const state = run?.state ?? FlowNodeState.Waiting;
  const ports = [
    ...spec.inputs.map((p) => ({ p, input: true })),
    ...spec.outputs.map((p) => ({ p, input: false })),
  ];
  return (
    <div
      className={cn(
        "relative size-full rounded-lg border-2 border-dashed bg-card/30",
        selected ? "border-primary" : issues.length ? "border-destructive/70" : "border-border",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs font-semibold text-foreground">
          {spec.label} {number}
        </span>
        {run && state !== FlowNodeState.Waiting ? (
          <FlowBadge tone={FlowLook.STATE_TONE[state]}>{state}</FlowBadge>
        ) : issues.length ? (
          <FlowBadge tone={FlowTone.Danger}>{issues.length}</FlowBadge>
        ) : null}
      </div>
      {ports.map(({ p, input }, i) => {
        const chain = p.name === spec.chain;
        const side = chain ? Position.Left : Position.Right;
        const top = chain ? 24 : 24 + i * 28;
        return (
          <div key={p.name}>
            <Handle
              id={p.name}
              type={input ? "target" : "source"}
              position={side}
              style={{ top }}
              className={cn(
                "!size-3 !border-2 !border-card pointer-coarse:!size-4",
                FlowLook.PORT_COLOR[p.type],
              )}
            />
            <span
              className={cn(
                "absolute text-[11px] text-muted-foreground",
                side === Position.Left ? "left-3" : "right-3",
              )}
              style={{ top: top + 8 }}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
