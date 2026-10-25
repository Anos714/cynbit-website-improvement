#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const origin = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const targets = [
  { path: "/", formFactor: "mobile" },
  { path: "/", formFactor: "desktop" },
  { path: "/careers", formFactor: "mobile" },
  { path: "/blog/top-web-development-trends-2026", formFactor: "mobile" },
];

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const root = path.join(os.homedir(), ".cache", "ms-playwright");
  if (!fs.existsSync(root)) return undefined;
  for (const entry of fs.readdirSync(root)) {
    if (!entry.startsWith("chromium-")) continue;
    for (const candidate of ["chrome-linux64/chrome", "chrome-linux/chrome"]) {
      const full = path.join(root, entry, candidate);
      if (fs.existsSync(full)) return full;
    }
  }
  return undefined;
}

const chromePath = findChrome();
if (!chromePath) {
  console.error("No Chromium binary found. Set CHROME_PATH to a Chrome/Chromium executable.");
  process.exit(1);
}

const outputDir = path.join(process.cwd(), "docs", "evidence", "lighthouse");
fs.mkdirSync(outputDir, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const summary = [];

try {
  for (const target of targets) {
    const url = `${origin}${target.path}`;
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      logLevel: "error",
      output: ["json", "html"],
      formFactor: target.formFactor,
      screenEmulation:
        target.formFactor === "desktop"
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : undefined,
      throttlingMethod: "simulate",
      throttling:
        target.formFactor === "desktop"
          ? { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 }
          : undefined,
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });

    const report = runnerResult.report;
    const [jsonReport, htmlReport] = Array.isArray(report) ? report : [report, report];
    const slug = `${target.path === "/" ? "home" : target.path.replace(/^\//, "").replace(/\//g, "-")}-${target.formFactor}`;

    fs.writeFileSync(path.join(outputDir, `${slug}.json`), jsonReport);
    fs.writeFileSync(path.join(outputDir, `${slug}.html`), htmlReport);

    const scores = Object.fromEntries(
      Object.entries(runnerResult.lhr.categories).map(([key, category]) => [
        key,
        Math.round((category.score ?? 0) * 100),
      ]),
    );
    const metrics = runnerResult.lhr.audits;
    summary.push({
      url,
      formFactor: target.formFactor,
      scores,
      lcp: metrics["largest-contentful-paint"]?.displayValue,
      cls: metrics["cumulative-layout-shift"]?.displayValue,
      tbt: metrics["total-blocking-time"]?.displayValue,
      transfer: metrics["total-byte-weight"]?.displayValue,
    });

    console.log(`${target.formFactor.padEnd(7)} ${target.path.padEnd(46)} ${JSON.stringify(scores)}`);
  }
} finally {
  await chrome.kill();
}

fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log(`\nReports written to ${path.relative(process.cwd(), outputDir)}/`);
