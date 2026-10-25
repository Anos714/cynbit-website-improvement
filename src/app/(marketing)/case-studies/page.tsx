import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CaseStudyCard } from "@/components/content/case-study-card";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { caseStudies } from "@/content/case-studies";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Explore 13 public Cynbit case studies across software engineering, cloud strategy and digital marketing. Challenge, solution and client-reported outcome.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  const [lead, ...rest] = caseStudies;

  return (
    <>
      <PageHeader
        title="Proof, not promises."
        intro="A public library of technical work: the constraint, the architecture and what changed. Real outcomes, documented with the client context intact."
        tone="peach"
      >
        <div className="rounded-card bg-shell p-6">
          <p className="font-headline text-[clamp(2.5rem,4vw,4rem)] font-extrabold leading-none tracking-[-0.06em] text-brand">
            {caseStudies.length}
          </p>
          <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-muted">
            public case studies across software, cloud and growth.
          </p>
        </div>
      </PageHeader>

      {lead ? (
        <section className="pb-16 pt-2 md:pb-24">
          <Container>
            <Reveal>
              <Link
                href={`/case-studies/${lead.slug}`}
                className="group grid overflow-hidden rounded-card bg-brand-deep text-white lg:grid-cols-[1.02fr_0.98fr]"
              >
                <div className="flex flex-col justify-between p-6 md:p-10 lg:p-12">
                  <div>
                    <Tag tone="on-dark">{lead.category}</Tag>
                    <p className="mt-8 text-sm font-bold text-peach">{lead.client}</p>
                    <h2 className="mt-2 max-w-[14ch] font-headline text-[clamp(2.1rem,4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
                      {lead.title}
                    </h2>
                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                      {lead.summary}
                    </p>
                  </div>
                  <div className="mt-10 flex items-end justify-between gap-6">
                    <div>
                      <p className="font-headline text-[clamp(2.2rem,3.5vw,3.5rem)] font-extrabold leading-none tracking-[-0.05em] text-peach">
                        {lead.metricValue}
                      </p>
                      <p className="mt-1 text-sm text-white/55">
                        {lead.metricLabel} · client-reported
                      </p>
                    </div>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-deep transition-colors group-hover:bg-amber">
                      <ArrowUpRight aria-hidden="true" className="size-5" />
                    </span>
                  </div>
                </div>
                <div className="relative min-h-[21rem]">
                  <Image
                    src={lead.image}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                </div>
              </Link>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section className="bg-shell section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="The full library."
              intro="Every study below is drawn from Cynbit's published public work. Metrics are client-reported, not independently audited."
              action={
                <ButtonLink href="/contact" variant="secondary">
                  Discuss your constraint
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
              }
            />
          </Reveal>

          <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((study, index) => (
              <Reveal key={study.slug} delay={(index % 3) * 0.05}>
                <CaseStudyCard study={study} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-mint p-7 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch]">Engineering global success.</h2>
              <p className="body-lead mt-5">
                Our method is not just about code. It is about business resilience, integrated with
                your vision so the system can outlast the trend.
              </p>
            </div>
            <ButtonLink href="/contact" size="large">
              Start a project
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
