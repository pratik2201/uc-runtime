import { build } from "esbuild";
const mainConfig = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  external: ["electron"],
  treeShaking: true,
};
await build({
  entryPoints: ["src/designerFiles/Resources.ts","src/core-main.ts"],
  outdir: "dist",   
  ...mainConfig,
});
await build({
  entryPoints: ["src/core.ts"],
  outfile: "dist/core.js",
  platform: "browser",
  bundle: true,
  format: "esm",
  treeShaking: true,
}); 