import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Mail, MoveUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { teamMembers, teamValues } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The team",
  description:
    "Meet the board of digital architects behind Cynbit Technologies, led by founder Mohak Saini in Jaipur.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Meet the architects."
        intro="At Cynbit, we assemble a board of digital architects selected for technical rigor and a commitment to a resilient, optimistic future."
        tone="sky"
      >
        <div className="rounded-card bg-shell p-6 text-ink">
          <p className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
            One accountable team.
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            Strategy, interface and engineering sit in the same conversation from day one.
          </p>
          <a
            href="mailto:opportunities@cynbit.in"
            className="mt-5 inline-flex min-h-10 items-center gap-2 font-bold text-brand"
          >
            <Mail aria-hidden="true" className="size-4" />
            Talk to the team
          </a>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="The core leadership."
              intro="Three complementary practices, one shared standard for the work."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Reveal key={member.slug} delay={index * 0.06}>
                <article className="group overflow-hidden rounded-card bg-shell">
                  <div className="relative aspect-[4/5] overflow-hidden bg-mint">
                    <Image
                      src={member.image}
                      alt={`Portrait of ${member.name}, ${member.title}`}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 768px) 32vw, 100vw"
                      className="object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-full bg-white/90 px-4 py-2.5 backdrop-blur-sm">
                      <span className="text-sm font-bold text-brand">{member.title}</span>
                      <MoveUpRight aria-hidden="true" className="size-4 text-ink" />
                    </div>
                  </div>
                  <div className="p-6 md:p-7">
                    <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em]">
                      {member.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
                    <p className="mt-5 text-xs font-semibold text-brand">{member.focus}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mint py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[8ch]">What holds the work together.</h2>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-3">
              {teamValues.map((value, index) => (
                <Reveal key={value.title} delay={index * 0.05}>
                  <div>
                    <h3 className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-card bg-peach p-7 md:p-10">
              <h2 className="display-card max-w-[12ch]">Bring us the hard problem.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
                If the work matters and the brief is still a little messy, that is often the right
                time to talk.
              </p>
              <ButtonLink href="/contact" className="mt-7">
                Start a project
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
            <div className="rounded-card bg-brand-deep p-7 text-white md:p-10">
              <h2 className="display-card max-w-[12ch]">Add another architect.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                We are building a small team that can own the whole system, not just a ticket.
              </p>
              <ButtonLink href="/careers" variant="on-dark" className="mt-7">
                See open roles
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
