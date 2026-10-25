import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { careers } from "@/content/careers";
import { caseStudies } from "@/content/case-studies";
import { diaryEntries } from "@/content/diaries";
import { site } from "@/lib/site";

const RELEASE_DATE = "2026-10-25";

function isoDate(value?: string) {
  if (!value) return RELEASE_DATE;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? RELEASE_DATE : date.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const topLevel = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/story", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/products", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/case-studies", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/impact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/bitelevate", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bitelevate/paths", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/diaries", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/careers", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    ...topLevel.map(({ path, priority, changeFrequency }) => ({
      url: `${site.url}${path}`,
      lastModified: RELEASE_DATE,
      changeFrequency,
      priority,
    })),
    ...blogPosts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: isoDate(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseStudies.map((study) => ({
      url: `${site.url}/case-studies/${study.slug}`,
      lastModified: isoDate(study.completion),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...careers.map((role) => ({
      url: `${site.url}/careers/${role.slug}`,
      lastModified: RELEASE_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...diaryEntries.map((entry) => ({
      url: `${site.url}/diaries/${entry.slug}`,
      lastModified: isoDate(entry.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
