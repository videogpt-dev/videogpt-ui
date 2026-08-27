import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StoryLockedNoticeProps {
  description: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

export function StoryLockedNotice({
  description,
  actionLabel,
  onAction,
  className,
}: StoryLockedNoticeProps) {
  return (
    <div
      data-slot="story-locked-notice"
      className={cn(
        "flex flex-col items-center gap-3 rounded-md border border-dashed py-10 text-center",
        className,
      )}
    >
      <div className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <Lock size={18} />
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button variant="outline" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
