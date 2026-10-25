import rawCaseStudies from "./data/case-studies.json";

export type CaseStudy = {
  slug: string;
  client: string;
  category: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  completion: string;
  status: string;
  image: string;
  metricValue: string;
  metricLabel: string;
};

const metrics: Record<string, [string, string]> = {
  "wizhealth-ai-diagnostic": ["25%", "improved triage efficiency"],
  "pragya-healths-remote-monitoring": ["40%", "fewer emergency visits"],
  "wild-basil-supply-chain": ["20%", "more premium subscriptions"],
  "sofiasa-erp-modernization": ["60%", "faster employee onboarding"],
  "econtentprep-adaptive-learning": ["45%", "higher course completion"],
  "cloudy-tales-collaboration": ["50k+", "active writers supported"],
  "urban-wardrobe-ar-integration": ["22%", "fewer product returns"],
  "evento-ticketing-scalability": ["100k+", "concurrent users, zero downtime"],
  "marketing-addict-ai-optimization": ["35%", "improvement in client ROI"],
  "fashion-headless-commerce": ["38%", "increase in conversion rate"],
  "retail-seo-growth": ["140%", "increase in organic traffic"],
  "healthcare-cloud-migration": ["Zero", "data loss during migration"],
  "fintech-payments-evolution": ["2.4M+", "active daily users supported"],
};

const featuredOrder = [
  "wizhealth-ai-diagnostic",
  "evento-ticketing-scalability",
  "urban-wardrobe-ar-integration",
];

const allCaseStudies: CaseStudy[] = (
  rawCaseStudies as Omit<CaseStudy, "metricValue" | "metricLabel">[]
).map((study) => ({
  ...study,
  metricValue: metrics[study.slug]?.[0] ?? "Live",
  metricLabel: metrics[study.slug]?.[1] ?? "in production",
}));

export const caseStudies = allCaseStudies.toSorted((a, b) => {
  const aIndex = featuredOrder.indexOf(a.slug);
  const bIndex = featuredOrder.indexOf(b.slug);

  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  }

  return a.client.localeCompare(b.client);
});

export const featuredCaseStudies = caseStudies.slice(0, 3);

export const caseStudyCategories = Array.from(
  new Set(caseStudies.map((study) => study.category)),
).sort();

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
