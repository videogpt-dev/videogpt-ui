import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  pack: {
    entry: ["src/index.ts"],
    outDir: "dist-lib",
    dts: { build: true },
    format: ["esm"],
    sourcemap: true,
    deps: {
      neverBundle: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
});
