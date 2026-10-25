import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/content/site-pages";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Cookie policy",
  description:
    "What cookies and storage the Cynbit Technologies public website uses, what it does not use and how to manage them.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <LegalPage content={legalPages.cookies} />;
}
