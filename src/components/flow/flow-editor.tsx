import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type ColorMode,
  type Connection,
  type Edge,
  type IsValidConnection,
} from "@xyflow/react";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FlowBlocks } from "./flow-blocks";
import { FlowConfigPanel, type FlowUploader } from "./flow-config-panel";
import { FlowEpisodes } from "./flow-episodes";
import { FlowTone } from "./flow-look";
import { FlowModelPicks } from "./flow-models";
import { FlowBlockCard, FlowNodeCard } from "./flow-node-card";
import { FlowResults } from "./flow-outputs";
import { FLOW_DRAG_TYPE, FlowPalette } from "./flow-palette";
import { FlowBadge, FlowMediaProvider, useFlowNarrow, type FlowMediaResolver } from "./flow-parts";
import { FlowCounts, FlowLinks, FlowRules, FlowSchema, type FlowSpecs } from "./flow-rules";
import { FlowNodeKind, FlowShape, type FlowCanvasNode } from "./flow-shape";
import { FlowSheet } from "./flow-sheet";
import {
  FlowNodeType,
  FlowRunScope,
  FlowRunStatus,
  type FlowDraft,
  type FlowEpisode,
  type FlowGraph,
  type FlowIssue,
  type FlowModels,
  type FlowNodeSpec,
  type FlowOption,
  type FlowRun,
  type FlowRunAnswer,
  type FlowRunPart,
  type FlowSaveAnswer,
  type FlowStyleOption,
} from "./types";

const NODE_TYPES = { [FlowNodeKind.Node]: FlowNodeCard, [FlowNodeKind.Block]: FlowBlockCard };
const UNTITLED = "Untitled flow";
const LIVE = new Set<FlowRunStatus>([FlowRunStatus.Queued, FlowRunStatus.Running]);

const Sheet = {
  Add: "add",
  Panel: "panel",
} as const;
type Sheet = (typeof Sheet)[keyof typeof Sheet];

export interface FlowEditorProps {
  title: string;
  graph: FlowGraph;
  /** A series' episodes; a flow that is not a series leaves it out. */
  episodes?: FlowEpisode[];
  specs: FlowNodeSpec[];
  models: FlowModels;
  styles: FlowStyleOption[];
  accounts: FlowOption[];
  uploads: Record<string, string>;
  /** The flow's latest run as it goes. */
  run: FlowRun | null;
  saving: boolean;
  running: boolean;
  saveAnswer?: FlowSaveAnswer;
  runAnswer?: FlowRunAnswer;
  onSave: (draft: FlowDraft) => void;
  onRun: (draft: FlowDraft, part: FlowRunPart) => void;
  onCancel: (runId: string) => void;
  upload: FlowUploader;
  onDirtyChange?: (dirty: boolean) => void;
  resolveMedia?: FlowMediaResolver;
  colorMode?: ColorMode;
  /** React Flow asks to keep its attribution unless the host has React Flow Pro. */
  hideAttribution?: boolean;
}

/** A flow on a canvas: nodes to place and link, their settings beside it, its last run on
 *  it. The host saves, runs and uploads; the server checks every flow again. */
export function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowMediaProvider resolve={props.resolveMedia}>
        <FlowCanvas {...props} />
      </FlowMediaProvider>
    </ReactFlowProvider>
  );
}

function FlowCanvas({
  title: initialTitle,
  graph: initialGraph,
  episodes: initialEpisodes,
  specs: specList,
  models,
  styles,
  accounts,
  uploads: initialUploads,
  run,
  saving,
  running,
  saveAnswer,
  runAnswer,
  onSave,
  onRun,
  onCancel,
  upload,
  onDirtyChange,
  colorMode = "dark",
  hideAttribution = false,
}: FlowEditorProps) {
  const specs = useMemo<FlowSpecs>(
    () => Object.fromEntries(specList.map((s) => [s.type, s])),
    [specList],
  );
  const series = initialEpisodes !== undefined;
  const [title, setTitle] = useState(initialTitle);
  const [episodes, setEpisodes] = useState<FlowEpisode[]>(initialEpisodes ?? []);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowCanvasNode>(
    FlowBlocks.ordered(
      initialGraph.nodes.map((n) =>
        FlowShape.node(
          n.id,
          specs[n.type] ?? FlowShape.missing(n.type, initialGraph.edges, n.id),
          n.config,
          n.position,
          n.parent,
        ),
      ),
    ),
  );
  const [startEdges] = useState(() => {
    const types = new Map(initialGraph.nodes.map((n) => [n.id, n.type]));
    return initialGraph.edges.map((e) => FlowShape.edge(e, specs, types));
  });
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(startEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploads, setUploads] = useState(initialUploads);
  const narrow = useFlowNarrow();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [nodesShown, setNodesShown] = useState(true);
  const [panelShown, setPanelShown] = useState(true);
  const canvas = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [sentKey, setSentKey] = useState("");

  const graph = useMemo(() => FlowShape.graph(nodes, edges), [nodes, edges]);
  const graphKey = useMemo(
    () => JSON.stringify([title, graph, episodes]),
    [title, graph, episodes],
  );
  const counts = useMemo(() => FlowCounts.of(graph), [graph]);
  const issues = useMemo<FlowIssue[]>(() => {
    const own = FlowRules.issues(specs, graph);
    return own.length ? own : (saveAnswer?.check?.issues ?? []);
  }, [specs, graph, saveAnswer]);
  const byNode = useMemo(() => {
    const out = new Map<string, FlowIssue[]>();
    for (const issue of issues) out.set(issue.node, [...(out.get(issue.node) ?? []), issue]);
    return out;
  }, [issues]);

  const draft = useCallback(
    (): FlowDraft => ({
      title: title.trim() || UNTITLED,
      graph,
      ...(series ? { episodes } : {}),
    }),
    [title, graph, series, episodes],
  );
  const save = useCallback(() => {
    setSentKey(graphKey);
    onSave(draft());
  }, [graphKey, onSave, draft]);
  const start = useCallback(
    (making: number[] = [], scope: FlowRunPart["scope"] = FlowRunScope.All, node = "") => {
      setSentKey(graphKey);
      onRun(draft(), { making, scope, node });
    },
    [graphKey, onRun, draft],
  );

  const [savedKey, setSavedKey] = useState(graphKey);
  const answer = saveAnswer?.ok ? saveAnswer : runAnswer?.ok ? runAnswer : null;
  const [answered, setAnswered] = useState(answer);
  if (answer !== answered) {
    setAnswered(answer);
    if (answer && sentKey) setSavedKey(sentKey);
  }
  const dirty = graphKey !== savedKey;
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, saving, save]);

  const numbers = useMemo(() => FlowBlocks.numbers(nodes, edges), [nodes, edges]);
  const shown = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        ...(n.data.spec.block ? { style: FlowBlocks.size(n, nodes) } : {}),
        data: {
          ...n.data,
          issues: (byNode.get(n.id) ?? []).map((i) => i.message),
          run: run?.nodes[n.id],
          number: numbers.get(n.id),
          model: FlowModelPicks.label(n.data.spec, n.data.config, models),
        },
      })),
    [nodes, byNode, run, numbers, models],
  );

  const isValidConnection: IsValidConnection = useCallback(
    (c) => FlowLinks.refusal(specs, graph, FlowShape.link(c as Connection)) === null,
    [specs, graph],
  );
  const onConnect = useCallback(
    (c: Connection) => {
      const kinds = new Map(nodes.map((n) => [n.id, n.data.spec.type]));
      setEdges((all) => addEdge(FlowShape.edge(FlowShape.link(c), specs, kinds), all));
    },
    [nodes, specs, setEdges],
  );

  const place = useCallback(
    (type: string, position: { x: number; y: number }): string | null => {
      const spec = specs[type];
      if (!spec || (counts.get(type) ?? 0) >= spec.most) return null;
      const block = spec.block ? undefined : FlowBlocks.at(position, nodes);
      if (block && FlowBlocks.held(block.id, nodes) >= block.data.spec.holds) return null;
      const id = FlowShape.id(type);
      const at = block
        ? { x: position.x - block.position.x, y: position.y - block.position.y }
        : position;
      const node = FlowShape.node(id, spec, FlowSchema.defaults(spec.config), at, block?.id);
      setNodes((all) => [
        ...all.map((n) => ({ ...n, selected: false })),
        { ...node, selected: true },
      ]);
      setSelected(id);
      return id;
    },
    [specs, counts, nodes, setNodes],
  );

  const onNodeDragStop = useCallback(
    (_: unknown, moved: FlowCanvasNode) => {
      if (moved.parentId || moved.data.spec.block) return;
      const block = FlowBlocks.at(
        moved.position,
        nodes.filter((n) => n.id !== moved.id),
      );
      if (!block || FlowBlocks.held(block.id, nodes) >= block.data.spec.holds) return;
      setNodes((all) =>
        FlowBlocks.ordered(
          all.map((n) =>
            n.id === moved.id
              ? {
                  ...n,
                  parentId: block.id,
                  extent: "parent" as const,
                  position: {
                    x: moved.position.x - block.position.x,
                    y: moved.position.y - block.position.y,
                  },
                }
              : n,
          ),
        ),
      );
    },
    [nodes, setNodes],
  );

  const remove = useCallback(
    (ids: string[]) => {
      const gone = new Set(ids);
      for (const n of nodes) if (n.parentId && gone.has(n.parentId)) gone.add(n.id);
      setNodes((all) => all.filter((n) => !gone.has(n.id)));
      setEdges((all) => all.filter((e) => !gone.has(e.source) && !gone.has(e.target)));
      setSelected(null);
    },
    [nodes, setNodes, setEdges],
  );

  const duplicate = useCallback(
    (blockId: string) => {
      const block = nodes.find((n) => n.id === blockId);
      if (!block || (counts.get(block.data.spec.type) ?? 0) >= block.data.spec.most) return;
      const inside = nodes.filter((n) => n.parentId === blockId);
      const ids = new Map([block, ...inside].map((n) => [n.id, FlowShape.id(n.data.spec.type)]));
      const below = FlowBlocks.size(block, nodes).height + FlowBlocks.PAD;
      const copy = (n: FlowCanvasNode, parent?: string) =>
        FlowShape.node(
          ids.get(n.id)!,
          n.data.spec,
          structuredClone(n.data.config),
          parent ? n.position : { x: n.position.x, y: n.position.y + below },
          parent,
        );
      const fresh = ids.get(blockId)!;
      setNodes((all) => [...all, copy(block), ...inside.map((n) => copy(n, fresh))]);
      const kinds = new Map(nodes.map((n) => [n.id, n.data.spec.type]));
      setEdges((all) => [
        ...all,
        ...all
          .filter((e) => ids.has(e.source) && ids.has(e.target))
          .map((e) =>
            FlowShape.edge(
              { ...FlowShape.link(e), source: ids.get(e.source)!, target: ids.get(e.target)! },
              specs,
              kinds,
            ),
          ),
      ]);
    },
    [nodes, counts, specs, setNodes, setEdges],
  );
  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(FLOW_DRAG_TYPE);
      if (type) place(type, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
    },
    [place, screenToFlowPosition],
  );

  const current = shown.find((n) => n.id === selected);
  const results = shown.filter((n) => n.data.spec.type === FlowNodeType.Result);
  const live = run ? LIVE.has(run.status) : false;
  const blocked = live || issues.length > 0 || running;
  const credits = saveAnswer?.credits;
  const error = runAnswer && !runAnswer.ok ? runAnswer.error : saveAnswer?.error;

  const middle = () => {
    const box = canvas.current?.getBoundingClientRect();
    return screenToFlowPosition(
      box ? { x: box.left + box.width / 2, y: box.top + box.height / 3 } : { x: 480, y: 260 },
    );
  };

  const palette = (
    <FlowPalette
      specs={series ? specList : specList.filter((s) => s.type !== FlowNodeType.Episode)}
      counts={counts}
      onAdd={(type) => {
        const placed = place(type, middle());
        setSheet(placed && narrow ? Sheet.Panel : null);
      }}
    />
  );
  const panel = current ? (
    <FlowConfigPanel
      key={current.id}
      spec={current.data.spec}
      config={current.data.config}
      issues={byNode.get(current.id) ?? []}
      run={current.data.run}
      models={models}
      styles={styles}
      uploads={uploads}
      upload={upload}
      onUpload={({ path, media }) => setUploads((all) => ({ ...all, [path]: media }))}
      accounts={accounts}
      onChange={(config) =>
        setNodes((all) =>
          all.map((n) => (n.id === current.id ? { ...n, data: { ...n.data, config } } : n)),
        )
      }
      onDelete={() => remove([current.id])}
      onDuplicate={current.data.spec.block ? () => duplicate(current.id) : undefined}
      onRun={
        blocked
          ? undefined
          : (scope) => start(series && run?.episode != null ? [run.episode] : [], scope, current.id)
      }
    />
  ) : series || results.length ? (
    <>
      {series ? (
        <FlowEpisodes
          episodes={episodes}
          making={live && run ? run.episode : null}
          disabled={blocked}
          onChange={setEpisodes}
          onRun={(making) => start(making)}
        />
      ) : null}
      {results.length ? <FlowResults results={results} /> : null}
    </>
  ) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3 md:gap-3">
        {narrow ? null : (
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={() => setNodesShown((shownNow) => !shownNow)}
            title={nodesShown ? "Hide nodes" : "Show nodes"}
            aria-label={nodesShown ? "Hide nodes" : "Show nodes"}
          >
            {nodesShown ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        )}
        <Input
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          className="h-8 w-32 md:w-56"
          aria-label="Flow name"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!dirty || saving}
          onClick={save}
          title="Ctrl+S"
        >
          {saving ? "Saving" : dirty ? "Save" : "Saved"}
        </Button>
        <div className="flex-1" />
        {error ? <span className="truncate text-[11px] text-destructive">{error}</span> : null}
        {issues.length ? (
          <span title={issues.map((i) => i.message).join("\n")}>
            <FlowBadge tone={FlowTone.Danger}>
              {issues.length}
              <span className="hidden sm:inline">&nbsp;to fix</span>
            </FlowBadge>
          </span>
        ) : null}
        {run ? (
          <FlowBadge
            tone={
              run.status === FlowRunStatus.Error
                ? FlowTone.Danger
                : live
                  ? FlowTone.Brand
                  : FlowTone.Neutral
            }
          >
            {series && run.episode !== null ? `episode ${run.episode + 1} · ` : ""}
            {run.status}
            <span className="hidden sm:inline">&nbsp;· {run.credits} credits</span>
          </FlowBadge>
        ) : null}
        {credits && !live ? (
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            about {credits} credits
          </span>
        ) : null}
        {live && run ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => onCancel(run.id)}>
            Stop
          </Button>
        ) : series ? null : (
          <Button
            type="button"
            size="sm"
            disabled={issues.length > 0 || running}
            onClick={() => start()}
          >
            Run
          </Button>
        )}
        {!narrow && panel ? (
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={() => setPanelShown((shownNow) => !shownNow)}
            title={panelShown ? "Hide settings" : "Show settings"}
            aria-label={panelShown ? "Hide settings" : "Show settings"}
          >
            {panelShown ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1">
        {narrow || !nodesShown ? null : (
          <aside className="w-52 shrink-0 overflow-y-auto border-r border-border bg-card/60">
            {palette}
          </aside>
        )}
        <div
          ref={canvas}
          className="relative min-w-0 flex-1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={shown}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onNodesDelete={(gone) => remove(gone.map((n) => n.id))}
            isValidConnection={isValidConnection}
            onSelectionChange={({ nodes: picked }) => {
              const id = picked[0]?.id ?? null;
              setSelected(id);
              if (narrow && id) setSheet(Sheet.Panel);
            }}
            colorMode={colorMode}
            minZoom={0.2}
            fitView
            proOptions={{ hideAttribution }}
          >
            <Background gap={20} />
            <Controls showInteractive={!narrow} />
            {narrow ? null : <MiniMap pannable zoomable />}
          </ReactFlow>
          {narrow ? (
            <>
              <div className="absolute inset-x-0 bottom-3 z-[5] flex justify-center gap-2">
                <Button type="button" size="sm" onClick={() => setSheet(Sheet.Add)}>
                  Add node
                </Button>
                {panel ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setSheet(Sheet.Panel)}
                  >
                    {current ? "Settings" : series ? "Episodes" : "Result"}
                  </Button>
                ) : null}
              </div>
              {sheet === Sheet.Add ? (
                <FlowSheet title="Add a node" onClose={() => setSheet(null)}>
                  {palette}
                </FlowSheet>
              ) : sheet === Sheet.Panel && panel ? (
                <FlowSheet
                  title={current ? current.data.spec.label : series ? "Episodes" : "Result"}
                  onClose={() => setSheet(null)}
                >
                  {panel}
                </FlowSheet>
              ) : null}
            </>
          ) : null}
        </div>
        {!narrow && panelShown && panel ? (
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card/60">
            {panel}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
