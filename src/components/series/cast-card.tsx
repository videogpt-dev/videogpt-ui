import type { ReactNode } from "react";
import { Check, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SeriesCharacter } from "./types";

export interface SeriesCastCardProps {
  character: SeriesCharacter;
  readOnly?: boolean;
  resolveImage?: (path: string) => string;
  renderPortrait?: (path: string, character: SeriesCharacter) => ReactNode;
  generateAction?: ReactNode;
  onChange?: (patch: Partial<SeriesCharacter>) => void;
  onSelectPortrait?: (path: string) => void;
  onRemovePortrait?: (path: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function SeriesCastCard({
  character,
  readOnly = false,
  resolveImage = (path) => path,
  renderPortrait,
  generateAction,
  onChange,
  onSelectPortrait,
  onRemovePortrait,
  onRemove,
  className,
}: SeriesCastCardProps) {
  const patch = (next: Partial<SeriesCharacter>) => onChange?.(next);
  const images = character.images ?? [];
  return (
    <Card data-slot="series-cast-card" className={cn("gap-0 py-0", className)}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {character.name || "New character"}
          </span>
          {onRemove && !readOnly ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove character"
              onClick={onRemove}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>

        {images.length ? (
          <div data-slot="series-cast-portraits" className="flex flex-wrap gap-2">
            {images.map((path) => {
              const selected = character.referenceImage === path;
              return (
                <div key={path} className="group/portrait relative">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onSelectPortrait?.(path)}
                    className={cn(
                      "block size-20 overflow-hidden rounded-md border bg-muted transition-colors",
                      selected ? "border-primary ring-2 ring-primary/40" : "border-border",
                    )}
                  >
                    {renderPortrait ? (
                      renderPortrait(path, character)
                    ) : (
                      <img
                        src={resolveImage(path)}
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </button>
                  {selected ? (
                    <span className="absolute left-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check size={10} />
                    </span>
                  ) : null}
                  {onRemovePortrait && !readOnly ? (
                    <button
                      type="button"
                      aria-label="Remove portrait"
                      onClick={() => onRemovePortrait(path)}
                      className="absolute right-1 top-1 hidden size-4 place-items-center rounded-full bg-background/90 text-muted-foreground group-hover/portrait:grid hover:text-destructive"
                    >
                      <X size={10} />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <Field>
          <FieldLabel htmlFor={`cast-${character.id}-name`}>Name</FieldLabel>
          <Input
            id={`cast-${character.id}-name`}
            readOnly={readOnly}
            value={character.name}
            placeholder="Ada the keeper"
            onChange={(event) => patch({ name: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`cast-${character.id}-look`}>Look</FieldLabel>
          <Textarea
            id={`cast-${character.id}-look`}
            rows={2}
            readOnly={readOnly}
            value={character.look}
            placeholder="Weathered, salt-stained coat, lantern in hand..."
            onChange={(event) => patch({ look: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`cast-${character.id}-personality`}>Personality</FieldLabel>
          <Textarea
            id={`cast-${character.id}-personality`}
            rows={2}
            readOnly={readOnly}
            value={character.personality}
            placeholder="Stoic, dry humor, fiercely loyal..."
            onChange={(event) => patch({ personality: event.target.value })}
          />
        </Field>

        {generateAction ? <div className="flex justify-end">{generateAction}</div> : null}
      </CardContent>
    </Card>
  );
}
