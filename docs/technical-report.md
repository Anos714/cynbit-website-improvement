# Technical report

## 1. Brief

The assessment asked for two things at once:

1. Recreate Cynbit Technologies' public website.
2. Fix the findings in the passive backend audit of the live site.

The deliverables are this public repository, a live deployment and this
report. The rebuild is based only on publicly reachable pages, public assets
and the supplied audit. No original source code, credentials or private data
were used, and no active requests were made to forms, APIs, `/admin/` or
`/portal/` on the live site.

## 2. What was measured before the rebuild

The audit tested `https://www.cynbit.in` on 2026-10-22 with anonymous
`GET`/`HEAD` requests. It found nine issues: four Medium, four Low and one
Informational. The relevant ones for this rebuild were:

- no CSP or browser-isolation headers (SEC-01);
- HSTS without `includeSubDomains` or `preload` (SEC-02);
- wildcard CORS on some HTML responses (SEC-03);
- two public Server Actions with unverified abuse controls (SEC-04);
- 597 KB of modern-path JavaScript and 181 KB of CSS (PERF-01);
- HTML that revalidated on every navigation while edge copies aged for days
  (PERF-02);
- `/careers` served `no-store` and missed the edge cache (PERF-03);
- request-time `lastmod` in the sitemap (PERF-04);
- a render-blocking Google Fonts stylesheet and an early GTM preload
  (PERF-05).

The audit scope stopped at headers, cache behaviour, public bundles and the
public sitemap. It did not test exploits, so this report does not claim the
site was insecure in a way the evidence did not show.

## 3. Outcome

- 82 public URLs are prerendered: 16 top-level pages, 25 blog posts, 13 case
  studies, 20 roles and 8 diaries.
- Every URL returns `200` with a visible `h1` in a real browser sweep, with no
  console errors or enforced-CSP violations.
- axe reports no serious or critical WCAG 2.0/2.1 A/AA violations on the 16
  top-level pages.
- Lighthouse (local production build) scored 94–100 on performance and 100 on
  accessibility, best practices and SEO across the sampled pages.
- Compressed JS + CSS transfer on the homepage fell from 212,005 B to
  150,911 B, a 28.8% reduction against the audit baseline.

Section 7 explains exactly how those numbers were produced and what they do not
prove.

## 4. Stack and key decisions

| Concern | Decision | Why |
|---|---|---|
| Rendering | Next.js 16 App Router, Server Components, ISR every 300 s | The site is content-heavy and mostly static; per-request rendering was the audit's cache problem |
| Language | TypeScript strict | Content shapes, action state and JSON-LD are easy to get subtly wrong |
| Styling | Tailwind CSS 4 with a small set of semantic utilities | Keeps the CSS payload far below the 181 KB baseline |
| Fonts | `next/font/local` with two variable WOFF2 files | Removes the render-blocking third-party stylesheet (PERF-05) |
| Motion | CSS transitions and a small hero rotator; Motion only inside the lazy newsletter dialog | Avoids shipping an animation runtime on every route and protects LCP |
| Forms | Server Actions with `useActionState`, Zod on the server | No public REST surface to abuse; validation cannot be bypassed from the client |
| Rate limits | Upstash sliding window, per IP + email + email domain, with an explicit in-memory fallback | Distributed by default; the fallback is honest and documented |
| Email | Resend when configured, otherwise a clearly labelled demo transport | The form must never claim delivery that did not happen |
| Tests | Vitest for logic, Playwright + axe for browser reality, Lighthouse for lab metrics | Unit tests cannot catch hydration, CSP or layout failures |

## 5. Implementation

### 5.1 Routes and rendering

The 16 top-level pages are static. Collection routes use
`generateStaticParams` with `dynamicParams = false` and `revalidate = 300`, so
unknown slugs are a real 404 and known pages are served from the edge with a
five-minute freshness window.

`next.config.ts` attaches an explicit cache policy to every HTML route:

```
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400
```

The browser revalidates, the edge serves a five-minute copy, and a stale copy
may be used for up to a day while it refreshes. This addresses PERF-02 and
PERF-03 without pretending the content is immutable. Hashed assets keep
`max-age=31536000, immutable`; sitemap and robots use one hour; API routes are
`no-store`.

### 5.2 Security headers

A single global header block sets:

- `Content-Security-Policy` (enforced in production, Report-Only in
  development) with `default-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'` and
  `report-uri /api/csp-report`;
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- a restrictive `Permissions-Policy`;
- `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Resource-Policy: same-origin`;
- no `X-Powered-By`, no wildcard CORS.

`scripts/verify-headers.mjs` asserts each of these on `/` and `/careers`,
along with the cache policy, static immutability, sitemap count, `security.txt`
and the allowed methods on the API routes. It exits non-zero on a regression.

### 5.3 Form abuse controls

Contact, newsletter and career applications share one pipeline:

1. Honeypot field — a filled hidden field returns a normal success response
   without processing, so bots do not learn they were caught.
2. Minimum completion time of 2.5 seconds — catches naive automated posts
   without blocking fast humans.
3. Zod schema validation on the server, including URL and email rules.
4. Sliding-window limits of 5 per IP / 10 min, 3 per email / hour and 15 per
   email domain / hour. The strictest failure wins and the UI receives a retry
   hint.
5. A random UUID reference returned to the user and written to logs instead of
   the message body or address.
6. Header sanitisation before building the email, so a newline in a name cannot
   inject extra headers.
7. Honest failure states: if Resend is not configured or fails, the UI says so
   and offers the public email address. It never shows a success message for
   an undelivered message.

### 5.4 Accessibility and resilience

- The newsletter modal, mobile menu and dialogs are keyboard operable and
  close on Escape; forms have labels, described-by error text and live status
  regions.
- The reveal animation reads `prefers-reduced-motion` and falls back to
  visible content if `IntersectionObserver` is missing.
- A route-level loading skeleton, an error boundary and a global error page
  provide branded states instead of blank screens.
- The 404 is a real `404` with a branded page.

### 5.5 SEO and structured data

- One `Organization` + `ProfessionalService` + `WebSite` graph in the root
  layout, including the studio address, `areaServed`, `knowsAbout`, a contact
  point and `sameAs` profiles.
- `BlogPosting` + `BreadcrumbList` on articles and `JobPosting` +
  `BreadcrumbList` on roles.
- `FAQPage` generated from the visible contact FAQ and `Service` generated
  from the visible service practices.
- `/llms.txt` with a canonical summary and factual links for generative search.
- Per-page canonical URLs, Open Graph/Twitter metadata with the correct page
  title, a static 1200×630 fallback image, `robots.txt`, an 82-URL sitemap and
  `security.txt`.
- Top-level sitemap entries intentionally omit `lastModified` because the
  content has no trustworthy change date. Blog, case study and diary entries
  use the dates that exist in the content. This is the PERF-04 fix: no
  request-time dates.

## 6. Repository map

```
src/app/(marketing)/      16 top-level pages and four collection routes
src/app/api/              health, revalidation, CSP report
src/components/           layout, forms, content, motion, UI primitives
src/content/              typed loaders over JSON collections
src/lib/actions/          contact, newsletter, career server actions
src/lib/                  env, email, rate limit, validation, SEO, site config
scripts/                  route, header, payload and Lighthouse checks
tests/e2e/                Playwright route, axe and interaction suites
docs/evidence/            Lighthouse reports and responsive screenshots
```

## 7. Results and method

### 7.1 Automated checks

| Check | Result |
|---|---|
| ESLint | Pass |
| `tsc --noEmit` | Pass |
| Vitest | 34 tests in 3 files, pass |
| Production build | Pass; all routes prerendered |
| Route parity | 82 expected, 82 in sitemap, 82 HTML files |
| Header verification | All assertions pass on `/` and `/careers` |
| Playwright | 18 test runs across 2 spec files (Chromium + Pixel 7): 82-route sweep, structured data, axe on 16 pages, newsletter, mobile menu, hero motion, accordion, contact, application, 404 |
| Browser sweep | 82/82 `200`, visible `h1`, zero console errors, zero CSP violations |
| axe | No serious or critical violations on the 16 top-level pages |

### 7.2 Live deployment

Final release: `v1.0.3`.

The same checks were run against
`https://cynbit-website-improvement.vercel.app` on 2026-10-26:

- header verification passes on `/` and `/careers`, including enforced CSP,
  the exact `s-maxage=300` policy and a same-origin CORS value;
- Playwright visits all 82 sitemap URLs: `200`, visible `h1`, no console errors
  and no CSP violations;
- structured data parses on the homepage, an article and a role;
- axe finds no serious or critical violations on the 16 top-level pages;
- the GitHub Actions workflow is green on `main`.

One platform difference was found and fixed during this pass: Vercel adds
`access-control-allow-origin: *` to static output even when the application
does not set it. The app now restates the header with its own origin, and the
live header check fails if the value is ever `*`.

### 7.3 Lighthouse

Lighthouse 13, Chrome from the Playwright cache, local `next start`, default
simulated throttling. Reports are committed under `docs/evidence/lighthouse/`.

| Page | Form factor | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---|---|---|
| `/` | Mobile | 95 | 100 | 100 | 100 | 2.7 s | 160 ms | 0 |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 ms | 0 |
| `/careers` | Mobile | 94 | 100 | 100 | 100 | 2.3 s | 230 ms | 0 |
| `/blog/top-web-development-trends-2026` | Mobile | 97 | 100 | 100 | 100 | 2.4 s | 70 ms | 0 |

The mobile homepage LCP is dominated by Lighthouse's simulated slow 4G and CPU
throttling, not by an animation: the hero heading, introduction and CTAs are
server-rendered and no longer wrapped in a reveal. An unthrottled Chromium run
(Pixel 7 emulation, local) measured LCP at 448 ms; desktop was 188 ms. The
throttled 2.7 s figure is the one to compare against field budgets, and it is
the one reported.

### 7.4 Payload

`scripts/measure-payload.mjs` parses the HTML for modern-path scripts and
stylesheets, fetches each file and Brotli-compresses it at quality 11.

| Group | Audit baseline | Rebuild | Change |
|---|---:|---:|---:|
| JS decoded | 597,497 B | 535,585 B | −10.4% |
| JS Brotli | 186,310 B | 141,357 B | −24.1% |
| CSS decoded | 181,212 B | 55,642 B | −69.3% |
| CSS Brotli | 25,695 B | 9,554 B | −62.8% |
| Total Brotli | 212,005 B | 150,911 B | −28.8% |

The CSS drop comes from rebuilding the design on Tailwind with a small
semantic layer instead of the original 177 KB utility bundle. The JS drop comes
from keeping the animation runtime out of the initial path, lazy-loading the
newsletter dialog and using the framework's package import optimisation. The
remaining JS is mostly the React/Next runtime; removing it would mean giving up
the App Router and the interactive forms, which is not a good trade for this
site.

## 8. Deviations and trade-offs

**CSP is enforced, not Report-Only.** The original plan was Report-Only first.
During implementation every route was exercised under the policy with zero
violations, so production now enforces it and development keeps Report-Only for
React refresh. `CSP_ENFORCE=false` downgrades production to Report-Only without
a code change. This is a stronger default with an escape hatch; it is a
deviation from the initial choice and is called out here rather than buried.

**No nonce.** A per-request nonce in a prerendered page either forces dynamic
rendering or requires build-time hashes for every inline script. Both would
undo the cache and TTFB fixes the audit asked for. The policy keeps
`'unsafe-inline'` for scripts and styles, which weakens XSS defence-in-depth.
`object-src 'none'`, `base-uri 'self'` and `form-action 'self'` still close the
common injection pivots, and no third-party script is allowed. A nonce on the
dynamic form routes and hashes on static pages is the documented next step.

**`includeSubDomains` without `preload`.** The audit warns that preload is a
long-lived commitment. `includeSubDomains` is safe for the Vercel hostname and
matches the audit's recommendation; submitting to the preload list is deferred
until Cynbit inventories its subdomains and controls the custom domain.

**The unused `/api/newsletter` route was removed.** The newsletter is handled by
a Server Action like the other forms. Keeping a second write surface with no
caller would increase attack surface and code to maintain. Rate limiting and
validation cover the action and are unit tested.

## 9. Limitations

- Lab Lighthouse numbers are from one machine and a local server. They are not
  field data and should not be quoted as production Core Web Vitals.
- The live deployment runs in demo email mode until Resend credentials are
  supplied. This is visible in the UI and is the honest state.
- Without Upstash credentials the rate limiter is per instance. On Vercel that
  means limits are weaker under concurrency and reset on deploy.
- Content is typed at compile time but not runtime-validated. It is trusted
  build-time data, not user input.
- The site is a recreation of the public marketing site, not a migration of
  the original codebase. Internal links, copy and assets follow the public
  site; any page not publicly linked was out of scope.
- No penetration test, load test or fuzzing was performed. The security work
  is defensible configuration and abuse control, not a claim of proven
  resistance to a determined attacker.

## 10. Reproducing the results

```bash
npm ci
npm run lint && npm run typecheck && npm test && npm run build
npm run verify:routes
npm start -- -p 3100
npm run verify:headers -- http://localhost:3100
node scripts/measure-payload.mjs http://localhost:3100
PLAYWRIGHT_BASE_URL=http://localhost:3100 npm run test:e2e
npm run lighthouse
```

The Lighthouse script writes JSON, HTML and `summary.json` into
`docs/evidence/lighthouse/`. Screenshots are captured with
`node scripts/capture-screenshots.mjs` after a server is running on port 3100.
