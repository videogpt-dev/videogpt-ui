import { ArrowUpRight, Check, Clock3, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { resolveIcon } from "./icons";
import type { IconRegistry, SegmentDefinition } from "./types";

const statusMeta = {
  available: { label: "Available", icon: Check },
  planned: { label: "Planned", icon: Clock3 },
  disabled: { label: "Unavailable", icon: LockKeyhole },
} as const;

export interface SegmentCardProps {
  segment: SegmentDefinition;
  icons?: IconRegistry;
  selected?: boolean;
  featureLimit?: number;
  actionLabel?: string;
  onSelect?: (segment: SegmentDefinition) => void;
  className?: string;
}

export function SegmentCard({
  segment,
  icons,
  selected = false,
  featureLimit = 4,
  actionLabel = "Open",
  onSelect,
  className,
}: SegmentCardProps) {
  const Icon = resolveIcon(segment.icon, icons);
  const status = statusMeta[segment.status];
  const StatusIcon = status.icon;
  const enabled = segment.status === "available";

  return (
    <Card
      data-slot="vui-segment-card"
      data-status={segment.status}
      data-selected={selected || undefined}
      className={cn(
        "relative min-h-96 border border-transparent bg-card/90 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg data-[selected=true]:border-vui-brand/40 data-[selected=true]:ring-3 data-[selected=true]:ring-vui-brand/10",
        className,
      )}
    >
      <CardHeader className="grid grid-cols-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-vui-brand/10 text-vui-brand ring-1 ring-vui-brand/15">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <Badge variant="outline" className="gap-1 border-foreground/10 bg-background/80">
            <StatusIcon data-icon="inline-start" />
            {status.label}
          </Badge>
        </div>
        <div className="grid gap-1.5">
          <CardTitle className="text-md">{segment.label}</CardTitle>
          <CardDescription className="max-w-none leading-relaxed">
            {segment.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          Features
        </div>
        <ul className="grid gap-2.5">
          {segment.features.slice(0, featureLimit).map((feature) => {
            const FeatureIcon = resolveIcon(feature.icon, icons);
            return (
              <li key={feature.code_name} className="flex items-center gap-2 text-xs">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground/8 text-foreground/70">
                  <FeatureIcon className="size-2" aria-hidden="true" />
                </span>
                <span className="truncate">{feature.name}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">{segment.code_name}</span>
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          disabled={!enabled}
          onClick={() => onSelect?.(segment)}
        >
          {actionLabel}
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
