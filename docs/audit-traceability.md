# Audit traceability

Every finding from the passive audit, what changed, where it lives and how it
was checked. The audit's own severity is kept; the status column describes this
rebuild, not the live site.

## Summary

| ID | Audit finding | Severity | Status |
|---|---|---|---|
| SEC-01 | No CSP or complementary isolation headers | Medium | Fixed, with a documented CSP trade-off |
| SEC-02 | HSTS lacks `includeSubDomains` and `preload` | Low | Partly fixed: `includeSubDomains` added, `preload` deferred |
| SEC-03 | Wildcard CORS on HTML documents | Low | Fixed |
| SEC-04 | Public Server Actions, abuse controls unverified | Info | Fixed: validation, layered limits, honeypot, timing check |
| PERF-01 | 597 KB modern-path JS, 181 KB CSS | Medium | Improved: 534 KB JS, 55 KB CSS, −29.1% total Brotli |
| PERF-02 | HTML revalidates every navigation, edge copy ages | Medium | Fixed: explicit `s-maxage=300` + SWR |
| PERF-03 | `/careers` is `no-store` and always misses | Medium | Fixed: SSG + ISR 300 s |
| PERF-04 | Sitemap `lastmod` is request time | Low | Fixed: omitted where no real date exists |
| PERF-05 | Render-blocking third-party font CSS; early GTM preload | Low | Fixed: self-hosted fonts, no GTM |

## SEC-01 — CSP and browser-isolation headers

**Audit:** no CSP on any captured route; `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, COOP and CORP were
absent; `X-Powered-By: Next.js` appeared inconsistently.

**Change:**

- Global header block in `next.config.ts` adds CSP, HSTS, nosniff, `DENY`,
  referrer policy, permissions policy, COOP and CORP, and disables
  `X-Powered-By`.
- CSP is enforced in production, Report-Only in development. It denies objects,
  frames and base-uri changes, restricts forms to self and sends reports to
  `/api/csp-report`.
- `src/app/api/csp-report/route.ts` accepts `POST` and returns `204`; other
  methods return `405`.

**Verification:** `npm run verify:headers`; the Playwright sweep listens for
`securitypolicyviolation` on all 82 routes and found none under the enforced
policy. axe reports no serious or critical violations on the 16 top-level
pages.

**Residual:** script-src allows `'unsafe-inline'` and has no nonce. Preventing
that would force prerendered pages to render dynamically and reverse the cache
fix. See [security](security.md#21-content-security-policy).

## SEC-02 — HSTS

**Audit:** `max-age=63072000` was present but `includeSubDomains` and `preload`
were not. The audit explicitly warns that preload needs a subdomain inventory.

**Change:** `Strict-Transport-Security: max-age=63072000; includeSubDomains` in
`next.config.ts`.

**Verification:** `verify:headers` asserts HSTS on `/` and `/careers`.

**Residual:** `preload` is not set. It is a long-lived commitment and should
only be submitted after every subdomain is known to be HTTPS and Cynbit
controls the custom domain. This follows the audit's own sequencing.

## SEC-03 — Wildcard CORS

**Audit:** `access-control-allow-origin: *` on `/` and `/services`, absent
elsewhere.

**Change:** `next.config.ts` emits `Access-Control-Allow-Origin` with the
canonical site origin. This is required because Vercel adds a wildcard value to
static output by default; restating it overrides that default.

**Verification:** `verify:headers` asserts the value is present and is not `*`
on `/` and `/careers`, locally and on the live host.

## SEC-04 — Server Action abuse surface

**Audit:** two public action IDs were confirmed; validation and rate limiting
were labelled a hypothesis because the audit did not invoke them.

**Change:**

- Zod schemas in `src/lib/validation.ts` validate every field server-side;
  client-side attributes are only hints.
- `src/lib/rate-limit.ts` applies 5/IP/10 min, 3/email/hour and 15/domain/hour
  with Upstash when configured and an explicit in-memory fallback otherwise.
- Every form has a honeypot and a 2.5-second minimum completion time.
- `src/lib/email.ts` strips CR/LF from headers and never logs the message body,
  email address or IP; it logs a random reference instead.
- Delivery failure or missing credentials produce a visible error with the
  public email address, never a false success.
- The unused `/api/newsletter` endpoint was removed; the newsletter is a Server
  Action like the other forms.

**Verification:** 34 unit tests cover schemas and the limiter, including the
"delivery unavailable" path. Playwright submits each form through the real UI
and checks the demo-mode success path and server validation.

**Residual:** without Upstash credentials the limiter is per instance. The demo
transport does not deliver mail until Resend is configured.

## PERF-01 — Client payload

**Audit:** 597,497 B decoded JS, 181,212 B CSS on the modern path.

**Change:** rebuilt the design on Tailwind with a small semantic layer; kept
Motion out of the initial path; lazy-loaded the newsletter dialog; enabled
package import optimisation; removed third-party scripts and font CSS.

**Measured now:** 534,422 B decoded JS / 140,923 B Brotli; 54,955 B decoded CSS
/ 9,430 B Brotli. Total Brotli 150,353 B versus 212,005 B (−29.1%).

**Verification:** `scripts/measure-payload.mjs` fetches the real chunk list from
the HTML and Brotli-compresses each file at quality 11.

**Residual:** the remaining JS is mostly the framework runtime. Further
reduction would mean removing the App Router or the interactive forms.

## PERF-02 — HTML cache policy

**Audit:** prerendered HTML used `max-age=0, must-revalidate` while edge copies
aged for days.

**Change:** 20 HTML route patterns now use
`public, max-age=0, s-maxage=300, stale-while-revalidate=86400` in
`next.config.ts`.

**Verification:** `verify:headers` asserts the exact value on `/` and
`/careers`.

**Residual:** content edits can take up to five minutes to appear, or are
immediate with `POST /api/revalidate` and the bearer secret. That is the
intended freshness trade-off.

## PERF-03 — `/careers` uncached

**Audit:** `private, no-cache, no-store` and an edge MISS on every request.

**Change:** `src/app/(marketing)/careers/page.tsx` and `[slug]/page.tsx` are
statically generated with `revalidate = 300` and `dynamicParams = false`; the
route is included in the HTML cache list.

**Verification:** the production build shows careers as prerendered; the header
check confirms the ISR cache policy; Playwright loads all 20 role pages.

**Residual:** a closed role may remain visible for up to five minutes unless
the path is revalidated on change.

## PERF-04 — Sitemap dates

**Audit:** 16 static URLs had `lastmod` equal to request time.

**Change:** `src/app/sitemap.ts` omits `lastModified` for top-level pages and
careers, because the source has no trustworthy per-page date. Blog, case study
and diary entries use the dates present in the content. Career `JobPosting`
dates are documented constants in `src/content/careers.ts`, not derived from
the request clock.

**Verification:** `verify:headers` counts 82 URLs; `verify:routes` checks the
sitemap against the content collections; Playwright parses the sitemap and
visits every URL.

**Residual:** dates for top-level pages will be absent until a CMS or content
history supplies them. That is more honest than a fabricated timestamp.

## PERF-05 — Third-party delivery

**Audit:** render-blocking Google Fonts stylesheet and an early GTM preload.

**Change:** `src/app/layout.tsx` uses `next/font/local` with two self-hosted
variable WOFF2 files and `display: swap`. Icons come from tree-shaken
`lucide-react` imports. No tag manager or analytics script exists in the app.

**Verification:** payload measurement sees only same-origin stylesheets; the
homepage has no third-party request in the browser network log.

**Residual:** none identified for the current feature set. Adding analytics
later would require a CSP and performance review.

## Audit recommendations not implemented

| Recommendation | Status | Reason |
|---|---|---|
| Nonce CSP on dynamic routes, hashes on static | Deferred | Needs a cache-cost evaluation; documented next step |
| HSTS preload submission | Deferred | Requires subdomain inventory and domain control |
| RUM/TTFB measurement | Not in scope | No production traffic or analytics account was provided |
| CMS-backed `lastmod` | Not in scope | Content is a fixed supplied set; dates are omitted where unknown |

## Reproduce the traceability

```bash
npm run build
npm run verify:routes
npm start -- -p 3100
npm run verify:headers -- http://localhost:3100
node scripts/measure-payload.mjs http://localhost:3100
PLAYWRIGHT_BASE_URL=http://localhost:3100 npm run test:e2e
```
