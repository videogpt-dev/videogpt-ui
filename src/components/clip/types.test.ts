import { describe, expect, it } from "vite-plus/test";

import { ClipSteps } from "./types";

describe("clip steps", () => {
  it("keeps stable route order", () => {
    expect(ClipSteps.all.map((step) => step.slug)).toEqual(["source", "find-moments", "generate"]);
  });

  it("falls back to source for unknown routes", () => {
    expect(ClipSteps.index("generate")).toBe(2);
    expect(ClipSteps.index("unknown")).toBe(0);
  });
});
