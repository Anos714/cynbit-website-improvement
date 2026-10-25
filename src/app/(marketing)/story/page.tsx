import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { teamMembers } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our story",
  description:
    "From Jaipur to the world: the story behind Cynbit Technologies, from preparatory architecture work in 2021 to the studio it is today.",
  alternates: { canonical: "/story" },
};

const timeline = [
  {
    year: "2021",
    title: "Preparatory rigor",
    body: "Before the identity, there was the logic. We spent 2021 engineering the invisible: zero-trust modules and architectural blueprints that would later support a global ecosystem.",
    tone: "bg-shell",
  },
  {
    year: "2022",
    title: "Stress testing",
    body: "We took our internal frameworks to the market. Partnering with enterprise visionaries, we validated that the architectural approach could solve real-world friction at scale.",
    tone: "bg-mint",
  },
  {
    year: "2023",
    title: "The roadmap forms",
    body: "A year of intense experimentation. We refined our proprietary AI engines and finalised the approach for the core suite. By the end of 2023, the blueprint for BitElevate and our SaaS products was production-ready.",
    tone: "bg-sky",
  },
  {
    year: "2024",
    title: "Cynbit arrives",
    body: "Cynbit Technologies launched in Jaipur, not as a start but as an arrival. With BitElevate and TenantEase underway, years of internal work met their public identity.",
    tone: "bg-brand-deep text-white",
  },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader
        title="A story of a vision."
        intro="Founded in Jaipur, Cynbit Technologies was built to create scalable AI systems, automation and modern software that solve the real constraints inside a business."
        tone="mint"
      >
        <figure className="w-full max-w-[17rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-peach">
            <Image
              src={teamMembers[0].image}
              alt={`${teamMembers[0].name}, ${teamMembers[0].title} at Cynbit`}
              fill
              priority
              sizes="(min-width: 1024px) 17rem, 60vw"
              className="object-cover grayscale"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            <span className="font-bold text-ink">{teamMembers[0].name}</span> ·{" "}
            {teamMembers[0].title}
          </figcaption>
        </figure>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[10ch]">The engineering of optimism.</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="body-lead">
                Optimism, to us, is not a mood. It is an engineering position: the belief that a
                difficult situation can be made more legible, more humane and more durable through
                better system design.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                That belief took shape across three years of internal architecture work before Cynbit
                had a public name. We tested frameworks against real constraints, documented what
                held, and discarded what only looked good in a proposal.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-card bg-peach p-7 md:p-10">
                <p className="font-bold text-brand">Our vision</p>
                <h2 className="mt-4 font-headline text-[clamp(1.9rem,3.8vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
                  To be the global architectural benchmark for the digital age.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                  Engineering resilient infrastructure that bridges technical precision with human
                  warmth.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-card bg-brand-deep p-7 text-white md:p-10">
                <p className="font-bold text-peach">Our mission</p>
                <h2 className="mt-4 font-headline text-[clamp(1.9rem,3.8vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
                  Eliminate the invisible friction.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                  Build scalable, autonomous ecosystems that democratise innovation and simplify
                  complexity for visionaries worldwide.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-space bg-shell">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[9ch]">The blueprint, in public.</h2>
              <p className="body-lead mt-7">
                Four years of practice, compressed into the moments that changed the work.
              </p>
            </Reveal>

            <ol className="grid gap-3">
              {timeline.map((item, index) => (
                <Reveal key={item.year} delay={index * 0.05} as="li">
                  <div className={`grid gap-5 rounded-card p-6 md:grid-cols-[9rem_1fr] md:p-8 ${item.tone}`}>
                    <p className="font-headline text-4xl font-extrabold tracking-[-0.06em] md:text-5xl">
                      {item.year}
                    </p>
                    <div>
                      <h3 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                        {item.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm leading-relaxed md:text-base ${
                          item.year === "2024" ? "text-white/65" : "text-muted"
                        }`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <Reveal>
                <h2 className="display-section max-w-[11ch]">Build the next chapter with us.</h2>
                <p className="body-lead mt-6">
                  Interested in architecting the future of digital evolution with our core team? Start
                  with the problem, not a brief.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="large">
                  Start a conversation
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
                <ButtonLink href="/careers" variant="secondary" size="large">
                  Join the team
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
