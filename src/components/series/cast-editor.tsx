import type { ReactNode } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SeriesCastCard } from "./cast-card";
import type { SeriesCharacter } from "./types";

export interface SeriesCastEditorProps {
  cast: SeriesCharacter[];
  readOnly?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  addLabel?: string;
  resolveImage?: (path: string) => string;
  renderPortrait?: (path: string, character: SeriesCharacter) => ReactNode;
  renderGenerateAction?: (character: SeriesCharacter) => ReactNode;
  onChangeCharacter?: (id: string, patch: Partial<SeriesCharacter>) => void;
  onSelectPortrait?: (id: string, path: string) => void;
  onRemovePortrait?: (id: string, path: string) => void;
  onRemoveCharacter?: (id: string) => void;
  onAddCharacter?: () => void;
  className?: string;
}

export function SeriesCastEditor({
  cast,
  readOnly = false,
  title = "Cast",
  description = "The recurring characters every episode is built around.",
  addLabel = "Add character",
  resolveImage,
  renderPortrait,
  renderGenerateAction,
  onChangeCharacter,
  onSelectPortrait,
  onRemovePortrait,
  onRemoveCharacter,
  onAddCharacter,
  className,
}: SeriesCastEditorProps) {
  return (
    <div data-slot="series-cast-editor" className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {onAddCharacter && !readOnly ? (
          <Button type="button" variant="secondary" size="sm" onClick={onAddCharacter}>
            <UserPlus />
            {addLabel}
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cast.map((character) => (
          <SeriesCastCard
            key={character.id}
            character={character}
            readOnly={readOnly}
            resolveImage={resolveImage}
            renderPortrait={renderPortrait}
            generateAction={renderGenerateAction?.(character)}
            onChange={(patch) => onChangeCharacter?.(character.id, patch)}
            onSelectPortrait={(path) => onSelectPortrait?.(character.id, path)}
            onRemovePortrait={(path) => onRemovePortrait?.(character.id, path)}
            onRemove={onRemoveCharacter ? () => onRemoveCharacter(character.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
