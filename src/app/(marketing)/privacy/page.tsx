import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/content/site-pages";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How Cynbit Technologies collects, uses and protects information submitted through this public website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
