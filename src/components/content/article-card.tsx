import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/content/blog";
import { cn, formatDate } from "@/lib/utils";

export function ArticleCard({
  post,
  className,
  compact = false,
  priority = false,
}: {
  post: BlogPost;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/blog/${post.slug}`} className="block">
        {!compact ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
            <Image
              src={post.image}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          </div>
        ) : null}
        <div className={cn(!compact && "mt-5")}>
          <div className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-muted">
            <span className="text-brand">{post.category}</span>
            <span aria-hidden="true">/</span>
            <span>{post.readTime} min read</span>
          </div>
          <h3 className="mt-2 font-headline text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold leading-[1.08] tracking-[-0.035em] group-hover:text-brand">
            {post.title}
          </h3>
          {compact ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.description}</p>
          ) : null}
          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <ArrowUpRight aria-hidden="true" className="size-4 text-brand" />
          </div>
        </div>
      </Link>
    </article>
  );
}
