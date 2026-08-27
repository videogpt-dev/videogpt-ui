import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ComponentType } from "react";
import { ChevronDown, CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";
import { Toaster as SonnerToaster, toast } from "sonner";

import { cn } from "@/lib/utils";

export type ToastTone = "success" | "info" | "warning" | "danger";

const DURATION: Record<ToastTone, number> = {
  success: 6_000,
  info: 6_000,
  warning: 30_000,
  danger: Infinity,
};

const TONES: Record<ToastTone, { icon: ComponentType<{ className?: string }>; accent: string }> = {
  success: { icon: CircleCheck, accent: "text-vui-success" },
  info: { icon: Info, accent: "text-vui-info" },
  warning: { icon: CircleAlert, accent: "text-vui-warning" },
  danger: { icon: CircleX, accent: "text-destructive" },
};

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: string;
  action?: ToastAction;
}

interface ToastCardProps extends ToastOptions {
  id: string | number;
  tone: ToastTone;
  message: string;
}

function ToastCard({ id, tone, title, message, action }: ToastCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const { icon: Icon, accent } = TONES[tone];

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body) setOverflows(body.scrollHeight > body.clientHeight + 1);
  }, [message]);

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className="pointer-events-auto flex w-full gap-2.5 rounded-lg border bg-popover px-3 py-2.5 text-sm text-popover-foreground shadow-lg"
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", accent)} />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <p
          ref={bodyRef}
          className={cn(
            "wrap-anywhere whitespace-pre-wrap",
            title && "mt-0.5 text-muted-foreground",
            !expanded && "line-clamp-3",
          )}
        >
          {message}
        </p>
        {overflows ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-1 flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
          </button>
        ) : null}
        {action ? (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              toast.dismiss(id);
            }}
            className="mt-2 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
          >
            {action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        aria-label="Dismiss"
        className="-mt-0.5 -mr-1 size-6 shrink-0 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="mx-auto size-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      offset={16}
      gap={8}
      visibleToasts={5}
      toastOptions={{ unstyled: true, classNames: { toast: "w-full" } }}
      style={{ "--width": "22rem" } as CSSProperties}
    />
  );
}

function show(tone: ToastTone, message: string, options: ToastOptions = {}) {
  return toast.custom((id) => <ToastCard id={id} tone={tone} message={message} {...options} />, {
    duration: DURATION[tone],
  });
}

export const notify = {
  success: (message: string, options?: ToastOptions) => show("success", message, options),
  info: (message: string, options?: ToastOptions) => show("info", message, options),
  warning: (message: string, options?: ToastOptions) => show("warning", message, options),
  error: (message: string, options?: ToastOptions) => show("danger", message, options),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
