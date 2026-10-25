import { site } from "@/lib/site";

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

export const organizationAreaServed = [
  { "@type": "City", name: "Jaipur" },
  { "@type": "AdministrativeArea", name: "Rajasthan" },
  { "@type": "Country", name: "India" },
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageJsonLd(items: readonly FaqItem[], url: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type ServicePracticeInput = {
  id: string;
  title: string;
  summary: string;
  services: readonly {
    title: string;
    description: string;
  }[];
};

export function servicesJsonLd(practices: readonly ServicePracticeInput[], url: string) {
  return practices.map((practice) => ({
    "@type": "Service",
    "@id": `${url}#${practice.id}`,
    name: practice.title,
    serviceType: practice.title,
    description: practice.summary,
    provider: organizationReference(),
    areaServed: organizationAreaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${practice.title} capabilities`,
      itemListElement: practice.services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  }));
}

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function organizationReference() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: site.url,
  } as const;
}

export function blogPostingJsonLd({
  title,
  description,
  image,
  url,
  publishedAt,
  category,
  readTime,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: string;
  category: string;
  readTime: number;
}) {
  const published = new Date(publishedAt).toISOString();

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    image: [absoluteUrl(image)],
    datePublished: published,
    dateModified: published,
    articleSection: category,
    keywords: [category, "Cynbit", "software", "AI automation"],
    timeRequired: `PT${readTime}M`,
    inLanguage: "en-IN",
    author: organizationReference(),
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function jobPostingJsonLd({
  title,
  description,
  url,
  datePosted,
  validThrough,
  employmentType,
  department,
}: {
  title: string;
  description: string;
  url: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  department: string;
}) {
  return {
    "@type": "JobPosting",
    "@id": `${url}#job`,
    title,
    description,
    datePosted,
    validThrough,
    employmentType: employmentType === "Internship" ? "INTERN" : "FULL_TIME",
    hiringOrganization: organizationReference(),
    industry: "Information Technology",
    occupationalCategory: department,
    directApply: true,
    url,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.line1,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
    },
  };
}
