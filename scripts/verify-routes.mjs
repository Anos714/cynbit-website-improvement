import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedStatic = [
  "/",
  "/story",
  "/team",
  "/services",
  "/products",
  "/case-studies",
  "/impact",
  "/bitelevate",
  "/bitelevate/paths",
  "/diaries",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
];

function readCollection(name) {
  const file = path.join(root, "src", "content", "data", `${name}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const expected = new Set(expectedStatic);
for (const [collection, prefix] of [
  ["blog", "/blog"],
  ["case-studies", "/case-studies"],
  ["careers", "/careers"],
  ["diaries", "/diaries"],
]) {
  for (const entry of readCollection(collection)) expected.add(`${prefix}/${entry.slug}`);
}

const sitemapFile = path.join(root, ".next", "server", "app", "sitemap.xml.body");
if (!fs.existsSync(sitemapFile)) {
  throw new Error("Build output is missing. Run `npm run build` before verifying routes.");
}

const sitemap = fs.readFileSync(sitemapFile, "utf8");
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return url.pathname.replace(/\/$/, "") || "/";
  }),
);

const missing = [...expected].filter((route) => !sitemapPaths.has(route));
const extra = [...sitemapPaths].filter((route) => !expected.has(route));
const missingHtml = [...expected].filter((route) => {
  const relative = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  return !fs.existsSync(path.join(root, ".next", "server", "app", relative));
});

if (missing.length || extra.length || missingHtml.length) {
  console.error(
    JSON.stringify(
      { expected: expected.size, sitemap: sitemapPaths.size, missing, extra, missingHtml },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  `Route parity verified: ${expected.size} public sitemap URLs, ${missingHtml.length} missing pages.`,
);
