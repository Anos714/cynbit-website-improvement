"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/content/article-card";
import type { BlogPost } from "@/content/blog";
import { cn } from "@/lib/utils";

export function BlogArchive({ posts, excludeSlug }: { posts: BlogPost[]; excludeSlug?: string }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const archivePosts = excludeSlug ? posts.filter((post) => post.slug !== excludeSlug) : posts;
  const categories = [
    "All",
    ...Array.from(new Set(posts.map((post) => post.category))).sort(),
  ];
  const filtered =
    activeCategory === "All"
      ? archivePosts
      : archivePosts.filter((post) => post.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filter articles by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={cn(
              "inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold transition-colors",
              activeCategory === category
                ? "bg-brand-deep text-white"
                : "bg-shell text-ink hover:bg-mint",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {activeCategory === "All" ? " in the archive" : ` in ${activeCategory}`}
      </p>

      <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-card bg-shell p-6 text-muted">
          No articles in this category yet.
        </p>
      ) : null}
    </div>
  );
}
