import { defineConfig } from "tsup";

export default defineConfig([
  // TypeScript declarations only
  {
    entry: ["src/index.ts", "src/core.ts", "src/locale/*.ts", "src/cli.ts"],
    dts: { only: true },
    outDir: "dist",
  },
  // JavaScript builds
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    clean: true,
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/core.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/de.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/fr.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/hi.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/ar.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/zh.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/sv.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/ru.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/locale/emoji.ts"],
    format: ["esm", "cjs"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    minify: true,
    sourcemap: false,
    outDir: "dist",
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
