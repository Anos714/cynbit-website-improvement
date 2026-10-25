import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Quote } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDiaryEntry, getRelatedDiaryEntries, diaryEntries } from "@/content/diaries";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return diaryEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDiaryEntry(slug);

  if (!entry) return { title: "Diary entry not found" };

  return {
    title: entry.title,
    description: `${entry.quote} A student diary entry published by BitElevate and Cynbit Technologies.`,
    alternates: { canonical: `/diaries/${entry.slug}` },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.quote,
      url: `/diaries/${entry.slug}`,
      publishedTime: new Date(entry.date).toISOString(),
    },
  };
}

export default async function DiaryEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getDiaryEntry(slug);

  if (!entry) notFound();

  const related = getRelatedDiaryEntries(entry, 2);
  const canonicalUrl = `${site.url}/diaries/${entry.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: entry.title,
        description: entry.quote,
        datePublished: new Date(entry.date).toISOString(),
        dateModified: new Date(entry.date).toISOString(),
        author: { "@type": "Person", name: entry.author },
        publisher: {
          "@type": "Organization",
          name: "Cynbit Technologies",
          url: site.url,
        },
        mainEntityOfPage: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Student diaries", item: `${site.url}/diaries` },
          { "@type": "ListItem", position: 2, name: entry.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="pb-10 pt-8 md:pb-14 md:pt-12">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Student diaries", href: "/diaries" },
                { label: entry.role, href: "/diaries" },
                { label: entry.title },
              ]}
            />
            <div className="max-w-4xl">
              <p className="text-sm font-bold text-brand">
                {formatDate(entry.date)} · {entry.role}
              </p>
              <h1 className="mt-4 max-w-[20ch] font-headline text-[clamp(2.5rem,5.4vw,5.4rem)] font-extrabold leading-[0.96] tracking-[-0.058em]">
                {entry.title}
              </h1>
              <blockquote className="mt-8 rounded-card bg-peach p-6 font-headline text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.045em] md:p-8">
                “{entry.quote}”
              </blockquote>
            </div>
          </Container>
        </header>

        <section className="py-14 md:py-20">
          <Container>
            <div className="mx-auto grid max-w-[64rem] gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
              <div className="min-w-0">
                <div className="grid gap-5">
                  {entry.paragraphs.filter((paragraph) => paragraph !== entry.quote).map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={
                        index === 0
                          ? "font-headline text-[clamp(1.35rem,2.4vw,1.85rem)] font-bold leading-[1.35] tracking-[-0.025em] text-ink"
                          : "text-lg leading-[1.8] text-muted"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-10 flex items-center gap-3 rounded-card bg-mint px-5 py-4 text-sm leading-relaxed text-muted">
                  <Quote aria-hidden="true" className="size-5 shrink-0 text-brand" />
                  Published anonymously, with permission. Names are withheld to protect the student.
                </div>
                <Link
                  href="/diaries"
                  className="mt-10 inline-flex min-h-11 items-center gap-2 font-bold text-brand"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back to the diaries
                </Link>
              </div>

              <aside className="grid gap-4 lg:sticky lg:top-28">
                <div className="rounded-card bg-shell p-5">
                  <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                    The student diaries
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Real stories about pressure, belonging, direction and the parts of college that
                    do not make it into the brochure.
                  </p>
                  <p className="mt-4 text-sm text-muted">
                    <span className="font-bold text-ink">{entry.author}</span> · {entry.role}
                  </p>
                </div>
                <div className="rounded-card bg-brand-deep p-5 text-white">
                  <p className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                    Have a story worth telling?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Student diaries are published with care and consent.
                  </p>
                  <ButtonLink href="/contact?interest=bitelevate" variant="on-dark" className="mt-5 w-full">
                    Share your story
                  </ButtonLink>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      {related.length ? (
        <section className="bg-shell py-14 md:py-20">
          <Container>
            <h2 className="display-section max-w-[12ch]">More from the diaries.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {related.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/diaries/${item.slug}`}
                  className={`group flex min-h-56 flex-col justify-between rounded-card p-6 ${
                    index === 0 ? "bg-mint" : "bg-peach"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Quote aria-hidden="true" className="size-5 text-brand" />
                    <span className="text-xs font-semibold text-muted">{formatDate(item.date)}</span>
                  </div>
                  <div className="mt-8">
                    <blockquote className="font-headline text-2xl font-extrabold leading-[1.05] tracking-[-0.04em]">
                      “{item.quote}”
                    </blockquote>
                    <p className="mt-4 flex items-center justify-between gap-3 text-base font-bold text-brand">
                      {item.title}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
