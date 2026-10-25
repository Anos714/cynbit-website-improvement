import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/content/site-pages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Cynbit Technologies collects, uses and protects information submitted through this public website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
