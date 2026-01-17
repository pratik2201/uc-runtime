#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";

function detectPM() {
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
}

const pm = detectPM();

console.log(`\nucbuilder init → detected ${pm}\n`);

if (pm === "npm") {
  execSync("npm install ucbuilder", { stdio: "inherit" });
  execSync("npm install -D ucbuilder-devtools", { stdio: "inherit" });
}

if (pm === "pnpm") {
  execSync("pnpm add ucbuilder", { stdio: "inherit" });
  execSync("pnpm add -D ucbuilder-devtools", { stdio: "inherit" });
}

if (pm === "yarn") {
  execSync("yarn add ucbuilder", { stdio: "inherit" });
  execSync("yarn add -D ucbuilder-devtools", { stdio: "inherit" });
}

console.log("\nucbuilder is ready.\nNext: import and init in your Electron main process.");
