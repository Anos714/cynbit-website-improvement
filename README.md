# Cynbit Website Improvement

A secure, cache-aware, content-driven rebuild of Cynbit Technologies' public
website. This repository is the Full Stack Developer Intern assessment
submission: recreate the public site and close the findings from the passive
backend audit.

**Live site:** <https://cynbit-website-improvement.vercel.app>
**Audit repository:** <https://github.com/Anos714/cynbit-passive-audit>

![Cynbit homepage at desktop width](docs/evidence/screenshots/home-desktop.png)

## What is in the rebuild

- **82 public URLs** — 16 top-level routes, 25 blog posts, 13 case studies,
  20 roles and 8 student diaries — all prerendered and listed in the sitemap.
- **All nine audit findings addressed**, with the residual trade-offs written
  down rather than hidden. See [audit traceability](docs/audit-traceability.md).
- **Server-side forms** for contact, newsletter and job applications with Zod
  validation, layered rate limiting, honeypots, timing checks and honest
  delivery states.
- **Explicit cache policy** that matches the rendering model: ISR HTML at the
  edge for five minutes with a one-day stale window, immutable hashed assets.
- **Browser and accessibility tests** that walk every sitemap URL in a real
  Chromium build, plus axe checks on the 16 top-level pages.

## Measured results

Local production build (`next start`), Lighthouse 13 with its default
simulated throttling. These are lab numbers from one machine, not field data.

| Page | Form factor | Performance | Accessibility | Best practices | SEO |
|---|---|---:|---:|---:|---:|
| `/` | Mobile | 84 | 100 | 100 | 100 |
| `/` | Desktop | 100 | 100 | 100 | 100 |
| `/careers` | Mobile | 93 | 100 | 100 | 100 |
| `/blog/top-web-development-trends-2026` | Mobile | 97 | 100 | 100 | 100 |

Client payload on the homepage, compared with the audit baseline:

| Group | Before (decoded) | After (decoded) | Before (Brotli) | After (Brotli) |
|---|---:|---:|---:|---:|
| Modern-path JavaScript | 597,497 B | 534,422 B | 186,310 B | 140,923 B |
| CSS | 181,212 B | 54,955 B | 25,695 B | 9,430 B |
| **Total transfer** | — | — | **212,005 B** | **150,353 B** |

That is a 29.1% reduction in compressed JS + CSS transfer. Full method and
caveats: [performance notes](docs/performance.md). Raw Lighthouse HTML/JSON is
in [`docs/evidence/lighthouse/`](docs/evidence/lighthouse/).

### Live verification

Checked against the production deployment on 2026-10-26:

- `scripts/verify-headers.mjs` passes: enforced CSP, HSTS, cache policy,
  same-origin CORS (no wildcard), 82 sitemap URLs, `no-store` APIs.
- Playwright walks all 82 live URLs: `200`, visible `h1`, no console or CSP
  errors.
- axe finds no serious or critical violations on the 16 top-level live pages.
- The CI workflow (lint, typecheck, unit tests, build, route parity, Playwright)
  is green on `main`.

The Lighthouse table above was measured on a local production build, not
against Vercel; it is labelled accordingly.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4.3 App Router, React 19.3.1, TypeScript strict |
| Styling | Tailwind CSS 4.3.3, self-hosted variable fonts |
| Motion | CSS reveal observer; Motion 14 lazy-loaded only for the newsletter dialog |
| Validation | Zod 4.6.7 shared by client hints and server actions |
| Forms | React Server Actions + `useActionState` |
| Rate limiting | Upstash Redis sliding window, documented in-memory fallback |
| Email | Resend when configured, clearly labelled demo transport otherwise |
| Tests | Vitest, Playwright 1.64, `@axe-core/playwright`, Lighthouse 13 |
| Hosting | Vercel (Node 22.19.0) |

## Local development

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. With no email or Redis keys the app runs in demo
mode: submissions are accepted, the UI says "Demo mode", and only a random
reference is logged. No message body, email address or IP is logged.

## Verification

```bash
npm run lint
npm run typecheck
npm test                 # 34 unit tests
npm run build
npm run verify:routes    # every content entry has a sitemap URL and HTML file
npm run verify:headers   # headers, cache policy, sitemap count, API methods
npm run test:e2e         # 82-route sweep, axe, interactions
npm run lighthouse       # writes docs/evidence/lighthouse/
```

`npm run check` runs lint, typecheck, unit tests, build and route parity. CI
runs the same gate plus the Playwright suite against a production build.

## Documentation

- [Technical report](docs/technical-report.md) — problem, decisions, results
- [Architecture](docs/architecture.md) — rendering, data flow, components
- [Security](docs/security.md) — headers, CSP, form abuse controls, residuals
- [Performance](docs/performance.md) — payload, caching, Lighthouse method
- [Audit traceability](docs/audit-traceability.md) — finding-by-finding mapping
- [Content model](docs/content-model.md) — collections, dates, sitemap rules
- [Deployment](docs/deployment.md) — Vercel, environment, post-deploy checks

## Honest limitations

- **Email is in demo mode unless keys are provided.** The contact, newsletter
  and application forms are real server-side flows, but without a Resend key
  they do not deliver mail. The UI never claims otherwise.
- **The in-memory rate limiter is per instance.** Upstash is the production
  path; the fallback is best-effort and resets on deploy.
- **CSP is enforced with `'unsafe-inline'` and no nonce.** A nonce would force
  prerendered pages to render per request and undo the cache fix. This is a
  deliberate trade-off, documented in the security notes.
- **HSTS preload is not enabled.** `includeSubDomains` is set, but submitting
  to the preload list is a long-lived commitment that needs a subdomain
  inventory and a custom domain under Cynbit's control.
- **No fabricated content.** Copy, dates and metrics come from the public site
  and the supplied audit. No testimonials, client results or scores were
  invented.

## License and attribution

Site copy and brand assets belong to Cynbit Technologies. Third-party licences
are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The bundled
Manrope and Plus Jakarta Sans fonts are used under the SIL Open Font License;
their licence files live next to the font files.
