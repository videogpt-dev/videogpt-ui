import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label={label}
      className={cn("size-4 animate-spin text-vui-brand", className)}
    />
  );
}
