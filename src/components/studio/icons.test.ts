import { describe, expect, it } from "vite-plus/test";

import { defaultIcons, resolveIcon } from "./icons";

describe("resolveIcon", () => {
  it("resolves API icon names", () => {
    expect(resolveIcon("scissors")).toBe(defaultIcons.scissors);
  });

  it("uses fallback for unknown icon names", () => {
    expect(resolveIcon("unknown")).toBe(defaultIcons["panels-top-left"]);
  });
});
