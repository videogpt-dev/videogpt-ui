import { describe, expect, it } from "vite-plus/test";

import { CLIP_STEPS, clipStepIndex } from "./types";

describe("clip steps", () => {
  it("keeps stable route order", () => {
    expect(CLIP_STEPS.map((step) => step.slug)).toEqual(["source", "find-moments", "generate"]);
  });

  it("falls back to source for unknown routes", () => {
    expect(clipStepIndex("generate")).toBe(2);
    expect(clipStepIndex("unknown")).toBe(0);
  });
});
