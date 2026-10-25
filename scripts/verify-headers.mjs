#!/usr/bin/env node
const baseUrl = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const failures = [];
const notes = [];

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}`);
    return;
  }
  console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  failures.push(name);
}

async function get(path, { read = false } = {}) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (!read && response.body) await response.body.cancel();
  return response;
}

function header(response, name) {
  return response.headers.get(name) ?? "";
}

async function checkHtml(path) {
  const response = await get(path);
  console.log(`\n${path} -> ${response.status}`);
  check(`${path} returns 200`, response.status === 200, `got ${response.status}`);

  const cache = header(response, "cache-control");
  check(
    `${path} is edge-cached for 300s with SWR`,
    /s-maxage=300/.test(cache) && /stale-while-revalidate=86400/.test(cache),
    cache || "missing Cache-Control",
  );

  const cspName = response.headers.has("content-security-policy-report-only")
    ? "content-security-policy-report-only"
    : "content-security-policy";
  const csp = header(response, cspName);
  check(`${path} ships a CSP (${cspName})`, csp.length > 0, "missing CSP");
  check(`${path} CSP has default-src 'self'`, /default-src 'self'/.test(csp));
  check(`${path} CSP blocks framing`, /frame-ancestors 'none'/.test(csp));
  check(`${path} CSP blocks plugins`, /object-src 'none'/.test(csp));
  check(`${path} CSP reports violations`, /report-uri \/api\/csp-report/.test(csp));

  check(`${path} hides X-Powered-By`, !response.headers.has("x-powered-by"));
  check(`${path} sends HSTS`, /max-age=\d{7,}/.test(header(response, "strict-transport-security")));
  check(`${path} sends nosniff`, header(response, "x-content-type-options") === "nosniff");
  check(`${path} denies framing`, header(response, "x-frame-options") === "DENY");
  check(`${path} sends referrer policy`, header(response, "referrer-policy") === "strict-origin-when-cross-origin");
  check(`${path} sends permissions policy`, /camera=\(\)/.test(header(response, "permissions-policy")));
  check(`${path} sends COOP`, header(response, "cross-origin-opener-policy") === "same-origin");
  check(`${path} sends CORP`, header(response, "cross-origin-resource-policy") === "same-origin");
  check(`${path} has no wildcard CORS`, !/^\*$/.test(header(response, "access-control-allow-origin")));

  if (response.headers.has("content-security-policy")) {
    notes.push(`${path} enforces CSP (CSP_ENFORCE=true).`);
  }
}

async function checkStatic() {
  const home = await get("/", { read: true });
  const match = (await home.text()).match(/\/_next\/static\/[^"']+?\.(?:js|css)/);
  if (!match) {
    console.log("\n_next/static -> skipped (no static asset referenced on /)");
    return;
  }
  const response = await get(match[0]);
  console.log(`\n${match[0]} -> ${response.status}`);
  check("static asset returns 200", response.status === 200, `got ${response.status}`);
  check(
    "static asset is immutable",
    /max-age=31536000/.test(header(response, "cache-control")) &&
      /immutable/.test(header(response, "cache-control")),
    header(response, "cache-control") || "missing Cache-Control",
  );
}

async function checkEndpoint(path, expectedStatus, { noStore = false } = {}) {
  const response = await get(path);
  console.log(`\n${path} -> ${response.status}`);
  check(`${path} returns ${expectedStatus}`, response.status === expectedStatus, `got ${response.status}`);
  if (noStore) {
    check(`${path} is not cached`, /no-store/.test(header(response, "cache-control")), header(response, "cache-control"));
  }
}

try {
  console.log(`Verifying security and cache headers at ${baseUrl}`);
  await checkHtml("/");
  await checkHtml("/careers");
  await checkStatic();

  const sitemap = await get("/sitemap.xml", { read: true });
  console.log(`\n/sitemap.xml -> ${sitemap.status}`);
  check("/sitemap.xml returns 200", sitemap.status === 200, `got ${sitemap.status}`);
  const sitemapBody = await sitemap.text();
  const urls = (sitemapBody.match(/<loc>/g) ?? []).length;
  check("/sitemap.xml lists 82 URLs", urls === 82, `got ${urls}`);

  await checkEndpoint("/robots.txt", 200);
  await checkEndpoint("/.well-known/security.txt", 200);
  await checkEndpoint("/api/health", 200, { noStore: true });
  await checkEndpoint("/api/revalidate", 405);
  await checkEndpoint("/api/csp-report", 405);
} catch (error) {
  console.error(`\nHeader verification could not complete: ${error.message}`);
  console.error(`Is the production server running at ${baseUrl}? Try: npm run build && npm start`);
  process.exit(1);
}

for (const note of notes) console.log(`\nnote: ${note}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} header check(s) failed.`);
  process.exit(1);
}

console.log("\nAll header checks passed.");
