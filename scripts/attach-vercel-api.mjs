#!/usr/bin/env node
/**
 * After Nitro writes `.vercel/output`, fold the origin `api/*.js`
 * handlers into the Build Output so Paystack webhook + Blob catalogue
 * routes survive the TanStack Start deploy (Nitro otherwise swallows
 * the repo-root `api/` folder).
 */
import { mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");

const apiDir = "api";
const configPath = ".vercel/output/config.json";
const outRoot = ".vercel/output/functions";

async function main() {
  if (!existsSync(configPath) || !existsSync(apiDir)) {
    console.log("[attach-api] no vercel output or api/ — skip");
    return;
  }

  const files = readdirSync(apiDir).filter((f) => f.endsWith(".js"));
  const routes = [];

  for (const file of files) {
    const name = file.slice(0, -3);
    const outDir = join(outRoot, "api", `${name}.func`);
    mkdirSync(outDir, { recursive: true });
    await esbuild.build({
      entryPoints: [join(apiDir, file)],
      bundle: true,
      platform: "node",
      format: "cjs",
      outfile: join(outDir, "index.js"),
      logLevel: "warning",
    });
    writeFileSync(
      join(outDir, ".vc-config.json"),
      `${JSON.stringify(
        {
          runtime: "nodejs20.x",
          handler: "index.js",
          launcherType: "Nodejs",
          shouldAddHelpers: true,
        },
        null,
        2,
      )}\n`,
    );
    routes.push({ src: `/api/${name}`, dest: `/api/${name}` });
    console.log(`[attach-api] ${file} -> /api/${name}`);
  }

  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.routes = Array.isArray(config.routes) ? config.routes : [];
  const catchAll = config.routes.findIndex((r) => r.dest === "/__server");
  const insertAt = catchAll === -1 ? config.routes.length : catchAll;
  config.routes.splice(insertAt, 0, ...routes);
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`[attach-api] patched ${routes.length} API route(s)`);
}

main().catch((err) => {
  console.error("[attach-api] failed", err);
  process.exit(1);
});
