import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { impactProgrammes } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Social impact",
  description:
    "Cynbit for Society: BitElevate's evolution from technical training to holistic student support, and our affiliation with Manav Seva Trust.",
  alternates: { canonical: "/impact" },
};

export default function ImpactPage() {
  return (
    <>
      <PageHeader
        title="Technology is a lever."
        intro="We believe technical capability should widen access, not narrow it. Our social initiatives move from building raw skill to supporting the person doing the building."
        tone="peach"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <p className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
            Cynbit for Society
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            The community work is not a side project. It is part of how we understand the pipeline we
            hire from.
          </p>
          <ButtonLink href="/contact" variant="on-dark" className="mt-5">
            Work with us on impact
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[10ch]">The BitElevate evolution.</h2>
              <p className="body-lead mt-6">
                The student journey does not end at a technical skill. We began with employability and
                learned to design for the human being around it.
              </p>
              <ButtonLink href="/bitelevate" variant="secondary" className="mt-7">
                Explore the programme
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {impactProgrammes.map((programme, index) => (
                <Reveal key={programme.title} delay={index * 0.06}>
                  <div
                    className={`h-full rounded-card p-6 ${
                      index === 0 ? "bg-mint" : "bg-sky"
                    }`}
                  >
                    <h3 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                      {programme.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{programme.description}</p>
                    <ul className="mt-6 grid gap-2">
                      {programme.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm font-semibold">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-shell py-16 md:py-24">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="relative min-h-[24rem] overflow-hidden rounded-card bg-mint">
                <Image
                  src="/images/studio-collaboration.webp"
                  alt="A group working together around laptops"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute bottom-5 left-5 right-5 rounded-[1rem] bg-white/90 px-4 py-3 text-xs font-semibold text-muted">
                  Editorial image via Unsplash. Not a photograph of Manav Seva Trust students.
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex h-full flex-col justify-between rounded-card bg-brand-deep p-7 text-white md:p-10">
                <div>
                  <h2 className="display-section max-w-[10ch] text-white">
                    Affiliation with Manav Seva Trust.
                  </h2>
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                    Through our collaboration with Manav Seva Trust, we provide foundational computer
                    and IT teaching to government schools and students in rural areas. The goal is not
                    a one-off workshop. It is a technical backbone that helps a community keep going.
                  </p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1rem] bg-white/[0.07] p-4">
                    <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                      Foundational skills
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      Practical computer and IT teaching where it is hardest to access.
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-white/[0.07] p-4">
                    <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                      Shared infrastructure
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      Resources and technical support designed to be useful after we leave the room.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <Reveal>
              <h2 className="display-section max-w-[11ch]">Build the future with us.</h2>
              <p className="body-lead mt-6">
                Interested in supporting these initiatives, teaching a session or collaborating on a
                social project? We would like to hear what you have in mind.
              </p>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <ButtonLink href="/contact" size="large">
                  Start a conversation
                </ButtonLink>
                <Link
                  href="/bitelevate"
                  className="button-base button-secondary min-h-14 px-7 text-base"
                >
                  Visit BitElevate
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
