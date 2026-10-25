import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { trackPage } from "./helpers";

async function sitemapPaths(baseURL: string) {
  const response = await fetch(`${baseURL}/sitemap.xml`);
  expect(response.status).toBe(200);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
}

test.describe("public route sweep @desktop", () => {
  test("all 82 sitemap routes render without console or CSP errors", async ({ page, baseURL }) => {
    test.setTimeout(300_000);
    const paths = await sitemapPaths(baseURL!);
    expect(paths).toHaveLength(82);

    const failures: string[] = [];

    for (const path of paths) {
      const tracker = await trackPage(page);
      const response = await page.goto(path, { waitUntil: "load" });
      const status = response?.status();

      if (status !== 200) failures.push(`${path}: HTTP ${status}`);
      const headingVisible = await page
        .locator("h1")
        .first()
        .waitFor({ state: "visible", timeout: 5_000 })
        .then(() => true)
        .catch(() => false);
      if (!headingVisible) failures.push(`${path}: no visible h1`);

      const csp = await tracker.cspViolations();
      if (csp.length > 0) failures.push(`${path}: CSP ${JSON.stringify(csp)}`);
      if (tracker.consoleErrors.length > 0) {
        failures.push(`${path}: console ${tracker.consoleErrors.join(" | ")}`);
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("structured data parses and uses the expected schema types", async ({ page }) => {
    const expectations: Array<[string, string[]]> = [
      ["/", ["Organization", "ProfessionalService", "WebSite"]],
      ["/blog/top-web-development-trends-2026", ["BlogPosting", "BreadcrumbList"]],
      ["/careers/ai-engineer", ["JobPosting", "BreadcrumbList"]],
      ["/contact", ["FAQPage"]],
      ["/services", ["Organization", "Service"]],
    ];

    for (const [path, types] of expectations) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length, path).toBeGreaterThan(0);

      const parsed = blocks.map((block) => JSON.parse(block)) as Array<{
        "@graph"?: Array<{ "@type": string | string[] }>;
        "@type"?: string | string[];
      }>;
      const typesOf = (node: { "@type"?: string | string[] }) =>
        Array.isArray(node["@type"]) ? node["@type"] : node["@type"] ? [node["@type"]] : [];
      const found = parsed.flatMap((entry) =>
        entry["@graph"]?.flatMap(typesOf) ?? typesOf(entry),
      );

      for (const type of types) {
        expect(found, `${path} should include ${type}`).toContain(type);
      }
    }
  });

  test("exposes llms.txt for generative search", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body).toContain("# Cynbit Technologies");
    expect(body).toContain("Canonical site:");
    expect(body).toContain("/services");
    expect(body).toContain("/contact");
  });
});

test.describe("accessibility @desktop", () => {
  const topLevel = [
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

  test("top-level pages have no serious or critical axe violations", async ({ page }) => {
    test.setTimeout(300_000);
    // Reveal transitions animate opacity; axe can sample mid-fade and report a
    // false contrast failure. Test the settled state that reduced-motion users
    // also see.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const failures: string[] = [];

    for (const path of topLevel) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      for (const violation of results.violations) {
        if (violation.impact === "serious" || violation.impact === "critical") {
          failures.push(
            `${path}: ${violation.id} (${violation.impact}) — ${violation.nodes.length} node(s)`,
          );
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });
});
