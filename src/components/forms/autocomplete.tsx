import * as React from "react";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface AutocompleteItem {
  value: string;
  label?: string;
  hint?: string;
  badge?: string;
  disabled?: boolean;
}

export interface AutocompleteProps {
  items: AutocompleteItem[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  allowCustom?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Autocomplete({
  items,
  value = "",
  onValueChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  loading = false,
  allowCustom = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = items.find((item) => item.value === value);
  const normalizedQuery = query.trim();
  const hasExactMatch = items.some(
    (item) => item.value.toLowerCase() === normalizedQuery.toLowerCase(),
  );
  const showCustom = allowCustom && normalizedQuery.length > 0 && !hasExactMatch;

  function select(nextValue: string) {
    onValueChange(nextValue);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{selected?.label || value || placeholder}</span>
          {loading ? (
            <LoaderCircle className="ml-2 size-4 shrink-0 animate-spin opacity-60" />
          ) : (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter>
          <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
          <CommandList>
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" /> Loading options...
              </div>
            ) : null}
            {!loading && !showCustom ? <CommandEmpty>{emptyMessage}</CommandEmpty> : null}
            <CommandGroup>
              {showCustom ? (
                <CommandItem value={normalizedQuery} onSelect={() => select(normalizedQuery)}>
                  Use &quot;{normalizedQuery}&quot;
                </CommandItem>
              ) : null}
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.label ?? ""} ${item.value}`}
                  disabled={item.disabled}
                  onSelect={() => select(item.value)}
                  data-checked={item.value === value}
                >
                  <Check
                    className={cn(
                      "size-4 text-vui-brand",
                      item.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate">{item.label ?? item.value}</span>
                      {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                    </span>
                    {item.hint || (item.label && item.label !== item.value) ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.label && item.label !== item.value ? item.value : null}
                        {item.hint
                          ? `${item.label && item.label !== item.value ? " · " : ""}${item.hint}`
                          : null}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
