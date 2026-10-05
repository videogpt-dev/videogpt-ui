import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SeriesCatalog, type EpisodeIdea, type ShowrunnerCopy } from "./types";

export interface SeriesShowrunnerPanelProps {
  count: number;
  ideas: EpisodeIdea[];
  selected: boolean[];
  planning?: boolean;
  creating?: boolean;
  minCount?: number;
  maxCount?: number;
  copy?: Partial<ShowrunnerCopy>;
  writerSlot?: ReactNode;
  onCountChange: (count: number) => void;
  onPlan: () => void;
  onToggle: (index: number) => void;
  onEditIdea?: (index: number, patch: Partial<EpisodeIdea>) => void;
  onSelectAll?: () => void;
  onClear?: () => void;
  onCreate: () => void;
  className?: string;
}

export function SeriesShowrunnerPanel({
  count,
  ideas,
  selected,
  planning = false,
  creating = false,
  minCount = 1,
  maxCount = 12,
  copy: copyOverrides,
  writerSlot,
  onCountChange,
  onPlan,
  onToggle,
  onEditIdea,
  onSelectAll,
  onClear,
  onCreate,
  className,
}: SeriesShowrunnerPanelProps) {
  const copy = { ...SeriesCatalog.showrunnerCopy, ...copyOverrides };
  const selectedCount = selected.filter(Boolean).length;
  const busy = planning || creating;

  return (
    <Card data-slot="series-showrunner-panel" className={cn("gap-0 py-0", className)}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm" htmlFor="showrunner-count">
            <span className="text-muted-foreground">{copy.countLabel}</span>
            <Input
              id="showrunner-count"
              type="number"
              min={minCount}
              max={maxCount}
              value={count}
              disabled={busy}
              className="w-24"
              onChange={(event) =>
                onCountChange(
                  Math.max(minCount, Math.min(maxCount, Number(event.target.value) || minCount)),
                )
              }
            />
          </label>
          {writerSlot}
          <Button type="button" variant="secondary" disabled={busy} onClick={onPlan}>
            <Sparkles />
            {planning ? copy.planning : copy.plan}
          </Button>
        </div>

        {ideas.length ? (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {selectedCount}/{ideas.length} selected
              </span>
              <span className="flex gap-2">
                {onSelectAll ? (
                  <button
                    type="button"
                    className="underline-offset-2 hover:underline"
                    onClick={onSelectAll}
                  >
                    {copy.selectAll}
                  </button>
                ) : null}
                {onClear ? (
                  <button
                    type="button"
                    className="underline-offset-2 hover:underline"
                    onClick={onClear}
                  >
                    {copy.clear}
                  </button>
                ) : null}
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {ideas.map((idea, index) => {
                const id = `showrunner-idea-${index}`;
                return (
                  <li key={id}>
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40",
                        selected[index] ? "border-primary" : "border-border",
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={Boolean(selected[index])}
                        disabled={busy}
                        onCheckedChange={() => onToggle(index)}
                        className="mt-0.5"
                      />
                      {onEditIdea ? (
                        <span className="flex min-w-0 flex-1 flex-col gap-2">
                          <Input
                            value={idea.title}
                            disabled={busy}
                            placeholder={`Episode ${index + 1}`}
                            onChange={(event) => onEditIdea(index, { title: event.target.value })}
                          />
                          <Textarea
                            rows={2}
                            value={idea.description}
                            disabled={busy}
                            onChange={(event) =>
                              onEditIdea(index, { description: event.target.value })
                            }
                          />
                        </span>
                      ) : (
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">
                            {idea.title || `Episode ${index + 1}`}
                          </span>
                          {idea.description ? (
                            <span className="block text-xs text-muted-foreground">
                              {idea.description}
                            </span>
                          ) : null}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-end">
              <Button type="button" disabled={busy || selectedCount === 0} onClick={onCreate}>
                {creating ? copy.creating : `${copy.createSelected} (${selectedCount})`}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
