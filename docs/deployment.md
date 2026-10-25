# Deployment

## 1. Target

- **Platform:** Vercel, Node.js 22.19.0
- **Framework preset:** Next.js (auto-detected)
- **Build command:** `npm run build`
- **Output:** `.next` (handled by the preset)
- **Install command:** `npm ci`
- **Repository:** `https://github.com/Anos714/cynbit-website-improvement`
- **Live URL:** `https://cynbit-website-improvement.vercel.app`

The site is static/ISR. No database, queue, cron or long-running worker is
required.

## 2. Environment variables

Set these in **Project → Settings → Environment Variables** for Production (and
Preview if desired). Only the first is needed for a functional site; the rest
enable real email, distributed rate limiting and on-demand revalidation.

| Variable | Required | Example / notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://cynbit-website-improvement.vercel.app` — no trailing slash; used for canonicals, sitemap, JSON-LD and `security.txt` |
| `EMAIL_TRANSPORT` | No | `resend` or `demo`. Leave unset to auto-detect: Resend when all three credentials exist, otherwise demo |
| `RESEND_API_KEY` | For email | Resend API key |
| `CONTACT_TO_EMAIL` | For email | `opportunities@cynbit.in` |
| `RESEND_FROM_EMAIL` | For email | A sender verified in Resend, e.g. `Cynbit Website <website@cynbit.in>` |
| `UPSTASH_REDIS_REST_URL` | Recommended | Must be set together with the token |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Must be set together with the URL |
| `REVALIDATE_SECRET` | Optional | At least 32 random characters; enables `POST /api/revalidate` |
| `CSP_ENFORCE` | No | Defaults to enforced in production. Set `false` only to downgrade to Report-Only temporarily |

The environment schema refuses to boot with a half-configured Upstash pair, a
short revalidation secret, or `EMAIL_TRANSPORT=resend` without credentials.

## 3. Deploy with the Vercel CLI

From the repository root, using local authentication:

```bash
npx vercel login
npx vercel link --yes
npx vercel env add NEXT_PUBLIC_SITE_URL production
# repeat for the optional variables you have
npx vercel --prod
```

The CLI prints the deployment URL. If Vercel assigns a different hostname than
expected, update `NEXT_PUBLIC_SITE_URL`, `public/.well-known/security.txt`
(Canonical and Policy) and the README link, then redeploy.

Alternative: import the GitHub repository in the Vercel dashboard, keep the
detected Next.js settings, add the environment variables and deploy. Pull
requests receive preview deployments; `main` is production.

## 4. GitHub setup

```bash
git remote add origin https://github.com/Anos714/cynbit-website-improvement.git
git push -u origin main
git push origin --all
git push origin --tags
```

Branches document the build sequence: `chore/bootstrap`, `feat/design-system`,
`feat/site-shell`, `feat/core-pages`, `feat/content-collections`,
`feat/backend-actions`, `feat/security-hardening`, `feat/perf-seo`,
`feat/qa-evidence`.

CI runs on pushes and pull requests to `main`:

1. quality — install, lint, typecheck, unit tests, build, route parity;
2. e2e — install Chromium, build, start the production server, run Playwright,
   upload the report on failure.

The e2e job needs no secrets. It runs in demo email mode and the Playwright
config reuses a running server locally but starts its own in CI.

## 5. Post-deploy verification

Run these against the deployed origin:

```bash
export URL=https://cynbit-website-improvement.vercel.app

curl -sSI "$URL/" | grep -iE 'content-security-policy|strict-transport-security|cache-control|x-powered-by'
curl -sS "$URL/sitemap.xml" | grep -c '<loc>'
curl -sS "$URL/robots.txt"
curl -sS "$URL/.well-known/security.txt"
curl -s -o /dev/null -w '%{http_code}\n' "$URL/api/health"

npx playwright install chromium
PLAYWRIGHT_BASE_URL="$URL" npx playwright test
```

`scripts/verify-headers.mjs` also accepts a base URL:

```bash
node scripts/verify-headers.mjs "$URL"
```

Do **not** run the form submission tests against production unless you intend
to create real submissions. In demo mode they only log references; with Resend
configured they send mail.

Check the deployment headers for `CSP_ENFORCE`: the expected response uses
`Content-Security-Policy`, not `Content-Security-Policy-Report-Only`.

## 6. On-demand revalidation

```bash
curl -X POST "$URL/api/revalidate" \
  -H "Authorization: Bearer $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/careers","/blog/some-slug"]}'
```

The endpoint returns `503` when unconfigured, `401` on a bad token and `400` on
an invalid body. Paths must start with `/`; 1–20 per request.

## 7. Rollback

Vercel keeps immutable deployments. To roll back, promote the previous
deployment in the dashboard or run `npx vercel rollback`. A code rollback via
Git is also safe: content and configuration are versioned and the build is
deterministic.

## 8. Custom domain later

When Cynbit points a custom domain at the deployment:

1. Add the domain in Vercel and complete DNS verification.
2. Update `NEXT_PUBLIC_SITE_URL` to the canonical custom origin and redeploy.
3. Update `security.txt` Canonical/Policy URLs.
4. Inventory subdomains before submitting HSTS `preload`.
5. Re-run the header and Lighthouse checks against the custom origin; TLS
   termination and cache behaviour can differ from the `*.vercel.app` host.

## 9. Operational notes

- The in-memory rate limiter is per instance. Configure Upstash for meaningful
  limits across serverless instances.
- Without Resend credentials the forms accept submissions in demo mode and the
  UI says so. Configure email before treating the contact channel as live.
- The health endpoint is `GET /api/health` and returns `no-store`; use it for
  uptime checks, not for readiness of external providers.
- CSP reports are discarded by `/api/csp-report`. Add a collector before
  relying on reports for monitoring.
