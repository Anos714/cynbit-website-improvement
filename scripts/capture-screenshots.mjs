#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const origin = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const outputDir = path.join(process.cwd(), "docs", "evidence", "screenshots");
fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  ["home", "/"],
  ["services", "/services"],
  ["case-study", "/case-studies/wizhealth-ai-diagnostic"],
  ["careers", "/careers"],
  ["insight", "/blog/top-web-development-trends-2026"],
  ["contact", "/contact"],
];

const browser = await chromium.launch();

try {
  for (const [name, route] of pages) {
    for (const [suffix, viewport] of [
      ["desktop", { width: 1440, height: 1000 }],
      ["mobile", { width: 412, height: 915 }],
    ]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const file = path.join(outputDir, `${name}-${suffix}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log(`${path.relative(process.cwd(), file)}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
