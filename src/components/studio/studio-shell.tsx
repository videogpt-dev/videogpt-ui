import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StudioShellProps {
  navigation?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StudioShell({
  navigation,
  header,
  children,
  footer,
  className,
  contentClassName,
}: StudioShellProps) {
  return (
    <div
      data-slot="vui-studio-shell"
      className={cn(
        "flex min-h-svh flex-col bg-vui-canvas lg:flex-row",
        className,
      )}
    >
      {navigation ? (
        <aside className="border-b bg-vui-panel p-4 lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">{navigation}</aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {header ? (
          <header className="sticky top-0 z-20 border-b bg-background/85 px-5 py-3 backdrop-blur-xl">
            {header}
          </header>
        ) : null}
        <main className={cn("min-w-0 flex-1 p-5 md:p-8", contentClassName)}>{children}</main>
        {footer ? <footer className="border-t p-4">{footer}</footer> : null}
      </div>
    </div>
  );
}
