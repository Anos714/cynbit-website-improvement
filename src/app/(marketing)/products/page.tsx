import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductPlate } from "@/components/content/product-plate";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { products } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Cynbit's product ecosystem: Cynbit Studio for career growth, TenantEase for property operations and Revio for AI-assisted reputation intelligence.",
  alternates: { canonical: "/products" },
};

const tone = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
} as const;

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Three products. One ecosystem."
        intro="Cynbit builds software for the gap between individual potential and enterprise execution. These are the platforms we use to prove the thinking in public."
        tone="mint"
      >
        <nav aria-label="Products on this page" className="grid gap-2">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`#${product.slug}`}
              className="group flex min-h-12 items-center justify-between gap-4 rounded-full bg-shell px-4 text-sm font-bold transition-colors hover:bg-white"
            >
              {product.name}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="section-space grid gap-6">
        {products.map((product, index) => (
          <section key={product.slug} id={product.slug} className="scroll-mt-28">
            <Container>
              <Reveal delay={index * 0.03}>
                <div className={`rounded-card ${tone[product.tone]} p-6 md:p-10 lg:p-12`}>
                  <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
                    <div>
                      <p className="font-bold text-brand">{product.category}</p>
                      <h2 className="mt-3 font-headline text-[clamp(2.6rem,5vw,5.4rem)] font-extrabold leading-[0.93] tracking-[-0.06em]">
                        {product.name}
                      </h2>
                      <p className="mt-4 max-w-lg font-headline text-[clamp(1.4rem,2.5vw,2rem)] font-bold leading-[1.05] tracking-[-0.04em]">
                        {product.tagline}
                      </p>
                      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                        {product.description}
                      </p>

                      <div className="mt-9 grid gap-3 sm:grid-cols-2">
                        {product.features.map((feature) => (
                          <div key={feature.title} className="rounded-[1.2rem] bg-shell p-4">
                            <h3 className="font-headline text-base font-extrabold tracking-[-0.025em]">
                              {feature.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <blockquote className="mt-9 border-l-4 border-brand pl-5 font-headline text-lg font-bold italic leading-snug tracking-[-0.02em] text-ink">
                        “{product.quote}”
                      </blockquote>
                    </div>

                    <div className="lg:sticky lg:top-28 lg:self-start">
                      <ProductPlate product={product} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-brand-deep p-7 text-white md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch] text-white">
                Want to see one properly?
              </h2>
              <p className="body-lead mt-5 text-white/65">
                Tell us which problem you are trying to solve. We will prepare a focused walkthrough
                rather than a generic feature tour.
              </p>
            </div>
            <ButtonLink href="/contact" variant="on-dark" size="large">
              Schedule a demo
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
