# Performance

## 1. Baseline from the audit

The audit measured the live site from one host with cold and warm `curl`
requests, not Lighthouse:

| Metric | Baseline |
|---|---:|
| Modern-path JavaScript (15 chunks) | 597,497 B decoded / 186,310 B Brotli |
| CSS (2 files) | 181,212 B decoded / 25,695 B Brotli |
| Homepage HTML | 100,498 B decoded / 15,392 B |
| `/careers` cache | `private, no-cache, no-store` — edge MISS every time |
| Prerendered HTML cache | `public, max-age=0, must-revalidate` — browser revalidates every navigation |
| Sitemap `lastmod` | Request time for 16 static URLs |
| Third party | Render-blocking Google Fonts CSS, early GTM preload |

The two structural problems were cache policy (PERF-02, PERF-03) and payload
(PERF-01). The third-party finding (PERF-05) is a request-chain problem.

## 2. What changed

### 2.1 Payload

| Group | Baseline | Rebuild | Change |
|---|---:|---:|---:|
| JS decoded | 597,497 B | 534,422 B | −63,075 B (−10.6%) |
| JS Brotli | 186,310 B | 140,923 B | −45,387 B (−24.4%) |
| CSS decoded | 181,212 B | 54,955 B | −126,257 B (−69.7%) |
| CSS Brotli | 25,695 B | 9,430 B | −16,265 B (−63.3%) |
| **Total Brotli** | **212,005 B** | **150,353 B** | **−61,652 B (−29.1%)** |

The CSS reduction is the design rebuild on Tailwind with a small semantic
utility layer instead of a 177 KB generated stylesheet. The JS reduction comes
from:

- keeping Motion out of the initial path (CSS reveals; Motion only in the
  lazy newsletter dialog);
- lazy-loading the newsletter dialog itself;
- `optimizePackageImports` for `lucide-react` and `motion`;
- no analytics, tag manager, third-party fonts or UI library runtime.

The remaining JavaScript is mostly the React and Next runtime plus the
interactive forms. Removing it would mean giving up the App Router, streaming
and progressive enhancement, which is a bad trade for this site.

### 2.2 Caching

All 20 HTML route patterns now carry:

```
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400
```

`max-age=0` keeps browsers honest, `s-maxage=300` gives edge reuse for five
minutes, and the one-day stale window lets a stale page be served while it
refreshes. `/careers` is no longer `no-store`; it is statically generated with
`generateStaticParams`, `dynamicParams = false` and `revalidate = 300`.

Hashed assets keep the existing correct policy:
`public, max-age=31536000, immutable`. Sitemap and robots are cached for an
hour; API routes are `no-store`.

`scripts/verify-headers.mjs` asserts the exact HTML values on `/` and
`/careers`, so a framework or config change cannot silently drop them.

### 2.3 Third-party requests

- Both text fonts are self-hosted WOFF2 files loaded with `next/font/local`
  (`display: swap`), so there is no Google Fonts stylesheet.
- No Material Symbols stylesheet is loaded; icons come from tree-shaken
  `lucide-react` imports.
- No GTM, analytics or advertising script is present.

The homepage now makes no third-party requests.

### 2.4 Largest Contentful Paint

The hero `h1`, introduction and CTAs are server-rendered and no longer wrapped
in the reveal animation, so the largest element does not wait for an
`IntersectionObserver` callback. Below-fold sections still reveal on scroll.

In an unthrottled local Chromium run with Pixel 7 emulation, LCP was **448 ms**;
desktop was **188 ms**. These are not field numbers and are not a substitute
for Lighthouse's throttled estimate.

## 3. Lighthouse results

Lighthouse 13.5, Chrome from the Playwright cache, local production server
(`next start`), default simulated throttling. Raw reports:
[`docs/evidence/lighthouse/`](evidence/lighthouse/).

| Page | Form factor | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---|---|---|
| `/` | Mobile | 84 | 100 | 100 | 100 | 3.4 s | 330 ms | 0 |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 20 ms | 0 |
| `/careers` | Mobile | 93 | 100 | 100 | 100 | 3.0 s | 160 ms | 0 |
| `/blog/top-web-development-trends-2026` | Mobile | 97 | 100 | 100 | 100 | 2.4 s | 120 ms | 0 |

Interpretation:

- Desktop is clean: 100 across all categories, 0.7 s LCP.
- The mobile homepage is the weakest sample at 84. LCP at 3.4 s is dominated
  by simulated slow-4G transfer of the HTML and font, plus the cost of the
  capability section. TBT (330 ms) reflects hydration of the interactive
  islands.
- Careers and the article sample score higher because they carry less
  interactive UI.
- CLS is zero across all samples; images have reserved dimensions and the
  display font swap uses a metric-compatible fallback.

## 4. What was not done

- **No field data.** There is no RUM or CrUX lookup; Lighthouse lab numbers
  are one machine's simulation.
- **No nonce-based CSP.** It would force dynamic rendering and lose the cache
  win. The payload and cache improvements take priority for a marketing site.
- **No edge function rewrite.** The site is static/ISR; adding middleware would
  add a request hop without a current need.
- **No image CDN tuning beyond Next.** Local AVIF/WebP output with a one-year
  minimum cache TTL is already configured; content images are small and
  below-the-fold.
- **No service worker.** Offline support is not part of the brief and would add
  a cache invalidation problem.

## 5. Reproduce

```bash
npm run build
npm start -- -p 3100
node scripts/measure-payload.mjs http://localhost:3100
node scripts/verify-headers.mjs http://localhost:3100
npm run lighthouse
```

The Lighthouse script measures `/` on mobile and desktop, `/careers` on mobile
and one article on mobile. It writes JSON, HTML and a `summary.json` so the
numbers in this document can be checked rather than taken on trust.
