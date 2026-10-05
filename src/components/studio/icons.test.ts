import { describe, expect, it } from "vite-plus/test";

import { Icons } from "./icons";

describe("Icons.resolve", () => {
  it("resolves API icon names", () => {
    expect(Icons.resolve("scissors")).toBe(Icons.defaults.scissors);
  });

  it("uses fallback for unknown icon names", () => {
    expect(Icons.resolve("unknown")).toBe(Icons.defaults["panels-top-left"]);
  });
});
