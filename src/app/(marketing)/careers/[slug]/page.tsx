import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, MapPin } from "lucide-react";
import { CareerApplicationForm } from "@/components/forms/career-application-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import { careerExperience, careerSummary, careers, getCareer } from "@/content/careers";
import { site } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return careers.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = getCareer(slug);

  if (!role) return { title: "Role not found" };
  const summary = careerSummary(role);

  return {
    title: role.title,
    description: `${role.title} at Cynbit Technologies. ${summary} ${role.location}.`,
    alternates: { canonical: `/careers/${role.slug}` },
    openGraph: {
      type: "article",
      title: `${role.title} at Cynbit`,
      description: summary,
      url: `/careers/${role.slug}`,
    },
  };
}

export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params;
  const role = getCareer(slug);

  if (!role) notFound();

  const summary = careerSummary(role);
  const experience = careerExperience(role);
  const related = careers
    .filter((item) => item.slug !== role.slug && item.department === role.department)
    .slice(0, 3);
  const canonicalUrl = `${site.url}/careers/${role.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${role.title} at Cynbit`,
        description: summary,
        mainEntityOfPage: canonicalUrl,
        about: {
          "@type": "Organization",
          name: "Cynbit Technologies",
          url: site.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Careers", item: `${site.url}/careers` },
          { "@type": "ListItem", position: 2, name: role.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="bg-mint pb-14 pt-8 md:pb-20 md:pt-12">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Careers", href: "/careers" },
                { label: role.department, href: "/careers" },
                { label: role.title },
              ]}
            />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div>
                <Tag>{role.department}</Tag>
                <h1 className="mt-5 max-w-[17ch] font-headline text-[clamp(2.7rem,5.6vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.06em]">
                  {role.title}
                </h1>
                <p className="body-lead mt-6 max-w-2xl">{summary}</p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
                  <span className="inline-flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-4 text-brand" />
                    {role.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness aria-hidden="true" className="size-4 text-brand" />
                    {role.type}
                  </span>
                </div>
              </div>
              <div className="rounded-card bg-shell p-5">
                <p className="text-sm font-semibold text-muted">Ready to apply?</p>
                <p className="mt-2 font-headline text-xl font-extrabold leading-tight tracking-[-0.035em]">
                  Send the work, not just the resume.
                </p>
                <Link href="#apply" className="button-base button-primary mt-5 w-full">
                  Apply for this role
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </Container>
        </header>

        <section className="py-14 md:py-20">
          <Container>
            <div className="mx-auto grid max-w-[68rem] gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <div>
                <section>
                  <h2 className="font-headline text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-[-0.045em]">
                    What you will own.
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {role.responsibilities.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-muted">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint text-brand">
                          <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="font-headline text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-[-0.045em]">
                    What we are looking for.
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {role.requirements.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-12 rounded-card bg-shell p-6 md:p-8">
                  <h2 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                    What you get.
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.benefits.map((benefit) => (
                      <Tag key={benefit}>{benefit}</Tag>
                    ))}
                  </div>
                </section>

                <section id="apply" className="scroll-mt-28 pt-14">
                  <h2 className="font-headline text-[clamp(2rem,3.6vw,3.2rem)] font-extrabold tracking-[-0.05em]">
                    Apply for {role.title}.
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
                    Send a concise application with links to the work you are proud of. We ask for
                    links rather than file uploads in this first step.
                  </p>

                  <CareerApplicationForm roleSlug={role.slug} roleTitle={role.title} />
                </section>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-card bg-brand-deep p-5 text-white">
                  <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                    Role details
                  </p>
                  <dl className="mt-5 grid gap-4 text-sm">
                    <div>
                      <dt className="text-white/65">Team</dt>
                      <dd className="mt-0.5 font-semibold">{role.department}</dd>
                    </div>
                    <div>
                      <dt className="text-white/65">Location</dt>
                      <dd className="mt-0.5 font-semibold">{role.location}</dd>
                    </div>
                    <div>
                      <dt className="text-white/65">Type</dt>
                      <dd className="mt-0.5 font-semibold">{role.type}</dd>
                    </div>
                    {experience ? (
                      <div>
                        <dt className="text-white/65">Experience</dt>
                        <dd className="mt-0.5 font-semibold">{experience}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
                <Link href="/careers" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  All open roles
                </Link>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      {related.length ? (
        <section className="bg-shell py-14 md:py-20">
          <Container>
            <h2 className="display-section max-w-[12ch]">Other roles, same team.</h2>
            <div className="mt-8 grid gap-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/careers/${item.slug}`}
                  className="group flex items-center justify-between gap-5 rounded-[1.2rem] bg-ground px-5 py-4 transition-colors hover:bg-mint"
                >
                  <div>
                    <p className="font-headline text-lg font-extrabold tracking-[-0.025em]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.department} · {item.type}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
