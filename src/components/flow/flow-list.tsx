import { useState, type ReactNode } from "react";
import { Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

import type { FlowListItem, FlowStartOption } from "./types";

/** The name field and a button per ready flow a new one may start from. */
export function FlowCreateForm({
  label,
  placeholder,
  starts = [],
  busy,
  onCreate,
}: {
  label: string;
  placeholder: string;
  starts?: FlowStartOption[];
  busy?: boolean;
  onCreate: (title: string, start?: string) => void;
}) {
  const [title, setTitle] = useState("");
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(title, starts[0]?.start);
      }}
    >
      <Input
        value={title}
        placeholder={placeholder}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
        className="w-48"
      />
      {starts.length ? (
        starts.map((choice, i) => (
          <Button
            key={choice.start}
            type="button"
            variant={i === 0 ? "default" : "secondary"}
            disabled={busy}
            title={choice.hint}
            onClick={() => onCreate(title, choice.start)}
          >
            {choice.label}
          </Button>
        ))
      ) : (
        <Button type="submit" disabled={busy}>
          {label}
        </Button>
      )}
    </form>
  );
}

/** Saved flows as cards; the host links each to its page and deletes on request. */
export function FlowList({
  flows,
  empty,
  busy,
  describe = (flow) => (flow.updated_at ? new Date(flow.updated_at).toLocaleDateString() : ""),
  renderLink,
  onDelete,
}: {
  flows: FlowListItem[];
  empty: string;
  busy?: boolean;
  describe?: (flow: FlowListItem) => string;
  renderLink: (flow: FlowListItem, children: ReactNode) => ReactNode;
  onDelete: (id: string) => void;
}) {
  if (flows.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Workflow />
          </EmptyMedia>
          <EmptyTitle>Nothing here yet</EmptyTitle>
          <EmptyDescription>{empty}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {flows.map((flow) => (
        <Card key={flow.id} className="flex flex-row items-center justify-between gap-3 p-4">
          {renderLink(
            flow,
            <>
              <p className="truncate text-sm font-semibold text-foreground">{flow.title}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{describe(flow)}</p>
            </>,
          )}
          <Button
            type="button"
            size="xs"
            variant="ghost"
            disabled={busy}
            onClick={() => onDelete(flow.id)}
          >
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}
