import { FlowSchema } from "./flow-rules";
import { FlowWidget, type FlowModel, type FlowModels, type FlowNodeSpec } from "./types";

export const AUTO_MODEL = "Automatic";

export type FlowModelPick = { provider?: string; model?: string };

/** A node's model pick, held in one picker value so the provider never shows. */
export class FlowModelPicks {
  static key(pick: FlowModelPick): string {
    return pick.model ? `${pick.provider ?? ""} ${pick.model}` : "";
  }

  static find(models: FlowModel[], key: string): FlowModel | undefined {
    return models.find((m) => FlowModelPicks.key(m) === key);
  }

  static price(model: FlowModel): string | undefined {
    if (model.credits === null) return model.own_key ? "Your key" : undefined;
    return `${model.credits} credits${model.per ? `/${model.per}` : ""}`;
  }

  static label(
    spec: FlowNodeSpec,
    config: Record<string, unknown>,
    models: FlowModels,
  ): string | null {
    const [name, field] =
      FlowSchema.fields(spec.config).find(([, f]) => f.widget === FlowWidget.Model) ?? [];
    if (!name || !field) return null;
    const pick = (config[name] ?? {}) as FlowModelPick;
    if (!pick.model) return AUTO_MODEL;
    const found = FlowModelPicks.find(models[field.media ?? ""] ?? [], FlowModelPicks.key(pick));
    return found?.name ?? pick.model;
  }
}
