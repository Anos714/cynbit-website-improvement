import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

type LegalContent = {
  title: string;
  updated: string;
  intro: string;
  sections: readonly { title: string; body: readonly string[] }[];
};

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <>
      <PageHeader
        title={content.title}
        intro={content.intro}
        tone="ground"
      >
        <div className="rounded-card bg-mint p-6">
          <p className="text-sm font-bold text-brand">Last updated</p>
          <p className="mt-2 font-headline text-2xl font-extrabold tracking-[-0.04em]">
            {content.updated}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            This page is written in plain language. The full policy applies regardless of whether you
            read every section.
          </p>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_minmax(0,1fr)] lg:gap-20">
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-bold text-muted">On this page</p>
              <ol className="mt-4 grid gap-1">
                {content.sections.map((section) => (
                  <li key={section.title}>
                    <a
                      href={`#${headingId(section.title)}`}
                      className="inline-flex min-h-9 items-center text-sm font-semibold text-muted transition-colors hover:text-brand"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-3xl">
              {content.sections.map((section) => (
                <section
                  key={section.title}
                  id={headingId(section.title)}
                  className="scroll-mt-28 pb-10 last:pb-0"
                >
                  <h2 className="font-headline text-[clamp(1.8rem,3.1vw,2.7rem)] font-extrabold leading-[1.04] tracking-[-0.045em]">
                    {section.title}
                  </h2>
                  <div className="mt-5 grid gap-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-[1.8] text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
