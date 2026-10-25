import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/content/site-pages";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Terms of service",
  description:
    "The terms that apply to using the Cynbit Technologies public website, including intellectual property and service inquiries.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage content={legalPages.terms} />;
}
