import type { Metadata } from "next";
import { site } from "@/lib/site";

const DEFAULT_OG_IMAGE = "/og-default.png";

export function pageMetadata({
  title,
  description,
  path,
  ogTitle = title,
  ogDescription = description,
  image = DEFAULT_OG_IMAGE,
  imageAlt = site.name,
  article,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  imageAlt?: string;
  article?: {
    publishedTime: string;
    section?: string;
    authors?: string[];
  };
}): Metadata {
  const isDefaultImage = image === DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: article ? "article" : "website",
      locale: "en_IN",
      siteName: site.name,
      url: path,
      title: ogTitle,
      description: ogDescription,
      ...(article
        ? {
            publishedTime: article.publishedTime,
            section: article.section,
            authors: article.authors,
          }
        : {}),
      images: [
        {
          url: image,
          alt: imageAlt,
          ...(isDefaultImage ? { width: 1200, height: 630 } : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}
