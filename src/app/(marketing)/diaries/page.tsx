import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { diaryEntries } from "@/content/diaries";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Student diaries",
  description:
    "Unfiltered stories from engineering students about pressure, belonging, direction and the parts of college nobody puts in the brochure. Published by BitElevate.",
  path: "/diaries",
});

const cardTone = ["bg-mint", "bg-peach", "bg-sky", "bg-shell"] as const;

export default function DiariesPage() {
  const [lead, ...rest] = diaryEntries;

  return (
    <>
      <PageHeader
        title="Student diaries, unfiltered."
        intro="Real stories from real students about the parts of engineering college that do not make it into the brochure. Published anonymously, with permission."
        tone="peach"
      >
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <Quote aria-hidden="true" className="size-7 text-amber" />
          <p className="mt-4 max-w-sm font-headline text-lg font-bold leading-snug tracking-[-0.02em]">
            The things students carry are not always academic. Sometimes they are the real
            curriculum.
          </p>
          <p className="mt-4 text-sm text-white/70">BitElevate Student Diaries</p>
        </div>
      </PageHeader>

      {lead ? (
        <section className="pb-16 pt-2 md:pb-24">
          <Container>
            <Reveal>
              <Link
                href={`/diaries/${lead.slug}`}
                className="group grid gap-8 rounded-card bg-brand-deep p-7 text-white md:grid-cols-[1fr_auto] md:items-end md:p-12"
              >
                <div>
                  <p className="text-sm font-semibold text-peach">{formatDate(lead.date)}</p>
                  <blockquote className="mt-5 max-w-[18ch] font-headline text-[clamp(2.2rem,4.8vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
                    “{lead.quote}”
                  </blockquote>
                  <div className="mt-7">
                    <h2 className="font-headline text-xl font-extrabold tracking-[-0.03em]">
                      {lead.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/65">
                      {lead.author} · {lead.role}
                    </p>
                  </div>
                </div>
                <span className="grid size-12 place-items-center rounded-full bg-white text-brand-deep transition-colors group-hover:bg-amber">
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </span>
              </Link>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section className="section-space bg-shell">
        <Container>
          <Reveal>
            <SectionHeading
              title="The stories students actually tell."
              intro="Anonymity is not a gimmick. It is how the honest version gets published."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((entry, index) => (
              <Reveal key={entry.slug} delay={(index % 3) * 0.05}>
                <Link
                  href={`/diaries/${entry.slug}`}
                  className={`group flex h-full min-h-[21rem] flex-col justify-between rounded-card p-6 transition-transform duration-300 hover:-translate-y-1 ${cardTone[index % cardTone.length]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Quote aria-hidden="true" className="size-5 text-brand" />
                    <span className="text-xs font-semibold text-muted">{formatDate(entry.date)}</span>
                  </div>
                  <div className="mt-10">
                    <blockquote className="font-headline text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                      “{entry.quote}”
                    </blockquote>
                    <h2 className="mt-5 font-headline text-lg font-extrabold leading-snug tracking-[-0.025em]">
                      {entry.title}
                    </h2>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
                      <span>{entry.role}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-brand">
                        Read the entry
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-mint p-7 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch]">Have a story worth telling?</h2>
              <p className="body-lead mt-5">
                Student diaries are published with care and consent. If something you have lived
                through might help someone else feel less alone, write to the BitElevate team.
              </p>
            </div>
            <ButtonLink href="/contact?interest=bitelevate" size="large">
              Share your story
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
