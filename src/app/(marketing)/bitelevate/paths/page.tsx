import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PathBuilder } from "@/components/bitelevate/path-builder";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { learningDimensions } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Learning paths",
  description:
    "Design a learning path around your direction. Choose from 16 BitElevate dimensions across AI, software, cloud, data and growth.",
  alternates: { canonical: "/bitelevate/paths" },
};

const principles = [
  {
    title: "Non-linear mastery",
    description:
      "Jump between modules as the project demands. We focus on the outcome and the evidence, not a fixed sequence completed for its own sake.",
  },
  {
    title: "Adaptive direction",
    description:
      "Your starting point is a conversation, not a placement score. We adjust the route as your work reveals where the real gaps are.",
  },
  {
    title: "Outcome over order",
    description:
      "A portfolio, a shipped feature and a clear explanation of the decisions are worth more than a perfect attendance record.",
  },
];

export default function BitelevatePathsPage() {
  return (
    <>
      <PageHeader
        title="Architect your own future."
        intro="The rigid curriculum is not the point. BitElevate is built around 16 technical dimensions that can be combined into a path shaped by your direction, not a default timetable."
        tone="mint"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <p className="font-headline text-[clamp(3rem,4.5vw,4.4rem)] font-extrabold leading-none tracking-[-0.06em] text-peach">
            16
          </p>
          <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-white/60">
            technical dimensions across build, intelligence, infrastructure and growth.
          </p>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-8 pb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <Reveal>
              <h2 className="display-section max-w-[11ch]">No two brains are alike.</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="body-lead max-w-xl">
                Why should two curricula be? Choose up to four dimensions to start a conversation
                about the path that actually fits the engineer you are becoming.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <PathBuilder dimensions={learningDimensions} />
          </Reveal>
        </Container>
      </section>

      <section className="section-space bg-shell">
        <Container>
          <Reveal>
            <SectionHeading
              title="A path is a living thing."
              intro="The point is not to eliminate structure. It is to make the structure serve the work."
              action={<ArrowLink href="/contact?interest=bitelevate">Talk to a mentor</ArrowLink>}
            />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.05}>
                <div>
                  <h3 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-sky p-7 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch]">The right route is a conversation.</h2>
              <p className="body-lead mt-5">
                Share the dimensions that caught your attention, the work you have already done and
                the direction you want to test. We will tell you what we think.
              </p>
            </div>
            <ButtonLink href="/contact?interest=bitelevate" size="large">
              Talk through your path
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
