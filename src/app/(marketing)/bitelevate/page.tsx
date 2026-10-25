import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { specialisations, studentVoices } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "BitElevate",
  description:
    "BitElevate is Cynbit's education programme: live projects, industry stacks and mentorship for engineering students ready to move from learning to professional execution.",
  alternates: { canonical: "/bitelevate" },
};

const programmeBenefits = [
  {
    title: "Nominal fees",
    body: "Education should not be the barrier. The programme is priced to stay accessible to students.",
  },
  {
    title: "Industry roadmaps",
    body: "Curriculum built from the stacks and constraints we use on client systems, not a generic syllabus.",
  },
  {
    title: "Verified certification",
    body: "A BitElevate certificate that records the work completed, not just attendance.",
  },
];

export default function BitelevatePage() {
  return (
    <>
      <PageHeader
        title="From learning to shipped."
        intro="BitElevate is Cynbit's education programme, built to close the distance between engineering theory and professional execution. Live projects, senior mentorship and a path shaped around the learner."
        tone="sky"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <p className="font-headline text-3xl font-extrabold tracking-[-0.05em]">BitElevate</p>
          <p className="mt-1 text-sm text-white/70">An education movement by Cynbit Technologies.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Tag tone="on-dark">Since 2024</Tag>
            <Tag tone="on-dark">Jaipur</Tag>
            <Tag tone="on-dark">16 dimensions</Tag>
          </div>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <Reveal>
              <div className="relative aspect-[16/11] overflow-hidden rounded-card bg-mint">
                <Image
                  src="/images/studio-collaboration.webp"
                  alt="Students working together around laptops"
                  fill
                  priority
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-[1rem] bg-white/90 px-4 py-3 text-xs font-semibold text-muted">
                  Editorial image via Unsplash. Programme sessions are held with the Cynbit team in
                  Jaipur.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <Quote aria-hidden="true" className="size-8 text-amber" />
              <blockquote className="mt-5 font-headline text-[clamp(1.9rem,3.5vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
                “We decided to stop talking about the gap and start building the bridge.”
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-muted">The Cynbit manifesto</p>
              <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                It began with a persistent silence between theoretical knowledge and professional
                execution. Documented in our 2025 Student Diaries, the struggle was universal:
                students had the tools, but lacked the blueprint.
              </p>
              <ButtonLink href="/bitelevate/paths" className="mt-7">
                Explore the learning dimensions
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24 lg:px-12">
        <div className="mx-auto max-w-[90rem] rounded-card bg-brand-deep p-7 text-white md:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <Tag tone="on-dark">Summer internship &amp; training 2026</Tag>
              <h2 className="display-section mt-5 max-w-[13ch] text-white">
                A working internship, not a watching brief.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
                A 360° technical immersion for engineering students. Work on live architectural
                projects with Cynbit&apos;s core team, using the same stack and standards we bring to
                client systems.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "Live projects with the core team",
                "Industry stack from day one",
                "Mentorship around the work",
                "Career-readiness, not just code",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber text-ink">
                    <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/careers" variant="on-dark">
                  See internships
                </ButtonLink>
                <ButtonLink href="/bitelevate/paths" variant="ghost" className="text-white hover:text-peach">
                  Build a path
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-shell">
        <Container>
          <Reveal>
            <SectionHeading
              title="Active specialisations."
              intro="Curated tracks for the modern technologist, designed to be combined rather than fixed."
              action={<ArrowLink href="/bitelevate/paths">See all 16 dimensions</ArrowLink>}
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialisations.map((track, index) => (
              <Reveal key={track.title} delay={index * 0.05}>
                <div
                  className={`flex h-full min-h-64 flex-col rounded-card p-6 ${
                    index % 2 === 0 ? "bg-mint" : "bg-peach"
                  }`}
                >
                  <h3 className="font-headline text-2xl font-extrabold leading-none tracking-[-0.045em]">
                    {track.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{track.description}</p>
                  <p className="mt-auto pt-8 text-sm font-bold text-brand">Track 0{index + 1}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="Voices from the room."
              intro="Published reflections from BitElevate students. Their words, not ours."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studentVoices.map((voice, index) => (
              <Reveal key={`${voice.name}-${voice.quote}`} delay={(index % 3) * 0.05}>
                <figure className="flex h-full flex-col justify-between rounded-card bg-shell p-6">
                  <Quote aria-hidden="true" className="size-6 text-amber" />
                  <blockquote className="mt-7 font-headline text-xl font-bold leading-snug tracking-[-0.025em]">
                    “{voice.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-muted">
                    <span className="font-bold text-ink">{voice.name}</span> · {voice.college}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mint py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[10ch]">Elevate your technical legacy.</h2>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-3">
              {programmeBenefits.map((benefit, index) => (
                <Reveal key={benefit.title} delay={index * 0.05}>
                  <div>
                    <h3 className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{benefit.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-brand-deep p-7 text-white md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[11ch] text-white">
                Already decided? Explore the roadmaps.
              </h2>
              <p className="body-lead mt-5 text-white/65">
                Choose the dimensions that fit the engineer you are becoming, then talk them through
                with a mentor.
              </p>
            </div>
            <ButtonLink href="/bitelevate/paths" variant="on-dark" size="large">
              Build your path
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
