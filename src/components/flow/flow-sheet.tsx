import type { ReactNode } from "react";
import { X } from "lucide-react";

/** A panel sliding up over the canvas on a phone, where side panels do not fit. */
export function FlowSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex max-h-[65%] flex-col rounded-t-xl border-t border-border bg-card shadow-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
