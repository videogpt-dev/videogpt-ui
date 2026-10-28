import { cn } from "@/lib/utils";

import { FlowEyebrow, useFlowMediaUrl } from "./flow-parts";
import type { FlowCanvasNode } from "./flow-shape";
import { FlowPortType, type FlowNodeSpec, type FlowRunNode, type FlowValue } from "./types";

class FlowValues {
  static isMedia(value: FlowValue): value is { media: string } {
    return typeof value === "object" && !Array.isArray(value) && typeof value.media === "string";
  }
}

function Media({ link, type, compact }: { link: string; type: FlowPortType; compact?: boolean }) {
  const url = useFlowMediaUrl(link);
  if (!url) return <div className={cn("rounded bg-muted", compact ? "h-16" : "h-32")} />;
  const frame = cn(
    "w-full rounded border border-border bg-background object-contain",
    compact ? "max-h-24" : "max-h-72",
  );
  if (type === FlowPortType.Image) return <img src={url} alt="" className={frame} />;
  if (type === FlowPortType.Video)
    return <video src={url} controls={!compact} muted={compact} className={frame} />;
  return <audio src={url} controls className="w-full" />;
}

/** One output: a file, text, a story's title, or a list of them. */
export function FlowValuePreview({
  value,
  type,
  compact,
}: {
  value: FlowValue;
  type: FlowPortType;
  compact?: boolean;
}) {
  if (Array.isArray(value)) {
    const shown = compact ? value.slice(0, 4) : value;
    return (
      <div className={cn("grid gap-1.5", compact && type !== FlowPortType.Text && "grid-cols-2")}>
        {shown.map((item, i) => (
          <FlowValuePreview key={i} value={item} type={type} compact={compact} />
        ))}
        {compact && value.length > shown.length ? (
          <span className="font-mono text-[11px] text-muted-foreground">
            +{value.length - shown.length}
          </span>
        ) : null}
      </div>
    );
  }
  if (FlowValues.isMedia(value)) return <Media link={value.media} type={type} compact={compact} />;
  if (typeof value === "string") {
    return (
      <p
        className={cn(
          "text-[11px] whitespace-pre-wrap text-muted-foreground",
          compact && "line-clamp-3",
        )}
      >
        {value}
      </p>
    );
  }
  const story = value as { title?: string; scenes?: unknown[] };
  return (
    <p className="text-[11px] text-muted-foreground">
      {story.title ?? "Story"}{" "}
      <span className="font-mono opacity-70">{story.scenes?.length ?? 0} scenes</span>
    </p>
  );
}

/** Everything a node made in the last run, by port. */
export function FlowNodeOutputs({ spec, run }: { spec: FlowNodeSpec; run: FlowRunNode }) {
  const ports = [...spec.outputs, ...spec.inputs];
  const entries = Object.entries(run.outputs);
  if (!entries.length) return null;
  return (
    <div className="space-y-3">
      {entries.map(([name, value]) => {
        const port = ports.find((p) => p.name === name);
        if (!port) return null;
        return (
          <div key={name} className="space-y-1.5">
            <FlowEyebrow>{port.label}</FlowEyebrow>
            <FlowValuePreview value={value} type={port.type} />
          </div>
        );
      })}
    </div>
  );
}

/** What the flow's Result nodes hold, beside the canvas while no node is picked. */
export function FlowResults({ results }: { results: FlowCanvasNode[] }) {
  return (
    <div className="space-y-4 p-4">
      <FlowEyebrow>Result</FlowEyebrow>
      {results.map((node) => {
        const run = node.data.run;
        const title = typeof node.data.config.title === "string" ? node.data.config.title : "";
        return (
          <div key={node.id} className="space-y-2">
            {results.length > 1 ? (
              <p className="text-xs font-semibold text-foreground">
                {title || node.data.spec.label}
              </p>
            ) : null}
            {run?.error ? <p className="text-[11px] text-destructive">{run.error}</p> : null}
            {run && Object.keys(run.outputs).length ? (
              <FlowNodeOutputs spec={node.data.spec} run={run} />
            ) : (
              <p className="text-[11px] text-muted-foreground">Run the flow to see it here.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
