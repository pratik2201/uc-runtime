import { build } from "esbuild";
const mainConfig = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  external: ["electron", "ap-shared-core"],
  treeShaking: true,
  sourcemap: true
};
await build({
  entryPoints: ["src/designerFiles/Resources.ts", "src/core-main.ts"],
  outdir: "dist",
  ...mainConfig,
});
await build({
  entryPoints: ["src/core.ts"],
  outfile: "dist/core.js",
  platform: "browser",
  bundle: true,
  external: ["ap-shared-core"],
  format: "esm",
  treeShaking: true,
}); 