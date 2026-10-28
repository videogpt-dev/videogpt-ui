import { useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AUTO_MODEL, FlowModelPicks, type FlowModelPick } from "./flow-models";
import { FlowNodeOutputs, FlowValuePreview } from "./flow-outputs";
import { FlowEyebrow, FlowSelect } from "./flow-parts";
import { FlowPicker } from "./flow-picker";
import { FlowSchema } from "./flow-rules";
import {
  FlowNodeGroup,
  FlowRunScope,
  FlowUploadKind,
  FlowWidget,
  type FlowIssue,
  type FlowModel,
  type FlowModels,
  type FlowNodeSpec,
  type FlowOption,
  type FlowRunNode,
  type FlowSchemaField,
  type FlowStyleOption,
  type FlowUploaded,
} from "./types";

export type FlowUploader = (kind: FlowUploadKind, file: File) => Promise<FlowUploaded>;

const ACCEPT: Record<FlowUploadKind, string> = {
  [FlowUploadKind.Image]: "image/*",
  [FlowUploadKind.Video]: "video/*",
  [FlowUploadKind.Audio]: "audio/*",
};

const PanelTab = {
  Settings: "settings",
  Output: "output",
} as const;
type PanelTab = (typeof PanelTab)[keyof typeof PanelTab];

const TAB_LABELS: Record<PanelTab, string> = {
  [PanelTab.Settings]: "Settings",
  [PanelTab.Output]: "Output",
};

class FlowText {
  static shown(value: unknown, fallback?: unknown): string {
    const v = value ?? fallback;
    return typeof v === "string" || typeof v === "number" ? String(v) : "";
  }
}

function ModelField({
  models,
  value,
  onChange,
}: {
  models: FlowModel[];
  value: FlowModelPick;
  onChange: (pick: FlowModelPick) => void;
}) {
  const key = FlowModelPicks.key(value);
  const gone = key && !FlowModelPicks.find(models, key);
  const items = [
    { value: "", label: AUTO_MODEL },
    ...(gone ? [{ value: key, label: value.model ?? "", hint: "Not available now" }] : []),
    ...models.map((m) => ({
      value: FlowModelPicks.key(m),
      label: m.name,
      hint: FlowModelPicks.price(m),
    })),
  ];
  return (
    <FlowPicker
      items={items}
      value={key}
      placeholder="Search models"
      onChange={(picked) => {
        const model = FlowModelPicks.find(models, picked);
        onChange(model ? { provider: model.provider, model: model.model } : {});
      }}
    />
  );
}

function UploadField({
  kind,
  value,
  link,
  upload,
  onChange,
}: {
  kind: FlowUploadKind;
  value: string;
  link?: string;
  upload: FlowUploader;
  onChange: (uploaded: FlowUploaded) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="space-y-1.5">
      <input
        ref={input}
        type="file"
        accept={ACCEPT[kind]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          setError("");
          upload(kind, file)
            .then(onChange)
            .catch((failure: unknown) =>
              setError(failure instanceof Error ? failure.message : "The upload failed."),
            )
            .finally(() => setBusy(false));
        }}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="xs"
          variant="secondary"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          {busy ? "Uploading" : value ? "Replace" : "Upload"}
        </Button>
        {value ? (
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {value.split("/").pop()}
          </span>
        ) : null}
      </div>
      {value && link ? <FlowValuePreview value={{ media: link }} type={kind} /> : null}
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}

function ConfigField({
  field,
  value,
  onChange,
  models,
  styles,
  uploads,
  upload,
  onUpload,
  accounts,
  uploadKind,
}: {
  field: FlowSchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
  models: FlowModels;
  styles: FlowStyleOption[];
  uploads: Record<string, string>;
  upload: FlowUploader;
  onUpload: (uploaded: FlowUploaded) => void;
  accounts: FlowOption[];
  uploadKind: FlowUploadKind;
}) {
  if (field.widget === FlowWidget.Model) {
    return (
      <ModelField
        models={models[field.media ?? ""] ?? []}
        value={(value as FlowModelPick) ?? {}}
        onChange={onChange}
      />
    );
  }
  if (field.widget === FlowWidget.Upload) {
    const path = FlowText.shown(value);
    return (
      <UploadField
        kind={uploadKind}
        value={path}
        link={uploads[path]}
        upload={upload}
        onChange={(uploaded) => {
          onUpload(uploaded);
          onChange(uploaded.path);
        }}
      />
    );
  }
  if (field.widget === FlowWidget.Style) {
    return (
      <FlowSelect value={FlowText.shown(value)} onChange={(e) => onChange(e.target.value)}>
        <option value="">None</option>
        {styles.map((s) => (
          <option key={s.key} value={s.key}>
            {s.name}
          </option>
        ))}
      </FlowSelect>
    );
  }
  if (field.widget === FlowWidget.Account) {
    return (
      <FlowSelect value={FlowText.shown(value)} onChange={(e) => onChange(e.target.value)}>
        <option value="">Pick an account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title}
          </option>
        ))}
      </FlowSelect>
    );
  }
  if (field.enum) {
    const options = field.enum;
    return (
      <FlowSelect
        value={FlowText.shown(value, field.default)}
        onChange={(e) => {
          const picked = options.find((v) => String(v) === e.target.value);
          onChange(picked ?? e.target.value);
        }}
      >
        {options.map((v) => (
          <option key={String(v)} value={String(v)}>
            {field.labels?.[String(v)] ?? String(v)}
          </option>
        ))}
      </FlowSelect>
    );
  }
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-xs text-foreground">
        <Checkbox
          checked={Boolean(value ?? field.default)}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        On
      </label>
    );
  }
  if (field.type === "integer" || field.type === "number") {
    return (
      <Input
        type="number"
        value={FlowText.shown(value, field.default)}
        min={field.minimum}
        max={field.maximum}
        step={field.type === "integer" ? 1 : "any"}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    );
  }
  if (field.widget === FlowWidget.Textarea) {
    return (
      <Textarea
        value={FlowText.shown(value, field.default)}
        maxLength={field.maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <Input
      value={FlowText.shown(value, field.default)}
      maxLength={field.maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** The picked node: its settings (checked as they are typed), its problems, and what it made
 *  in the last run. */
export function FlowConfigPanel({
  spec,
  config,
  issues,
  run,
  models,
  styles,
  uploads,
  upload,
  onUpload,
  accounts,
  onChange,
  onDelete,
  onDuplicate,
  onRun,
}: {
  spec: FlowNodeSpec;
  config: Record<string, unknown>;
  issues: FlowIssue[];
  run?: FlowRunNode;
  models: FlowModels;
  styles: FlowStyleOption[];
  uploads: Record<string, string>;
  upload: FlowUploader;
  onUpload: (uploaded: FlowUploaded) => void;
  accounts: FlowOption[];
  onChange: (config: Record<string, unknown>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onRun?: (scope: FlowRunScope) => void;
}) {
  const [tab, setTab] = useState<PanelTab>(PanelTab.Settings);
  const errors = FlowSchema.errors(spec, config);
  const required = new Set(spec.config.required ?? []);
  const uploadKind = (spec.outputs[0]?.type as FlowUploadKind | undefined) ?? FlowUploadKind.Image;
  const general = issues.filter((i) => !i.field || !(i.field in (spec.config.properties ?? {})));
  const tabs: PanelTab[] = spec.group === FlowNodeGroup.Input ? [] : Object.values(PanelTab);
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <FlowEyebrow>{spec.group}</FlowEyebrow>
          <h2 className="text-sm font-semibold text-foreground">{spec.label}</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{spec.description}</p>
        </div>
        <div className="flex gap-1">
          {onDuplicate ? (
            <Button type="button" size="xs" variant="secondary" onClick={onDuplicate}>
              Duplicate
            </Button>
          ) : null}
          <Button type="button" size="xs" variant="ghost" onClick={onDelete}>
            Remove
          </Button>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          size="xs"
          disabled={!onRun}
          onClick={() => onRun?.(FlowRunScope.Node)}
          title="Runs only this node, on the last results before it"
        >
          Run this
        </Button>
        <Button
          type="button"
          size="xs"
          variant="secondary"
          disabled={!onRun}
          onClick={() => onRun?.(FlowRunScope.From)}
          title="Runs this node and every node after it"
        >
          Run from here
        </Button>
      </div>
      {general.length ? (
        <Alert variant="destructive">
          {general.map((i) => (
            <p key={i.message}>{i.message}</p>
          ))}
        </Alert>
      ) : null}
      {tabs.length ? (
        <nav className="flex gap-1 border-b border-border pb-2">
          {tabs.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                value === tab
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {TAB_LABELS[value]}
            </button>
          ))}
        </nav>
      ) : null}
      {tab === PanelTab.Output ? (
        run?.error || Object.keys(run?.outputs ?? {}).length ? (
          <div className="space-y-2">
            {run?.error ? <p className="text-[11px] text-destructive">{run.error}</p> : null}
            {run ? <FlowNodeOutputs spec={spec} run={run} /> : null}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">Run it to see what it makes.</p>
        )
      ) : null}
      {tab === PanelTab.Settings &&
        FlowSchema.fields(spec.config).map(([name, field]) => {
          const server = issues.find((i) => i.field === name)?.message;
          const error = errors[name] ?? server;
          return (
            <div key={name} className="space-y-1">
              <p className="text-xs font-medium text-foreground">
                {`${field.title ?? name}${required.has(name) ? " *" : ""}`}
              </p>
              <ConfigField
                field={field}
                value={config[name]}
                onChange={(value) => onChange({ ...config, [name]: value })}
                models={models}
                styles={styles}
                uploads={uploads}
                upload={upload}
                onUpload={onUpload}
                accounts={accounts}
                uploadKind={uploadKind}
              />
              {field.description ? (
                <p className="text-[11px] text-muted-foreground">{field.description}</p>
              ) : null}
              {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
            </div>
          );
        })}
    </div>
  );
}
