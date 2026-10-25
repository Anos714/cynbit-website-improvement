import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogArchive } from "@/components/blog/blog-archive";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { blogPosts, featuredBlogPost } from "@/content/blog";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Practical thinking on AI agents, automation, software engineering, cloud systems and the operational work in between. The Cynbit insights archive.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Architecting knowledge."
        intro="Practical thinking on AI, software and the operational work between the two. Written by the people doing the implementation."
        tone="sky"
      >
        <div className="grid grid-cols-2 gap-4 rounded-card bg-shell p-6">
          <div>
            <p className="font-headline text-4xl font-extrabold leading-none tracking-[-0.06em] text-brand">
              {blogPosts.length}
            </p>
            <p className="mt-2 text-sm text-muted">published articles</p>
          </div>
          <div>
            <p className="font-headline text-4xl font-extrabold leading-none tracking-[-0.06em] text-brand">
              {new Set(blogPosts.map((post) => post.category)).size}
            </p>
            <p className="mt-2 text-sm text-muted">topics in the archive</p>
          </div>
        </div>
      </PageHeader>

      <section className="pb-16 pt-2 md:pb-24">
        <Container>
          <Reveal>
            <article className="grid overflow-hidden rounded-card bg-brand-deep text-white lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-between p-6 md:p-10 lg:p-12">
                <div>
                  <Tag tone="on-dark">Featured</Tag>
                  <p className="mt-6 text-sm font-semibold text-peach">
                    {featuredBlogPost.category} · {featuredBlogPost.readTime} min read
                  </p>
                  <h2 className="mt-3 max-w-[15ch] font-headline text-[clamp(2.1rem,4.2vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
                    {featuredBlogPost.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                    {featuredBlogPost.description}
                  </p>
                </div>
                <div className="mt-10 flex items-center justify-between gap-4">
                  <div className="text-sm text-white/65">
                    <p>{featuredBlogPost.author}</p>
                    <time dateTime={featuredBlogPost.publishedAt}>
                      {formatDate(featuredBlogPost.publishedAt)}
                    </time>
                  </div>
                  <Link
                    href={`/blog/${featuredBlogPost.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-bold text-brand-deep transition-colors hover:bg-amber"
                  >
                    Read the article
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[23rem]">
                <Image
                  src={featuredBlogPost.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </article>
          </Reveal>
        </Container>
      </section>

      <section className="section-space bg-shell">
        <Container>
          <Reveal>
            <SectionHeading
              title="More from the studio."
              intro="Filter by topic or read everything. No email gate, no artificial scarcity."
            />
          </Reveal>
          <div className="mt-10">
            <BlogArchive posts={blogPosts} excludeSlug={featuredBlogPost.slug} />
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-mint p-7 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="display-section max-w-[12ch]">Need the thinking applied?</h2>
              <p className="body-lead mt-5">
                We write about the systems we build. If one of these problems is live in your
                organisation, bring us the specifics.
              </p>
            </div>
            <ButtonLink href="/contact" size="large">
              Talk to the team
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
