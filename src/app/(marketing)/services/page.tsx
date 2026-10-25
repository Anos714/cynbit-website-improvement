import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { servicePractices, technologyGroups } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Cynbit's service ecosystem: autonomous AI agents, full-stack software development, cloud architecture, technical SEO and growth engineering.",
  alternates: { canonical: "/services" },
};

const tone = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
} as const;

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Built for scale."
        intro="AI automation, software engineering and growth systems designed for the business you are becoming, not only the one you are today."
        tone="sky"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white md:p-7">
          <p className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
            Not sure which practice you need?
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            Start with the outcome. We will help you find the shortest responsible path to it.
          </p>
          <ButtonLink href="/contact" variant="on-dark" className="mt-5">
            Describe the problem
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </PageHeader>

      <nav aria-label="Service practices" className="bg-ground">
        <Container>
          <ul className="no-scrollbar flex gap-2 overflow-x-auto py-4">
            {servicePractices.map((practice) => (
              <li key={practice.id}>
                <Link
                  href={`#${practice.id}`}
                  className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-shell px-4 text-sm font-semibold transition-colors hover:bg-mint"
                >
                  {practice.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#stack"
                className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-shell px-4 text-sm font-semibold transition-colors hover:bg-mint"
              >
                Technology stack
              </Link>
            </li>
          </ul>
        </Container>
      </nav>

      <div className="section-space grid gap-5">
        {servicePractices.map((practice, practiceIndex) => (
          <section key={practice.id} id={practice.id} className="scroll-mt-28">
            <Container>
              <Reveal delay={practiceIndex * 0.03}>
                <div className={`rounded-card ${tone[practice.tone]} p-6 md:p-10 lg:p-12`}>
                  <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    <div>
                      <h2 className="display-section max-w-[10ch]">{practice.title}</h2>
                      <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                        {practice.summary}
                      </p>
                      <ArrowLink href="/contact" className="mt-6">
                        Talk through this practice
                      </ArrowLink>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {practice.services.map((service) => (
                        <article
                          key={service.title}
                          className="flex min-h-44 flex-col rounded-[1.3rem] bg-shell p-5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                              {service.title}
                            </h3>
                            <ArrowUpRight aria-hidden="true" className="size-4 text-brand" />
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-muted">
                            {service.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>

      <section id="stack" className="scroll-mt-20 bg-brand-deep py-16 text-white md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[10ch] text-white">The architectural stack.</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                Tools are not the strategy. But the choices still matter. We use a deliberately broad,
                proven stack and select it against the constraints of the system.
              </p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2">
              {technologyGroups.map((group, index) => (
                <Reveal key={group.title} delay={index * 0.04}>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold tracking-[-0.03em] text-white">
                      {group.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Tag key={item} tone="on-dark">
                          {item}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-peach p-7 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch]">One system, or one well-chosen module.</h2>
              <p className="body-lead mt-5">
                We can own the full architecture or step in where the constraint is sharpest. Either
                way, the thinking stays visible.
              </p>
            </div>
            <ButtonLink href="/contact" size="large">
              Start with a conversation
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
