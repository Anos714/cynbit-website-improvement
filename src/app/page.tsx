import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function DesignSystemPreview() {
  return (
    <main className="min-h-screen py-16">
      <Container>
        <p className="font-bold text-brand">Design system in progress</p>
        <h1 className="display-hero mt-5 max-w-[12ch]">Architecting tomorrow.</h1>
        <p className="body-lead mt-8">
          A quieter system for a more ambitious Cynbit. Manrope and Plus Jakarta Sans, a deep-teal
          ink, mint fields, and one warm amber accent.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/contact" size="large">
            Start a project
          </ButtonLink>
          <ButtonLink href="/case-studies" variant="secondary" size="large">
            See the work
          </ButtonLink>
          <ButtonLink href="/careers" variant="amber" size="large">
            View openings
          </ButtonLink>
        </div>

        <section className="section-space mt-16 rounded-card bg-mint p-6 md:p-12">
          <SectionHeading
            title="Technology, assembled with intent."
            intro="Three practices, one accountable team. The design system connects every page to the same architectural language."
            action={
              <ButtonLink href="/services" variant="secondary">
                Explore services
              </ButtonLink>
            }
          />
        </section>

        <Reveal className="mt-10 rounded-card bg-sky p-6 md:p-12">
          <p className="max-w-3xl font-headline text-3xl font-bold tracking-[-0.035em] md:text-5xl">
            “A useful page should answer the visitor&apos;s question before it asks for anything.”
          </p>
        </Reveal>
      </Container>
    </main>
  );
}
