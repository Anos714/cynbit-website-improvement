import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CaseStudyCard } from "@/components/content/case-study-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { site } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return { title: "Case study not found" };

  return {
    title: `${study.client}: ${study.title}`,
    description: `${study.summary} A public Cynbit case study with the challenge, solution and client-reported outcome.`,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title: `${study.client}: ${study.title}`,
      description: study.summary,
      url: `/case-studies/${study.slug}`,
      images: [{ url: study.image, alt: `${study.client} case study` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.client}: ${study.title}`,
      description: study.summary,
      images: [study.image],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const related = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 3);
  const canonicalUrl = `${site.url}/case-studies/${study.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: `${study.client}: ${study.title}`,
        description: study.summary,
        image: `${site.url}${study.image}`,
        about: study.client,
        creator: {
          "@type": "Organization",
          name: "Cynbit Technologies",
          url: site.url,
        },
        mainEntityOfPage: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Case studies",
            item: `${site.url}/case-studies`,
          },
          { "@type": "ListItem", position: 2, name: study.client },
          { "@type": "ListItem", position: 3, name: study.title, item: canonicalUrl },
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
                { label: "Case studies", href: "/case-studies" },
                { label: study.client },
                { label: study.title },
              ]}
            />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.4fr)] lg:items-end">
              <div>
                <p className="text-sm font-bold text-brand">{study.category}</p>
                <p className="mt-4 text-lg font-bold text-muted">{study.client}</p>
                <h1 className="mt-2 max-w-[17ch] font-headline text-[clamp(2.6rem,5.4vw,5.4rem)] font-extrabold leading-[0.96] tracking-[-0.058em]">
                  {study.title}
                </h1>
                <p className="body-lead mt-6 max-w-2xl">{study.summary}</p>
              </div>
              <div className="rounded-card bg-brand-deep p-6 text-white">
                <p className="font-headline text-[clamp(3rem,5vw,5rem)] font-extrabold leading-none tracking-[-0.06em] text-peach">
                  {study.metricValue}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{study.metricLabel}</p>
                <p className="mt-4 text-xs text-white/65">Client-reported outcome</p>
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint md:aspect-[2.35/1]">
            <Image
              src={study.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <section className="py-14 md:py-20">
          <Container>
            <div className="mx-auto grid max-w-[68rem] gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <div>
                <section>
                  <h2 className="font-headline text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-[-0.045em]">
                    The challenge
                  </h2>
                  <p className="mt-4 text-base leading-[1.8] text-muted md:text-lg">
                    {study.challenge}
                  </p>
                </section>

                <section className="mt-12">
                  <h2 className="font-headline text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-[-0.045em]">
                    The architecture
                  </h2>
                  <p className="mt-4 text-base leading-[1.8] text-muted md:text-lg">
                    {study.solution}
                  </p>
                </section>

                <div className="mt-12 rounded-card bg-brand-deep p-6 text-white md:p-8">
                  <Tag tone="on-dark">Outcome</Tag>
                  <p className="mt-5 font-headline text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold leading-[1.04] tracking-[-0.045em]">
                    {study.outcome}
                  </p>
                  <p className="mt-5 text-sm text-white/65">
                    This result is client-reported and reflects the published case study, not an
                    independently audited benchmark.
                  </p>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-card bg-shell p-5">
                  <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                    At a glance
                  </p>
                  <dl className="mt-5 grid gap-4 text-sm">
                    {[
                      ["Client", study.client],
                      ["Service", study.category],
                      ["Completed", study.completion],
                      ["Status", "Public case study"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-muted">{label}</dt>
                        <dd className="mt-0.5 font-bold text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="mt-4 rounded-card bg-peach p-5">
                  <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                    A similar constraint?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Bring us the specifics. We will tell you what we would test first.
                  </p>
                  <ButtonLink href="/contact" className="mt-4 w-full">
                    Start a conversation
                  </ButtonLink>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      <section className="bg-shell py-14 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="display-section max-w-[12ch]">More public work.</h2>
            <ButtonLink href="/case-studies" variant="secondary">
              All case studies
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {related.map((item) => (
              <CaseStudyCard key={item.slug} study={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
