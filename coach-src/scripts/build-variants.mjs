#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..");

const variants = [
  { owner: "mathieu", title: "Coach Muscu — Mathieu", short: "Muscu Mathieu" },
  { owner: "ryan", title: "Coach Muscu — Ryan", short: "Muscu Ryan" }
];

const files = ["app.js", "sw.js", "icon.svg", "icon-192.png", "icon-512.png"];

function replacePlaceholders(html, variant) {
  return html
    .replaceAll("__COACH_APP_TITLE__", variant.title)
    .replaceAll("__COACH_APP_SHORT__", variant.short)
    .replaceAll("__COACH_APP_OWNER__", variant.owner);
}

function writeManifest(dir, variant) {
  const manifest = {
    name: variant.title,
    short_name: variant.short,
    description: "Suivi local des séances de " + (variant.owner === "ryan" ? "Ryan" : "Mathieu") + ".",
    start_url: "./index.html",
    display: "standalone",
    background_color: "#0E1116",
    theme_color: "#F59E0B",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  };
  fs.writeFileSync(path.join(dir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
}

function copyVariant(variant) {
  const dir = path.join(root, "dist-" + variant.owner);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  fs.writeFileSync(path.join(dir, "index.html"), replacePlaceholders(html, variant));
  files.forEach((file) => fs.copyFileSync(path.join(root, file), path.join(dir, file)));
  writeManifest(dir, variant);
  return dir;
}

function zipDir(dir, zipPath, extraExcludes = []) {
  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  const py = `
import os, zipfile
root = ${JSON.stringify(dir)}
out = ${JSON.stringify(zipPath)}
excludes = set(${JSON.stringify(extraExcludes)})
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("dist-mathieu", "dist-ryan", "node_modules", ".git")]
        for name in filenames:
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root)
            if rel in excludes: continue
            z.write(full, rel)
`;
  const result = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "zip failed");
  }
}

const built = variants.map(copyVariant);
const mathieuDir = built[0];
const publicCoach = path.join(workspace, "public", "coach");
fs.rmSync(publicCoach, { recursive: true, force: true });
fs.cpSync(mathieuDir, publicCoach, { recursive: true });

const artifacts = path.join(workspace, "artifacts");
fs.mkdirSync(artifacts, { recursive: true });
zipDir(mathieuDir, path.join(artifacts, "Coach-Muscu-Mathieu-Netlify.zip"));
zipDir(built[1], path.join(artifacts, "Coach-Muscu-Ryan-Netlify.zip"));
zipDir(root, path.join(artifacts, "Coach-Muscu-Perso-Source.zip"));

console.log("Built Mathieu + Ryan variants, preview copy, and zips.");
