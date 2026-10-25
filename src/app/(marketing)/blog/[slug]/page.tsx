import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/content/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  blogPosts,
  getBlogHeadings,
  getBlogPost,
  getRelatedBlogPosts,
  textToId,
} from "@/content/blog";
import { site } from "@/lib/site";
import { blogPostingJsonLd, breadcrumbListJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
      section: post.category,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const headings = getBlogHeadings(post);
  const related = getRelatedBlogPosts(post, 3);
  const canonicalUrl = `${site.url}/blog/${post.slug}`;
  const isShortNote = post.blocks.length <= 2;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      blogPostingJsonLd({
        title: post.title,
        description: post.description,
        image: post.image,
        url: canonicalUrl,
        publishedAt: post.publishedAt,
        category: post.category,
        readTime: post.readTime,
      }),
      breadcrumbListJsonLd([
        { name: "Insights", path: "/blog" },
        { name: post.category },
        { name: post.title },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="pb-10 pt-8 md:pb-14 md:pt-12">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Insights", href: "/blog" },
                { label: post.category, href: "/blog" },
                { label: post.title },
              ]}
            />
            <div className="max-w-5xl">
              <p className="text-sm font-bold text-brand">{post.category}</p>
              <h1 className="mt-4 max-w-[20ch] font-headline text-[clamp(2.5rem,5.4vw,5.5rem)] font-extrabold leading-[0.96] tracking-[-0.058em]">
                {post.title}
              </h1>
              <p className="body-lead mt-7 max-w-3xl">{post.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span className="font-bold text-ink">{post.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-mint md:aspect-[2.35/1]">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <section className="py-14 md:py-20">
          <Container>
            <div className="mx-auto grid max-w-[68rem] gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
              <div className="min-w-0">
                {isShortNote ? (
                  <div className="mb-8 rounded-card bg-mint p-5 text-sm leading-relaxed text-muted">
                    <span className="font-bold text-ink">A short field note.</span> This article was
                    originally published as a brief perspective. The related reading below goes deeper
                    into the practice.
                  </div>
                ) : null}

                <div className="prose-cynbit">
                  {post.blocks.map((block, index) => {
                    if (index === 0 && block.type === "ordered-list") return null;

                    if (block.type === "h2") {
                      return (
                        <h2 key={`${block.type}-${index}`} id={textToId(block.text)}>
                          {block.text}
                        </h2>
                      );
                    }

                    if (block.type === "h3") {
                      return (
                        <h3 key={`${block.type}-${index}`} id={textToId(block.text)}>
                          {block.text}
                        </h3>
                      );
                    }

                    if (block.type === "p") {
                      return <p key={`${block.type}-${index}`}>{block.text}</p>;
                    }

                    if (block.type === "quote") {
                      return <blockquote key={`${block.type}-${index}`}>{block.text}</blockquote>;
                    }

                    if (block.type === "list") {
                      return (
                        <ul key={`${block.type}-${index}`}>
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "ordered-list") {
                      return (
                        <ol key={`${block.type}-${index}`}>
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex min-h-11 items-center gap-2 font-bold text-brand"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    Back to insights
                  </Link>
                  <p className="text-sm text-muted">Written by the Cynbit engineering team.</p>
                </div>
              </div>

              <aside className="grid gap-4 lg:sticky lg:top-28">
                {headings.length ? (
                  <nav aria-label="In this article" className="rounded-card bg-shell p-5">
                    <p className="font-headline text-lg font-extrabold tracking-[-0.03em]">
                      In this article
                    </p>
                    <ol className="mt-4 grid gap-1">
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <a
                            href={`#${heading.id}`}
                            className="inline-flex min-h-8 items-start py-0.5 text-sm leading-snug text-muted transition-colors hover:text-brand"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                <div className="rounded-card bg-brand-deep p-5 text-white">
                  <p className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                    Need this built?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Bring us the constraint and we will tell you what a responsible implementation
                    looks like.
                  </p>
                  <ButtonLink href="/contact" variant="on-dark" className="mt-5 w-full">
                    Start a conversation
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </ButtonLink>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      <section className="bg-shell py-14 md:py-20">
        <Container>
          <div className="flex items-end justify-between gap-5">
            <h2 className="display-section max-w-[12ch]">Keep reading.</h2>
            <Link href="/blog" className="text-sm font-bold text-brand hover:text-ink">
              All insights
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {related.map((relatedPost) => (
              <ArticleCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
