# Architecture

## 1. Shape of the application

A single Next.js 16 App Router application with two rendering modes:

| Mode | Routes | Behaviour |
|---|---|---|
| Static or ISR | 82 public URLs | Prerendered at build, revalidated every 300 s |
| Dynamic | `/api/health`, `/api/revalidate`, `/api/csp-report`, 404 | Per-request, `no-store` |

There is no separate backend service and no database. Content lives in typed
JSON collections under `src/content/data/`; the only writes are form
submissions that leave the system as email. That is the right size for a
marketing site and avoids inventing infrastructure the brief does not need.

## 2. Route tree

```
src/app/
├── layout.tsx                 root shell, fonts, metadata, Organization/WebSite JSON-LD
├── (marketing)/
│   ├── layout.tsx             skip link, header, reveal observer, main, footer, newsletter loader
│   ├── page.tsx               /
│   ├── story/ team/           company pages
│   ├── services/ products/    expertise pages
│   ├── case-studies/          index + [slug]
│   ├── impact/                social impact
│   ├── bitelevate/            programme + paths
│   ├── diaries/               index + [slug]
│   ├── blog/                  index + [slug]
│   ├── careers/               index + [slug]
│   ├── contact/               inquiry form
│   ├── privacy/ terms/ cookies/
│   ├── loading.tsx            route skeleton
│   └── error.tsx              route error boundary
├── global-error.tsx           last-resort boundary
├── not-found.tsx              branded 404
├── robots.ts
├── sitemap.ts
└── api/
    ├── health/route.ts        liveness, no-store
    ├── revalidate/route.ts    bearer-protected ISR purge
    └── csp-report/route.ts    204 sink for CSP reports
```

Collection pages export `generateStaticParams`, `dynamicParams = false` and
`revalidate = 300`. A slug that is not in the content is therefore a real 404,
not a dynamically rendered empty page.

## 3. Request lifecycle

1. **Edge cache.** HTML routes carry
   `public, max-age=0, s-maxage=300, stale-while-revalidate=86400`. A hit is
   served without touching the function.
2. **Static render.** On a miss or after revalidation, the prerendered RSC
   payload and HTML are served.
3. **Headers.** `next.config.ts` applies the security header block to every
   response before the route handler runs.
4. **Client hydration.** Only the header, mobile menu, filters, form widgets
   and the lazy newsletter dialog are client components. Page bodies are
   Server Components.
5. **Form submit.** A Server Action validates, rate-limits, sanitises and
   delivers, then returns a serialisable state to `useActionState`.

## 4. Data flow

```
JSON collection → typed loader (src/content/*.ts) → page + metadata + JSON-LD
                                              └→ sitemap.ts
```

Loaders add sorting, grouping and derived fields. They do not mutate content.
Because the JSON is build-time input, it is type-asserted rather than
runtime-validated; user input is a different path and is always validated with
Zod.

```
FormData → server action → honeypot/timing → Zod → rate limits
        → email transport → reference + typed FormState → UI
```

A `FormState` carries `status`, a human message, optional field errors, an
optional retry hint and the transport used. The UI renders exactly what the
server reports; it cannot turn a failed delivery into a success message.

## 5. Component layers

| Layer | Examples | Notes |
|---|---|---|
| Layout | `site-header`, `site-footer`, `container`, `logo` | Header is the main client island; footer links are static |
| Content | `article-card`, `case-study-card`, `product-plate`, `legal-page` | Presentational, server-rendered |
| Forms | `contact-form`, `newsletter-form`, `career-application-form` | Client components bound to Server Actions |
| Motion | `reveal`, `reveal-observer` | One observer, CSS transitions, reduced-motion aware |
| UI | `button`, `accordion`, `breadcrumbs`, `marquee`, `tag` | Small primitives, no component library runtime |
| SEO | `json-ld` | Renders a JSON script tag from a typed object |

Motion is imported only by the lazily loaded newsletter dialog
(`LazyMotion` + `domAnimation`). Every other animation is CSS, so the animation
runtime is not in the initial bundle.

## 6. Security boundary

- **Public input** is the three Server Actions and the revalidation endpoint.
  All are validated server-side. The revalidation endpoint requires a bearer
  secret of at least 32 characters, compares it in constant time and returns
  `503` when unconfigured, `401` on mismatch and `400` on bad JSON.
- **Secrets** are read through `src/lib/env.ts`, which validates the
  environment at startup, rejects half-configured Upstash pairs and refuses a
  short revalidation secret. Nothing secret is prefixed `NEXT_PUBLIC_`.
- **Headers and CSP** are centralised in `next.config.ts` so a new route cannot
  silently miss them. `scripts/verify-headers.mjs` checks the result.
- **Logging** records a random reference, the form kind and transport failures.
  It does not record message bodies, email addresses or IPs.

More detail: [security](security.md).

## 7. Caching and revalidation

| Resource | Policy |
|---|---|
| HTML (20 route patterns) | `max-age=0, s-maxage=300, stale-while-revalidate=86400` |
| `/_next/static/*` | `max-age=31536000, immutable` |
| `sitemap.xml`, `robots.txt` | `max-age=0, s-maxage=3600, stale-while-revalidate=86400` |
| `/images/*`, `/brand/*` | `max-age=604800, stale-while-revalidate=86400` |
| `/api/*` | `no-store, max-age=0` |

Content changes reach the edge on the next revalidation window (up to five
minutes) or immediately via `POST /api/revalidate` with the bearer secret and a
list of paths. A deploy invalidates the build output and is the normal path for
content edits.

## 8. Failure behaviour

- A route render error is caught by `(marketing)/error.tsx`, which offers a
  reset and a link home and logs only the digest.
- A failure above the marketing layout falls back to `global-error.tsx`, which
  imports the global stylesheet and remains usable.
- Unknown URLs render the branded 404 with a `404` status.
- If email is unconfigured or fails, the form reports the failure and shows the
  public contact address.
- If Redis is unreachable, the limiter logs once and falls back to memory
  instead of taking forms offline.
- If the CSP report endpoint is called with the wrong method, it returns `405`.
