import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover } from "radix-ui";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FlowPickerItem {
  value: string;
  label: string;
  hint?: string;
}

/** A searchable list to pick one item from, for lists too long for a plain select. */
export function FlowPicker({
  items,
  value,
  onChange,
  placeholder = "Search",
}: {
  items: FlowPickerItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const picked = items.find((item) => item.value === value);
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    return words ? items.filter((item) => item.label.toLowerCase().includes(words)) : items;
  }, [items, query]);
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <span className="truncate">{picked?.label ?? ""}</span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-(--radix-popover-trigger-width) min-w-56 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          <Input
            autoFocus
            value={query}
            placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-1 h-7"
          />
          <div role="listbox" className="max-h-64 overflow-y-auto">
            {shown.map((item) => (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={item.value === value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
                  item.value === value && "bg-muted",
                )}
              >
                <Check
                  className={cn("size-3.5 shrink-0", item.value === value ? "" : "invisible")}
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.hint ? (
                  <span className="shrink-0 text-[11px] text-muted-foreground">{item.hint}</span>
                ) : null}
              </button>
            ))}
            {shown.length === 0 ? (
              <p className="px-2 py-1.5 text-[11px] text-muted-foreground">Nothing matches.</p>
            ) : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
