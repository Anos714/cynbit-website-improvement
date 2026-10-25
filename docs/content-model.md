# Content model

## 1. Collections

Content is stored as JSON under `src/content/data/` and wrapped by typed
loaders. There is no CMS or database; the collections are build-time input.

| Collection | Entries | Loader | Route |
|---|---:|---|---|
| `blog.json` | 25 | `src/content/blog.ts` | `/blog`, `/blog/[slug]` |
| `case-studies.json` | 13 | `src/content/case-studies.ts` | `/case-studies`, `/case-studies/[slug]` |
| `careers.json` | 20 | `src/content/careers.ts` | `/careers`, `/careers/[slug]` |
| `diaries.json` | 8 | `src/content/diaries.ts` | `/diaries`, `/diaries/[slug]` |

Together with the 16 top-level pages, this produces the 82 sitemap URLs.

## 2. Shapes

Each loader declares its type and the fields its pages rely on:

- **Blog** — slug, title, description, category, read time, publication date,
  author and role, image, and an ordered array of typed blocks (`p`, `h2`,
  `h3`, `quote`, `list`, `ordered-list`, `figure` with alt text).
- **Case study** — slug, client, category, title, summary, challenge, solution,
  outcome, completion date, status, image, and a metric value/label pair.
- **Career** — slug, title, description, department, location, type,
  responsibilities, requirements and benefits. Full-time roles sort before
  internships.
- **Diary** — slug, title, date, author, role, paragraphs, image and quote.

Loaders may derive presentation fields (for example, the career summary strips
an `Experience:` prefix from the description), but they do not rewrite the
source content.

## 3. Date policy

Dates are the part of structured data most likely to be fabricated, so the
rules are explicit:

| Collection | Source date | Used for |
|---|---|---|
| Blog | `publishedAt` | Sitemap `lastmod`, `BlogPosting.datePublished` |
| Case study | `completion` | Sitemap `lastmod` |
| Diary | `date` | Sitemap `lastmod` |
| Careers | none per role | `CAREERS_POSTED_AT` / `CAREERS_VALID_THROUGH` constants for `JobPosting`; sitemap omits `lastmod` |
| Top-level pages | none | Sitemap omits `lastmod` |

`CAREERS_POSTED_AT = 2026-10-25` and
`CAREERS_VALID_THROUGH = 2027-01-23` in `src/content/careers.ts` describe when
the current role set was published and when it should be reviewed. They are
documented constants because the supplied content has no per-role dates.
`JobPosting` requires both fields; the sitemap does not pretend to know an
update date.

This is the PERF-04 fix: no `lastmod` is generated from the request clock. An
absent date is honest; a false one is not.

## 4. Page generation

Collection routes:

```ts
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
```

Consequences:

- every known slug is prerendered at build;
- an unknown slug is a real 404;
- the edge may serve a copy for up to five minutes;
- `POST /api/revalidate` can purge a path immediately after a content change.

Metadata is generated per page: title, description, canonical URL and Open
Graph data. Blog and career pages also emit JSON-LD (`BlogPosting` or
`JobPosting` plus `BreadcrumbList`) built from the same content object the page
renders, so the visible page and the structured data cannot drift apart.

## 5. Validation boundary

The JSON is trusted build-time input, so it is type-asserted rather than
runtime-validated. TypeScript catches shape mistakes at build time; a malformed
collection fails the build instead of shipping a broken page.

User input is a different boundary and is always validated with Zod in the
server action. Do not relax that distinction: adding runtime validation to
static content would add startup cost without protecting against an untrusted
source, while removing Zod from a form would expose the write path.

## 6. Editing workflow

1. Edit the relevant JSON file.
2. Run `npm run build` — the route list and type checks validate the change.
3. Run `npm run verify:routes` to confirm the sitemap and generated HTML still
   match the collections.
4. If a role closes or a page changes urgently, call the revalidation endpoint
   with the affected paths; otherwise the five-minute ISR window applies.

Do not add placeholder dates, testimonials, client results or metrics. The
case-study metric values come from the supplied public content; if a value
cannot be verified, omit it rather than inventing one.

## 7. Images and fonts

- Content images live under `public/images/` and are referenced by path; Next
  serves AVIF/WebP variants with a one-year minimum cache TTL.
- Team and brand assets live under `public/images/team/` and `public/brand/`.
- The two text fonts are stored in `src/app/fonts/` and loaded through
  `next/font/local`; their OFL licence files sit next to them.
- `public/og-default.png` is the 1200×630 social image used when a page has no
  specific image.
