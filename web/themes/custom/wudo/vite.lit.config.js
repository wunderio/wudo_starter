/**
 * @file
 * Vite configuration for Lit library only.
 */
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "lit-entry.js"),
      name: "Lit",
      formats: ["es"],
      fileName: () => "lit-core.bundle.js",
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        inlineDynamicImports: true,
      },
    },
  },
});
