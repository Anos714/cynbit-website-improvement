import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { careers, fullTimeRoles, internships } from "@/content/careers";
import { careerBenefits, operatingModel } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore full-time and internship opportunities at Cynbit Technologies across engineering, growth and operations. Remote-first, architect-led work in Jaipur.",
  alternates: { canonical: "/careers" },
};

type CareerRole = (typeof careers)[number];

function RoleList({ roles, heading }: { roles: CareerRole[]; heading: string }) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-headline text-2xl font-extrabold tracking-[-0.04em] md:text-3xl">
          {heading}
        </h2>
        <p className="text-sm font-semibold text-muted">{roles.length} open</p>
      </div>
      <ul className="mt-5 grid gap-2">
        {roles.map((role) => (
          <li key={role.slug}>
            <Link
              href={`/careers/${role.slug}`}
              className="group grid items-center gap-3 rounded-[1.15rem] bg-shell p-4 transition-colors hover:bg-mint md:grid-cols-[minmax(0,1fr)_10rem_9rem_auto] md:px-5"
            >
              <div>
                <p className="font-headline text-lg font-extrabold leading-snug tracking-[-0.025em] group-hover:text-brand">
                  {role.title}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                  {role.description}
                </p>
              </div>
              <p className="text-sm font-semibold text-muted">{role.department}</p>
              <p className="text-sm text-muted">{role.type === "Full-time" ? "Full-time" : "Internship"}</p>
              <span className="hidden size-9 place-items-center rounded-full bg-white text-brand transition-colors group-hover:bg-brand group-hover:text-white md:grid">
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CareersPage() {
  return (
    <>
      <PageHeader
        title="Build with intent."
        intro="At Cynbit, we do not just solve problems; we architect human-centric software. We are looking for thinkers who value growth, technical discipline and digital innovation."
        tone="mint"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <p className="font-headline text-5xl font-extrabold leading-none tracking-[-0.06em] text-peach">
            {careers.length}
          </p>
          <p className="mt-2 text-sm text-white/60">open roles across engineering and growth.</p>
          <p className="mt-4 text-sm text-white/45">
            {fullTimeRoles.length} full-time · {internships.length} internships
          </p>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="Why build with us?"
              intro="Beyond the paycheck, we provide an ecosystem where potential is nurtured."
            />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {careerBenefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.05}>
                <div className="border-t-4 border-brand pt-5">
                  <h2 className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                    {benefit.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{benefit.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-brand-deep text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <Reveal>
              <h2 className="display-section max-w-[9ch] text-white">Our operating model.</h2>
              <p className="body-lead mt-6 text-white/60">
                A high-fidelity execution framework that prioritises deep work, clarity and technical
                excellence over corporate noise.
              </p>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {operatingModel.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="h-full rounded-card bg-white/[0.06] p-5 md:p-6">
                    <h3 className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="Open positions."
              intro="Technical rigor, useful autonomy and a real stake in the outcome. Every role is reviewed by the people you would work with."
            />
          </Reveal>
          <div className="mt-12 grid gap-12">
            <RoleList roles={fullTimeRoles} heading="Full-time roles" />
            <RoleList roles={internships} heading="Internships & early careers" />
          </div>
        </Container>
      </section>

      <section className="section-space bg-peach">
        <Container>
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="display-section max-w-[11ch]">Don&apos;t see your role?</h2>
              <p className="body-lead mt-5">
                We are always looking for architects of the future. Send a portfolio and tell us how
                you could contribute to the Cynbit software vision.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="large">
                Start a conversation
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <a
                href="mailto:opportunities@cynbit.in"
                className="button-base button-secondary min-h-14 px-7 text-base"
              >
                <Mail aria-hidden="true" className="size-4" />
                Email the team
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
