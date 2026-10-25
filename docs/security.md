# Security

## 1. Scope

This document describes the security posture of the rebuild. It is not a
penetration test. The assessment's audit was passive and this rebuild does not
claim more than the configuration and tests demonstrate.

The public surface is small on purpose:

- HTML pages and static assets.
- Three Server Actions: contact, newsletter, career application.
- Three API routes: health, revalidation, CSP report.

There is no authentication, admin UI, database, payment flow or user account.

## 2. Response headers

Applied to every response by `next.config.ts`:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | see below | Restrict script, style, frame and form origins |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Two-year HTTPS enforcement, including subdomains |
| `X-Content-Type-Options` | `nosniff` | Stop MIME sniffing |
| `X-Frame-Options` | `DENY` | Legacy clickjacking defence |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit cross-origin referrer leakage |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb, browsing-topics disabled | Remove unused capabilities |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolate the browsing context |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevent cross-origin embedding of resources |
| `X-Powered-By` | removed (`poweredByHeader: false`) | Reduce framework fingerprinting |

No `Access-Control-Allow-Origin` header is emitted, so the wildcard CORS
finding (SEC-03) is closed. `scripts/verify-headers.mjs` fails if any of these
headers, the HTML cache policy or the absence of a wildcard CORS header
changes.

### 2.1 Content Security Policy

Production policy:

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self';
media-src 'self';
manifest-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
frame-src 'none';
worker-src 'self' blob:;
report-uri /api/csp-report;
upgrade-insecure-requests            (only on Vercel)
```

Development drops `upgrade-insecure-requests`, adds `'unsafe-eval'` for React
refresh and sends the policy as `Content-Security-Policy-Report-Only` so the
developer console is usable. Production enforces it.

There is **no per-request nonce**. A nonce must appear in the HTML, which would
force the prerendered marketing pages to render dynamically. That directly
contradicts the cache and TTFB improvements required by PERF-02 and PERF-03.
The alternative — hashes for every inline script — is brittle under a framework
that emits its own bootstrap scripts. The policy therefore allows
`'unsafe-inline'` for scripts and styles.

This is a real weakening: `'unsafe-inline'` means an HTML injection that reaches
the page could execute script. The compensating controls are that all user
input is validated and never rendered as HTML, React escapes by default, no
third-party script is allowed, and `object-src`, `base-uri` and `form-action`
are locked down. The documented follow-up is a nonce on the dynamic form routes
plus build-time hashes on static pages, evaluated against the cache cost.

`CSP_ENFORCE=false` downgrades production to Report-Only without a code change.
That switch exists for incident response, not as a normal mode.

### 2.2 HSTS

`includeSubDomains` is set. `preload` is deliberately not set: submission is a
long-lived commitment, and the audit itself recommends a subdomain inventory
first. On the Vercel hostname this is low risk; on a future `cynbit.in`
deployment, every subdomain must be HTTPS before preload is submitted.

### 2.3 CSP reports

`POST /api/csp-report` returns `204` and discards the payload. Reports can
contain URLs and are noisy; the endpoint exists so the browser has a valid sink
without storing unvalidated third-party data. Any other method returns `405`.

## 3. Form threat model

| Threat | Control |
|---|---|
| Spam bots | Hidden honeypot field; a filled field returns a plausible success without processing |
| Naive automated posts | Minimum 2.5 s between form render and submit |
| Oversized or malformed input | Zod schemas with string, email, URL and length limits |
| Flooding one IP | 5 submissions per 10 minutes |
| Flooding one address | 3 per email per hour |
| Flooding one mail domain | 15 per domain per hour |
| Email header injection | `\r` and `\n` stripped from subject, sender and reply-to; length capped |
| Enumeration via errors | Generic field errors; no account or address existence checks |
| Log leakage | Only a random UUID reference, form kind and transport status are logged |
| False success | If delivery is unconfigured or fails, the UI reports failure and shows the public email address |

Rate limiting uses Upstash's sliding window when `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` are both set. Without them the app uses a
per-instance in-memory map and says so in the documentation. The in-memory
fallback is best-effort under concurrency and resets on deploy; it is not
presented as equivalent to Redis.

The three limits are evaluated in order and the first rejection wins. The
response includes a retry hint in seconds, and the UI shows it rather than a
generic error.

## 4. Revalidation endpoint

`POST /api/revalidate`:

- returns `503` when `REVALIDATE_SECRET` is unset;
- requires `Authorization: Bearer <secret>`;
- compares the token with `crypto.timingSafeEqual`, with a length check first;
- rejects invalid JSON with `400`;
- accepts only 1–20 paths that start with `/` and are at most 300 characters;
- revalidates those paths and returns `no-store`.

The secret must be at least 32 characters; the environment schema refuses to
start with a shorter value. The endpoint is excluded from `robots.txt` along
with the rest of `/api/`.

## 5. Secrets and environment

`src/lib/env.ts` parses the environment at startup with Zod:

- optional URLs, emails and text are trimmed; blank strings become unset;
- Upstash URL and token must be configured together;
- `EMAIL_TRANSPORT=resend` requires the API key, destination and verified
  sender;
- `REVALIDATE_SECRET` has a 32-character minimum;
- `CSP_ENFORCE` accepts only `true` or `false`.

A misconfiguration fails the build or boot instead of silently degrading. No
secret uses the `NEXT_PUBLIC_` prefix, so none is inlined into client bundles.
`.env` files are ignored; `.env.example` documents the shape without values.

## 6. Dependency and supply-chain posture

- Lockfile committed; CI uses `npm ci`.
- Runtime dependencies are limited to Next, React, Zod, clsx/tailwind-merge,
  lucide-react, motion and the Upstash clients.
- No analytics, tag manager, ad script or third-party font is loaded. This
  removes an entire class of supply-chain and privacy risk and closes PERF-05.
- Playwright, axe and Lighthouse are development-only dependencies.
- `server-only` guards the env, email and rate-limit modules so they cannot be
  imported into a client component.

## 7. Verification

`npm run verify:headers -- http://localhost:3100` checks:

- `200` on `/` and `/careers`;
- the exact `s-maxage=300` and `stale-while-revalidate=86400` values;
- CSP presence, directives, report URI and enforcement mode;
- HSTS, nosniff, `DENY`, referrer, permissions, COOP, CORP;
- no `X-Powered-By` and no wildcard CORS;
- immutable static assets;
- 82 sitemap URLs, robots and `security.txt`;
- `no-store` on health and `405` on wrong methods.

The Playwright route sweep also listens for `securitypolicyviolation` events in
every page and fails if one fires. With the production policy enforced, all 82
routes produced zero violations.

## 8. Residual risks

1. **`'unsafe-inline'` in script-src** — the main residual XSS
   defence-in-depth gap. Mitigated by escaping, no HTML injection sinks and no
   third-party scripts, but not eliminated.
2. **No HSTS preload** — the first request to a new hostname is still
   downgradeable. `includeSubDomains` reduces, but does not remove, this.
3. **In-memory rate limiting without Redis** — weaker under concurrency and
   reset on deploy.
4. **Email is the only delivery channel** — a Resend outage means forms fail
   closed with a visible error. That is intentional, but it is availability
   risk.
5. **No WAF or bot challenge** — rate limits and a honeypot stop casual abuse,
   not a distributed targeted flood.
6. **Demo transport** — without credentials, submissions are accepted but not
   delivered. This is a deployment limitation, not a security control.
