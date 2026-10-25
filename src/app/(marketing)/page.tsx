import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Sparkles, Users } from "lucide-react";
import { CapabilityExplorer } from "@/components/home/capability-explorer";
import { CaseStudyCard } from "@/components/content/case-study-card";
import { ArticleCard } from "@/components/content/article-card";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { blogPosts } from "@/content/blog";
import { caseStudies, featuredCaseStudies } from "@/content/case-studies";
import {
  homeContent,
  products,
  servicePractices,
  studentVoices,
  teamMembers,
} from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI automation, software and cloud architecture",
  description:
    "Cynbit Technologies is a Jaipur studio building AI automation, custom software and cloud systems for ambitious teams. Explore selected work, products and BitElevate.",
  alternates: { canonical: "/" },
};

const productTone = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
} as const;

export default function HomePage() {
  return (
    <div className="overflow-clip">
      <section className="pb-14 pt-8 md:pb-24 md:pt-14">
        <Container>
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.22fr)_minmax(21rem,0.78fr)] lg:gap-10">
            <div>
              <Reveal>
                <h1 className="display-hero max-w-[12ch]">
                  Architecting <span className="block text-brand">what&apos;s next.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="body-lead mt-8 max-w-xl">{homeContent.introduction}</p>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/contact" size="large">
                    Start a project
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </ButtonLink>
                  <ButtonLink href="/case-studies" variant="secondary" size="large">
                    See the work
                  </ButtonLink>
                </div>
                <p className="mt-5 text-sm font-medium text-muted">
                  A real conversation, not a discovery-call funnel.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="w-full">
              <CapabilityExplorer practices={servicePractices} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-8 text-white md:py-10">
        <Container>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
            {homeContent.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold text-white/50">{fact.label}</dt>
                <dd className="mt-1 font-headline text-[clamp(1.35rem,2.4vw,2rem)] font-extrabold tracking-[-0.04em]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-start lg:gap-20">
            <div>
              <Reveal>
                <h2 className="display-section max-w-[13ch]">
                  The speed of a startup. The rigor of an enterprise.
                </h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="body-lead mt-7">
                  Cynbit was built around a simple tension: ambitious teams need momentum now, and
                  systems that still make sense after the launch. We hold both.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-7 sm:grid-cols-3">
                {homeContent.principles.map((principle, index) => (
                  <Reveal key={principle.title} delay={0.05 + index * 0.05}>
                    <div className="border-t-4 border-brand pt-5">
                      <h3 className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <ArrowLink href="/story" className="mt-9">
                Read the Cynbit story
              </ArrowLink>
            </div>

            <Reveal delay={0.08}>
              <div className="rounded-card bg-mint p-4 md:p-5">
                <div className="flex items-center justify-between gap-4 px-1 pb-4">
                  <p className="text-sm font-bold text-ink">The architects</p>
                  <ArrowLink href="/team" className="min-h-8 text-sm">
                    Meet the team
                  </ArrowLink>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {teamMembers.map((member) => (
                    <div key={member.slug} className="overflow-hidden rounded-[1rem] bg-brand-deep">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={member.image}
                          alt={`${member.name}, ${member.title} at Cynbit`}
                          fill
                          sizes="(min-width: 1024px) 12vw, 30vw"
                          className="object-cover grayscale"
                        />
                      </div>
                      <div className="p-2.5 text-white">
                        <p className="text-[0.7rem] font-bold leading-tight">
                          {member.name.split(" ")[0]}
                        </p>
                        <p className="mt-0.5 text-[0.6rem] leading-tight text-white/55">
                          {member.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="px-1 pt-4 text-xs leading-relaxed text-muted">
                  One senior team across strategy, design and engineering. No handoff to a mystery
                  delivery layer.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-space bg-shell">
        <Marquee
          items={caseStudies.slice(0, 8).map((study) => study.client)}
          className="text-brand-deep"
        />
        <Container className="mt-14 md:mt-18">
          <Reveal>
            <SectionHeading
              title="Work that had to work."
              intro="Selected public case studies across health, events and retail. Each one began with a constraint, not a moodboard."
              action={<ArrowLink href="/case-studies">View all case studies</ArrowLink>}
            />
          </Reveal>

          <div className="mt-12 grid gap-8">
            {featuredCaseStudies[0] ? (
              <Reveal>
                <Link
                  href={`/case-studies/${featuredCaseStudies[0].slug}`}
                  className="group grid overflow-hidden rounded-card bg-brand-deep text-white lg:grid-cols-[0.92fr_1.08fr]"
                >
                  <div className="relative min-h-[18rem] lg:order-2 lg:min-h-[28rem]">
                    <Image
                      src={featuredCaseStudies[0].image}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 md:p-10 lg:order-1 lg:p-12">
                    <div>
                      <Tag tone="on-dark">{featuredCaseStudies[0].category}</Tag>
                      <p className="mt-8 text-sm font-bold text-peach">
                        {featuredCaseStudies[0].client}
                      </p>
                      <h3 className="mt-2 max-w-[14ch] font-headline text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
                        {featuredCaseStudies[0].title}
                      </h3>
                      <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                        {featuredCaseStudies[0].summary}
                      </p>
                    </div>
                    <div className="mt-10 flex items-end justify-between gap-6">
                      <div>
                        <p className="font-headline text-4xl font-extrabold leading-none tracking-[-0.05em] text-peach">
                          {featuredCaseStudies[0].metricValue}
                        </p>
                        <p className="mt-1 text-sm text-white/55">
                          {featuredCaseStudies[0].metricLabel} · client-reported
                        </p>
                      </div>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand-deep transition-colors group-hover:bg-amber">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ) : null}

            <div className="grid gap-8 md:grid-cols-2">
              {featuredCaseStudies.slice(1).map((study, index) => (
                <Reveal key={study.slug} delay={0.06 + index * 0.06}>
                  <CaseStudyCard study={study} elevated />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-16 text-white md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.75fr)] lg:gap-20">
            <div>
              <Reveal>
                <Tag tone="on-dark">BitElevate</Tag>
                <h2 className="display-section mt-5 max-w-[12ch] text-white">
                  From engineering hallways to industry.
                </h2>
                <p className="body-lead mt-7 text-white/65">
                  BitElevate began in 2024 with a gap we kept seeing: students had the tools, but not
                  the blueprint. It is now Cynbit&apos;s education programme: live projects, industry
                  stacks and honest mentorship for the next generation of software architects.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/bitelevate" variant="on-dark">
                    Explore BitElevate
                  </ButtonLink>
                  <ButtonLink href="/bitelevate/paths" variant="ghost" className="text-white hover:text-peach">
                    Build a learning path
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <div className="rounded-card bg-white/[0.07] p-5">
                <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[1.1rem]">
                  <Image
                    src="/images/studio-collaboration.webp"
                    alt="A group collaborating around laptops in a studio setting"
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="grid gap-4">
                  {studentVoices.slice(0, 3).map((voice) => (
                    <div key={voice.name} className="flex items-start gap-3">
                      <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber" />
                      <div>
                        <p className="text-sm font-semibold leading-relaxed text-white/80">
                          “{voice.quote}”
                        </p>
                        <p className="mt-0.5 text-xs text-white/45">
                          {voice.name}, {voice.college}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Tag tone="on-dark">16 learning dimensions</Tag>
                  <Tag tone="on-dark">Live projects</Tag>
                  <Tag tone="on-dark">Jaipur</Tag>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="Three products. One ecosystem."
              intro="The same product thinking we bring to client work, applied to problems we wanted to solve ourselves."
              action={<ArrowLink href="/products">Explore the products</ArrowLink>}
            />
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.06}>
                <Link
                  href={`/products#${product.slug}`}
                  className={`group block h-full rounded-card ${productTone[product.tone]} p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8`}
                >
                  <div className="flex items-start justify-between gap-5">
                    <span className="font-headline text-4xl font-extrabold tracking-[-0.06em] text-brand-deep">
                      {product.monogram}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-brand-deep transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>
                  <p className="mt-12 text-sm font-bold text-brand">{product.category}</p>
                  <h3 className="mt-2 font-headline text-[clamp(1.9rem,3vw,2.6rem)] font-extrabold leading-none tracking-[-0.05em]">
                    {product.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
                  <div className="mt-7 grid gap-2">
                    {product.features.slice(0, 2).map((feature) => (
                      <p key={feature.title} className="text-sm font-semibold text-ink">
                        {feature.title}
                      </p>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-brand-deep text-white">
        <Container>
          <Reveal>
            <SectionHeading
              title="How the work gets made."
              intro="A structured sequence with room for judgement. No theatre, no black box, no surprise handover."
              tone="inverted"
            />
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {homeContent.process.map((step, index) => (
              <Reveal key={step.title} delay={(index % 3) * 0.05}>
                <div className="bg-white/[0.055] p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
                    <h3 className="font-headline text-xl font-extrabold tracking-[-0.035em] text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact" variant="on-dark">
              Bring us the problem
            </ButtonLink>
            <p className="text-sm text-white/50">Discovery starts with the actual constraint.</p>
          </div>
        </Container>
      </section>

      <section className="section-space bg-sky">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <Reveal>
              <h2 className="display-section max-w-[10ch]">Technology is a lever.</h2>
              <p className="body-lead mt-7">
                The same conviction runs through BitElevate and our work with Manav Seva Trust: make
                technical capability more accessible, without lowering the standard.
              </p>
              <ArrowLink href="/impact" className="mt-7">
                See the social impact work
              </ArrowLink>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              <Reveal delay={0.06}>
                <div className="h-full rounded-card bg-brand-deep p-6 text-white">
                  <GraduationCap aria-hidden="true" className="size-6 text-amber" />
                  <h3 className="mt-8 font-headline text-2xl font-extrabold tracking-[-0.04em]">
                    BitElevate
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Technical training, career readiness and the human support around both.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="h-full rounded-card bg-peach p-6 text-ink">
                  <Sparkles aria-hidden="true" className="size-6 text-brand" />
                  <h3 className="mt-8 font-headline text-2xl font-extrabold tracking-[-0.04em]">
                    Manav Seva Trust
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Foundational computer and IT teaching with government schools and rural students.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <Reveal>
            <SectionHeading
              title="Notes from the studio."
              intro="Practical thinking on AI, software and the operational work between the two."
              action={<ArrowLink href="/blog">Read all insights</ArrowLink>}
            />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06}>
                <ArticleCard post={post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
