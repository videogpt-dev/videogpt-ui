import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export type StatusMessageTone = "info" | "success" | "warning" | "danger";

export interface StatusMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: StatusMessageTone;
  title?: ReactNode;
}

const TONES: Record<
  StatusMessageTone,
  { icon: ComponentType<{ className?: string }>; className: string }
> = {
  info: { icon: Info, className: "border-vui-info/30 bg-vui-info/8 text-vui-info" },
  success: {
    icon: CircleCheck,
    className: "border-vui-success/30 bg-vui-success/8 text-vui-success",
  },
  warning: {
    icon: CircleAlert,
    className: "border-vui-warning/30 bg-vui-warning/8 text-vui-warning",
  },
  danger: {
    icon: CircleX,
    className: "border-destructive/30 bg-destructive/8 text-destructive",
  },
};

export function StatusMessage({
  tone = "info",
  title,
  children,
  className,
  ...props
}: StatusMessageProps) {
  const { icon: Icon, className: toneClassName } = TONES[tone];

  return (
    <Alert
      role={tone === "danger" ? "alert" : "status"}
      className={cn(toneClassName, className)}
      {...props}
    >
      <Icon />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {children ? (
        <AlertDescription className="text-current/85">{children}</AlertDescription>
      ) : null}
    </Alert>
  );
}
