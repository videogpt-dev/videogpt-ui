import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StudioShellProps {
  navigation?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  inspector?: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StudioShell({
  navigation,
  header,
  children,
  inspector,
  footer,
  className,
  contentClassName,
}: StudioShellProps) {
  return (
    <div
      data-slot="vui-studio-shell"
      className={cn(
        "grid min-h-svh grid-cols-1 bg-vui-canvas lg:grid-cols-[15rem_minmax(0,1fr)] has-[[data-slot=vui-inspector]]:xl:grid-cols-[15rem_minmax(0,1fr)_20rem]",
        className,
      )}
    >
      {navigation ? (
        <aside className="border-b bg-vui-panel p-4 lg:border-r lg:border-b-0">{navigation}</aside>
      ) : null}
      <div className="flex min-w-0 flex-col">
        {header ? (
          <header className="sticky top-0 z-20 border-b bg-background/85 px-5 py-3 backdrop-blur-xl">
            {header}
          </header>
        ) : null}
        <main className={cn("min-w-0 flex-1 p-5 md:p-8", contentClassName)}>{children}</main>
        {footer ? <footer className="border-t p-4">{footer}</footer> : null}
      </div>
      {inspector ? (
        <aside
          data-slot="vui-inspector"
          className="border-t bg-vui-panel p-5 xl:border-t-0 xl:border-l"
        >
          {inspector}
        </aside>
      ) : null}
    </div>
  );
}
