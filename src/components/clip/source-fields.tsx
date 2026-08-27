import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClipCreateCopy, ClipSourceKind } from "./types";

export interface ClipSourceFieldsProps {
  source: ClipSourceKind;
  copy: ClipCreateCopy;
  onSourceChange: (source: ClipSourceKind) => void;
  className?: string;
}

function SourceToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-muted text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ClipSourceFields({
  source,
  copy,
  onSourceChange,
  className,
}: ClipSourceFieldsProps) {
  return (
    <div data-slot="clip-source-fields" className={cn("flex flex-col gap-4", className)}>
      <div>
        <CardTitle>{copy.sourceTitle}</CardTitle>
        <CardDescription>{copy.sourceDescription}</CardDescription>
      </div>
      <div className="flex gap-2">
        <SourceToggle active={source === "url"} onClick={() => onSourceChange("url")}>
          {copy.urlSource}
        </SourceToggle>
        <SourceToggle active={source === "file"} onClick={() => onSourceChange("file")}>
          {copy.fileSource}
        </SourceToggle>
      </div>
      <Field className={cn(source !== "url" && "hidden")}>
        <FieldLabel htmlFor="clip-source-url">{copy.urlLabel}</FieldLabel>
        <Input id="clip-source-url" name="url" type="url" placeholder={copy.urlPlaceholder} />
      </Field>
      <Field className={cn(source !== "file" && "hidden")}>
        <FieldLabel htmlFor="clip-source-file">{copy.fileLabel}</FieldLabel>
        <Input id="clip-source-file" name="file" type="file" accept="video/*" />
      </Field>
    </div>
  );
}
import type { ReactNode } from "react";
