import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          title="This page took a different route."
          intro="The link may be old, the page may have moved, or the address may have picked up an extra character. The useful paths are still here."
          tone="sky"
        >
          <div className="rounded-card bg-brand-deep p-6 text-white">
            <p className="font-headline text-[clamp(4rem,7vw,7rem)] font-extrabold leading-none tracking-[-0.07em] text-peach">
              404
            </p>
            <p className="mt-2 text-sm text-white/60">Page not found.</p>
          </div>
        </PageHeader>

        <section className="section-space">
          <Container>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { href: "/", label: "Back to the homepage", note: "Start with the studio." },
                { href: "/case-studies", label: "Browse the case studies", note: "Challenge, build, outcome." },
                { href: "/contact", label: "Tell us what you need", note: "A person will reply." },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-44 flex-col justify-between rounded-card bg-shell p-6 transition-colors hover:bg-mint"
                >
                  <ArrowRight aria-hidden="true" className="size-5 text-brand" />
                  <div>
                    <p className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
