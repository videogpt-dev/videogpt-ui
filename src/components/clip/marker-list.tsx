import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ClipMarkerItem {
  id: string;
  startLabel: string;
  endLabel: string;
  format: string;
  rendered: boolean;
}

export interface ClipMarkerListProps {
  items: ClipMarkerItem[];
  onOpen: (id: string) => void;
  empty?: string;
  className?: string;
}

export function ClipMarkerList({
  items,
  onOpen,
  empty = "No clips yet. Drag a selection and add one.",
  className,
}: ClipMarkerListProps) {
  return (
    <section data-slot="clip-marker-list" className={cn("grid gap-2", className)}>
      <h3 className="text-sm font-semibold">Clips ({items.length})</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.id)}
              className="flex w-44 flex-col gap-1 rounded-lg border bg-card p-3 text-left text-xs hover:border-primary"
            >
              <span className="flex w-full items-center gap-2">
                <span className="min-w-0 truncate font-medium">{item.id}</span>
                <Badge className="ml-auto" variant={item.rendered ? "secondary" : "outline"}>
                  {item.rendered ? item.format : "pending"}
                </Badge>
              </span>
              <span className="text-muted-foreground">
                {item.startLabel}-{item.endLabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
