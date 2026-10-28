import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FlowEyebrow } from "./flow-parts";
import type { FlowEpisode } from "./types";

export const FlowEpisodeLimit = {
  Title: 120,
  Brief: 4000,
} as const;

/** A series' episodes: each one's title and brief, run alone or all in turn. */
export function FlowEpisodes({
  episodes,
  making,
  disabled,
  onChange,
  onRun,
}: {
  episodes: FlowEpisode[];
  making: number | null;
  disabled: boolean;
  onChange: (episodes: FlowEpisode[]) => void;
  onRun: (indexes: number[]) => void;
}) {
  const edit = (index: number, patch: Partial<FlowEpisode>) =>
    onChange(episodes.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const written = episodes.flatMap((e, i) => (e.brief.trim() ? [i] : []));
  return (
    <div className="space-y-3 border-b border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <FlowEyebrow>Episodes</FlowEyebrow>
        <Button
          type="button"
          size="xs"
          disabled={disabled || written.length === 0}
          onClick={() => onRun(written)}
        >
          Run all
        </Button>
      </div>
      {episodes.map((episode, index) => (
        <div key={index} className="space-y-1.5 rounded border border-border bg-muted p-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{index + 1}</span>
            <Input
              value={episode.title}
              maxLength={FlowEpisodeLimit.Title}
              placeholder="Title"
              onChange={(e) => edit(index, { title: e.target.value })}
              className="h-7 flex-1"
            />
            {making === index ? (
              <span className="font-mono text-[11px] text-primary">Making</span>
            ) : null}
          </div>
          <Textarea
            value={episode.brief}
            maxLength={FlowEpisodeLimit.Brief}
            placeholder="What happens in this episode"
            onChange={(e) => edit(index, { brief: e.target.value })}
          />
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => onChange(episodes.filter((_, i) => i !== index))}
            >
              Remove
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              disabled={disabled || !episode.brief.trim()}
              onClick={() => onRun([index])}
            >
              Run
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        size="xs"
        variant="secondary"
        onClick={() => onChange([...episodes, { title: "", brief: "" }])}
      >
        Add episode
      </Button>
    </div>
  );
}
