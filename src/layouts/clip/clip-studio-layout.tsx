import type { ReactNode } from "react";
import { Check, Scissors } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ClipStudioTab = "moments" | "clips";

export interface ClipStudioMoment {
  key: string;
  label: string;
  range: string;
  duration: string;
  score?: number | null;
  title: string;
  hook?: string;
  reason?: string;
  text?: string;
  rendered?: boolean;
}

export interface ClipStudioLayoutProps {
  moments: ClipStudioMoment[];
  approved: string[];
  focused: string | null;
  tab: ClipStudioTab;
  player: ReactNode;
  clips: ReactNode;
  clipCount: number;
  momentActions?: (moment: ClipStudioMoment) => ReactNode;
  renderLabel: string;
  renderDisabled?: boolean;
  className?: string;
  onFocus: (key: string) => void;
  onToggle: (key: string) => void;
  onTabChange: (tab: ClipStudioTab) => void;
  onRender: () => void;
}

function MomentRow({
  moment,
  focused,
  approved,
  onFocus,
  onToggle,
}: {
  moment: ClipStudioMoment;
  focused: boolean;
  approved: boolean;
  onFocus: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      data-slot="clip-studio-moment"
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
        focused ? "border-vui-brand bg-vui-brand/5" : "hover:bg-muted/50",
      )}
    >
      <button type="button" className="min-w-0 flex-1 text-left" onClick={onFocus}>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{moment.label}</span>
          <span className="font-mono">{moment.range}</span>
          <span>{moment.duration}</span>
          {typeof moment.score === "number" ? <span>score {moment.score}</span> : null}
          {moment.rendered ? <Badge variant="secondary">Clipped</Badge> : null}
        </div>
        <p dir="auto" className="mt-1 line-clamp-1 text-sm">
          {moment.title}
        </p>
      </button>
      <Button
        type="button"
        size="sm"
        variant={approved ? "default" : "outline"}
        aria-pressed={approved}
        onClick={onToggle}
      >
        {approved ? <Check /> : null}
        {approved ? "Approved" : "Approve"}
      </Button>
    </div>
  );
}

function MomentDetail({ moment, actions }: { moment: ClipStudioMoment; actions?: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 dir="auto" className="font-semibold">
          {moment.title}
        </h3>
        {actions}
      </div>
      {moment.hook ? (
        <p dir="auto" className="text-sm">
          <span className="text-muted-foreground">Hook: </span>
          {moment.hook}
        </p>
      ) : null}
      {moment.reason ? (
        <p dir="auto" className="text-sm text-muted-foreground">
          {moment.reason}
        </p>
      ) : null}
      {moment.text ? (
        <p dir="auto" className="line-clamp-4 text-sm text-muted-foreground">
          {moment.text}
        </p>
      ) : null}
    </div>
  );
}

export function ClipStudioLayout({
  moments,
  approved,
  focused,
  tab,
  player,
  clips,
  clipCount,
  momentActions,
  renderLabel,
  renderDisabled,
  className,
  onFocus,
  onToggle,
  onTabChange,
  onRender,
}: ClipStudioLayoutProps) {
  const chosen = new Set(approved);
  const current = moments.find((m) => m.key === focused) ?? moments[0];

  const reviewing = (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="grid content-start gap-3 lg:col-span-3">
        {current ? player : null}
        {current ? <MomentDetail moment={current} actions={momentActions?.(current)} /> : null}
      </div>
      <div className="grid max-h-128 content-start gap-2 overflow-y-auto pr-1 lg:col-span-2">
        {moments.length ? (
          moments.map((moment) => (
            <MomentRow
              key={moment.key}
              moment={moment}
              focused={moment.key === current?.key}
              approved={chosen.has(moment.key)}
              onFocus={() => onFocus(moment.key)}
              onToggle={() => onToggle(moment.key)}
            />
          ))
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No moments found.</p>
        )}
      </div>
    </div>
  );

  return (
    <div data-slot="clip-studio-layout" className={cn("grid gap-4", className)}>
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as ClipStudioTab)}>
        <TabsList variant="line">
          <TabsTrigger value="moments">
            Moments <Badge variant="secondary">{moments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="clips">
            Clips <Badge variant="secondary">{clipCount}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="moments" className="pt-3">
          {reviewing}
        </TabsContent>
        <TabsContent value="clips" className="grid gap-4 pt-3">
          {clips}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-xl border bg-background/95 p-3 backdrop-blur">
        <span className="text-sm text-muted-foreground">
          {chosen.size
            ? `${chosen.size} of ${moments.length} approved`
            : "Approve moments to clip them"}
        </span>
        <Button type="button" disabled={renderDisabled || chosen.size === 0} onClick={onRender}>
          <Scissors /> {renderLabel}
        </Button>
      </div>
    </div>
  );
}
