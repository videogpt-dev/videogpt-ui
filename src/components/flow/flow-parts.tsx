import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { FlowLook, type FlowTone } from "./flow-look";

export type FlowMediaResolver = (link: string) => string | Promise<string>;

const SAME: FlowMediaResolver = (link) => link;
const FlowMediaContext = createContext<FlowMediaResolver>(SAME);

export function FlowMediaProvider({
  resolve,
  children,
}: {
  resolve?: FlowMediaResolver;
  children: ReactNode;
}) {
  return <FlowMediaContext.Provider value={resolve ?? SAME}>{children}</FlowMediaContext.Provider>;
}

/** A media link a `<video>`, `<img>` or `<audio>` can load, as the host resolves it (a host
 *  may add its session to it); empty until it is ready. */
export function useFlowMediaUrl(link: string | null | undefined): string {
  const resolve = useContext(FlowMediaContext);
  const [resolved, setResolved] = useState({ link: "", url: "" });
  useEffect(() => {
    if (!link) return;
    let active = true;
    void Promise.resolve(resolve(link)).then((url) => {
      if (active) setResolved({ link, url });
    });
    return () => {
      active = false;
    };
  }, [link, resolve]);
  return link && resolved.link === link ? resolved.url : "";
}

const NARROW = "(max-width: 767px)";

export function useFlowNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(NARROW).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(NARROW);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

export function FlowBadge({ tone, children }: { tone: FlowTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[11px] leading-none",
        FlowLook.TONE_CLASS[tone],
      )}
    >
      {children}
    </span>
  );
}

export function FlowEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function FlowSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}
