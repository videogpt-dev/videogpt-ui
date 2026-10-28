import type {
  FlowConfigSchema,
  FlowGraph,
  FlowGraphEdge,
  FlowIssue,
  FlowNodeSpec,
  FlowSchemaField,
} from "./types";

export type FlowSpecs = Record<string, FlowNodeSpec>;

/** Settings read from a node's schema. Shown errors only; the server checks again. */
export class FlowSchema {
  static resolve(field: FlowSchemaField, schema: FlowConfigSchema): FlowSchemaField {
    const ref = field.$ref ?? field.allOf?.[0]?.$ref;
    if (!ref) return field;
    const target = schema.$defs?.[ref.split("/").pop() ?? ""] ?? {};
    return { ...target, ...field, $ref: undefined, allOf: undefined };
  }

  static fields(schema: FlowConfigSchema): [string, FlowSchemaField][] {
    return Object.entries(schema.properties ?? {}).map(([name, f]) => [
      name,
      FlowSchema.resolve(f, schema),
    ]);
  }

  static defaults(schema: FlowConfigSchema): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [name, field] of FlowSchema.fields(schema)) {
      if (field.default !== undefined) out[name] = field.default;
    }
    return out;
  }

  static fieldError(field: FlowSchemaField, value: unknown, required: boolean): string | null {
    const empty = value === undefined || value === null || value === "";
    if (empty) return required ? "Required." : null;
    if (field.enum) return field.enum.includes(value as never) ? null : "Pick one of the options.";
    switch (field.type) {
      case "string": {
        if (typeof value !== "string") return "Must be text.";
        if (field.minLength !== undefined && value.trim().length < field.minLength)
          return "Required.";
        if (field.maxLength !== undefined && value.length > field.maxLength) {
          return `At most ${field.maxLength} characters.`;
        }
        if (field.pattern && !new RegExp(field.pattern).test(value)) return "Not a valid value.";
        return null;
      }
      case "integer":
      case "number": {
        if (typeof value !== "number" || !Number.isFinite(value)) return "Must be a number.";
        if (field.type === "integer" && !Number.isInteger(value)) return "Must be a whole number.";
        if (field.minimum !== undefined && value < field.minimum)
          return `At least ${field.minimum}.`;
        if (field.maximum !== undefined && value > field.maximum)
          return `At most ${field.maximum}.`;
        return null;
      }
      case "boolean":
        return typeof value === "boolean" ? null : "Must be on or off.";
      case "object":
        return typeof value === "object" ? null : "Not a valid value.";
      default:
        return null;
    }
  }

  static errors(spec: FlowNodeSpec, config: Record<string, unknown>): Record<string, string> {
    const required = new Set(spec.config.required ?? []);
    const out: Record<string, string> = {};
    for (const [name, field] of FlowSchema.fields(spec.config)) {
      const value = name in config ? config[name] : field.default;
      const error = FlowSchema.fieldError(field, value, required.has(name));
      if (error) out[name] = error;
    }
    return out;
  }
}

/** Which links may be drawn: by port type, one link per single input, inside their scene,
 *  and never in a circle. */
export class FlowLinks {
  static refusal(specs: FlowSpecs, graph: FlowGraph, link: FlowGraphEdge): string | null {
    const types = new Map(graph.nodes.map((n) => [n.id, n.type]));
    const source = specs[types.get(link.source) ?? ""];
    const target = specs[types.get(link.target) ?? ""];
    const out = source?.outputs.find((p) => p.name === link.source_port);
    const into = target?.inputs.find((p) => p.name === link.target_port);
    if (!out || !into) return "That port is gone.";
    if (link.source === link.target) return "A node cannot feed itself.";
    if (out.type !== into.type)
      return `${out.label} (${out.type}) cannot go into ${into.label} (${into.type}).`;
    if (FlowLinks.crosses(specs, graph, link)) return "Links stay inside their scene.";
    const taken = graph.edges.filter(
      (e) => e.target === link.target && e.target_port === link.target_port,
    ).length;
    if (taken && !into.many) return `${into.label} takes one link.`;
    if (into.most && taken >= into.most) return `${into.label} takes at most ${into.most}.`;
    if (FlowLinks.reaches(graph.edges, link.target, link.source))
      return "Links cannot run in a circle.";
    return null;
  }

  static crosses(specs: FlowSpecs, graph: FlowGraph, link: FlowGraphEdge): boolean {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    const source = byId.get(link.source);
    const target = byId.get(link.target);
    const block = (id?: string) => Boolean(id && specs[byId.get(id)?.type ?? ""]?.block);
    if (!source || !target) return false;
    const targetSpec = specs[target.type];
    if (targetSpec?.block) {
      if (link.target_port === targetSpec.chain) return !block(source.id) || Boolean(source.parent);
      return source.parent !== target.id;
    }
    if (source.parent) return source.parent !== target.parent;
    return block(source.id) && Boolean(target.parent);
  }

  static reaches(edges: FlowGraphEdge[], from: string, to: string): boolean {
    const seen = new Set<string>();
    const stack = [from];
    while (stack.length) {
      const id = stack.pop()!;
      if (id === to) return true;
      if (seen.has(id)) continue;
      seen.add(id);
      for (const e of edges) if (e.source === id) stack.push(e.target);
    }
    return false;
  }
}

export class FlowCounts {
  static of(graph: FlowGraph): Map<string, number> {
    const counts = new Map<string, number>();
    for (const node of graph.nodes) counts.set(node.type, (counts.get(node.type) ?? 0) + 1);
    return counts;
  }
}

/** What the canvas shows wrong with a flow as it is edited. The server checks the same and
 *  more on save and run, so this is never what keeps a flow safe. */
export class FlowRules {
  static issues(specs: FlowSpecs, graph: FlowGraph): FlowIssue[] {
    const issues: FlowIssue[] = [];
    const add = (node: string, message: string, field = "") =>
      issues.push({ code: "client", message, node, edge: -1, field });
    if (!graph.nodes.length) add("", "Add a node to start.");
    const counts = new Map<string, number>();
    for (const node of graph.nodes) {
      const spec = specs[node.type];
      if (!spec) {
        add(node.id, "This node is not available on this account.");
        continue;
      }
      const count = (counts.get(node.type) ?? 0) + 1;
      counts.set(node.type, count);
      if (count === spec.most + 1) add(node.id, `At most ${spec.most} ${spec.label} nodes.`);
      if (spec.block && graph.nodes.filter((n) => n.parent === node.id).length > spec.holds) {
        add(node.id, `${spec.label} holds at most ${spec.holds} nodes.`);
      }
      for (const [field, message] of Object.entries(FlowSchema.errors(spec, node.config))) {
        add(node.id, `${spec.label}: ${message}`, field);
      }
      const linked = (port: string) =>
        graph.edges.some((e) => e.target === node.id && e.target_port === port);
      for (const port of spec.inputs) {
        if (port.required && !linked(port.name))
          add(node.id, `${spec.label} needs ${port.label}.`, port.name);
      }
      if (spec.one_of.length && !spec.one_of.some(linked)) {
        const labels = spec.inputs.filter((p) => spec.one_of.includes(p.name)).map((p) => p.label);
        add(node.id, `${spec.label} needs ${labels.join(" or ")}.`);
      }
    }
    return issues;
  }
}
