import { describe, expect, it } from "vite-plus/test";

import { FlowBlocks } from "./flow-blocks";
import { AUTO_MODEL, FlowModelPicks } from "./flow-models";
import { FlowLinks, FlowRules, FlowSchema, type FlowSpecs } from "./flow-rules";
import { FlowShape } from "./flow-shape";
import {
  FlowNodeGroup,
  FlowPortType,
  type FlowGraph,
  type FlowNodeSpec,
  type FlowPort,
} from "./types";

const port = (name: string, type: FlowPortType, extra: Partial<FlowPort> = {}): FlowPort => ({
  name,
  label: name,
  type,
  required: false,
  many: false,
  most: 0,
  ...extra,
});

const spec = (type: string, extra: Partial<FlowNodeSpec> = {}): FlowNodeSpec => ({
  type,
  group: FlowNodeGroup.Generate,
  label: type,
  description: "",
  inputs: [],
  outputs: [],
  config: {},
  media: null,
  needs: [],
  host: false,
  one_of: [],
  apart: [],
  most: 10,
  block: false,
  chain: "",
  holds: 0,
  ...extra,
});

const SPECS: FlowSpecs = {
  "input.text": spec("input.text", { outputs: [port("text", FlowPortType.Text)] }),
  "generate.image": spec("generate.image", {
    inputs: [port("prompt", FlowPortType.Text, { required: true })],
    outputs: [port("image", FlowPortType.Image)],
    config: {
      properties: {
        seed: { type: "integer", minimum: 0, default: 0 },
        model: { type: "object", widget: "model", media: "image" },
      },
    },
  }),
};

const graph = (edges: FlowGraph["edges"] = []): FlowGraph => ({
  nodes: [
    { id: "a", type: "input.text", config: {}, position: { x: 0, y: 0 } },
    { id: "b", type: "generate.image", config: {}, position: { x: 0, y: 0 } },
  ],
  edges,
});

describe("FlowLinks.refusal", () => {
  it("takes a link between ports of one type", () => {
    const link = { source: "a", source_port: "text", target: "b", target_port: "prompt" };
    expect(FlowLinks.refusal(SPECS, graph(), link)).toBeNull();
  });

  it("refuses a second link into a single input", () => {
    const link = { source: "a", source_port: "text", target: "b", target_port: "prompt" };
    expect(FlowLinks.refusal(SPECS, graph([link]), link)).toBe("prompt takes one link.");
  });

  it("refuses a node feeding itself and ports of different types", () => {
    const self = { source: "b", source_port: "image", target: "b", target_port: "prompt" };
    expect(FlowLinks.refusal(SPECS, graph(), self)).toBe("A node cannot feed itself.");
    const mixed = graph();
    mixed.nodes.push({ id: "c", type: "generate.image", config: {}, position: { x: 0, y: 0 } });
    const link = { source: "c", source_port: "image", target: "b", target_port: "prompt" };
    expect(FlowLinks.refusal(SPECS, mixed, link)).toBe(
      "image (image) cannot go into prompt (text).",
    );
  });
});

describe("a clip's speech", () => {
  const video = spec("generate.video", {
    inputs: [port("dialogue", FlowPortType.Text), port("audio", FlowPortType.Audio)],
    apart: ["dialogue", "audio"],
  });
  const specs: FlowSpecs = {
    ...SPECS,
    "input.audio": spec("input.audio", { outputs: [port("audio", FlowPortType.Audio)] }),
    "generate.video": video,
  };
  const speech: FlowGraph = {
    nodes: [
      { id: "a", type: "input.text", config: {}, position: { x: 0, y: 0 } },
      { id: "s", type: "input.audio", config: {}, position: { x: 0, y: 0 } },
      { id: "v", type: "generate.video", config: {}, position: { x: 0, y: 0 } },
    ],
    edges: [{ source: "a", source_port: "text", target: "v", target_port: "dialogue" }],
  };

  it("takes a spoken line or an audio, not both", () => {
    const audio = { source: "s", source_port: "audio", target: "v", target_port: "audio" };
    expect(FlowLinks.refusal(specs, speech, audio)).toBe("Use dialogue or audio, not both.");
    const both = { ...speech, edges: [...speech.edges, audio] };
    expect(FlowRules.issues(specs, both).map((i) => i.message)).toContain(
      "generate.video: use dialogue or audio, not both.",
    );
  });
});

describe("FlowRules.issues", () => {
  it("names a required input left open and a setting out of range", () => {
    const open = graph();
    open.nodes[1].config = { seed: -1 };
    const messages = FlowRules.issues(SPECS, open).map((i) => i.message);
    expect(messages).toContain("generate.image needs prompt.");
    expect(messages).toContain("generate.image: At least 0.");
  });
});

describe("FlowSchema.defaults", () => {
  it("fills each setting that has a default", () => {
    expect(FlowSchema.defaults(SPECS["generate.image"].config)).toEqual({ seed: 0 });
  });
});

describe("FlowModelPicks.label", () => {
  it("shows Automatic until a model is picked, then its name", () => {
    const models = { image: [{ provider: "p", model: "m", name: "Painter", credits: 2 }] };
    const node = SPECS["generate.image"];
    expect(FlowModelPicks.label(node, {}, models)).toBe(AUTO_MODEL);
    expect(FlowModelPicks.label(node, { model: { provider: "p", model: "m" } }, models)).toBe(
      "Painter",
    );
  });
});

describe("FlowBlocks.numbers", () => {
  it("numbers scenes along their chain", () => {
    const scene = spec("story.scene", { block: true, chain: "film" });
    const nodes = ["s2", "s1"].map((id) => FlowShape.node(id, scene, {}, { x: 0, y: 0 }));
    const edges = [{ id: "e", source: "s1", target: "s2", targetHandle: "film" }];
    const numbers = FlowBlocks.numbers(nodes, edges);
    expect([numbers.get("s1"), numbers.get("s2")]).toEqual([1, 2]);
  });
});
