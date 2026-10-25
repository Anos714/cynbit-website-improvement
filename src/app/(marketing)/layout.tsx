import type { ReactNode } from "react";
import { NewsletterLoader } from "@/components/forms/newsletter-loader";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <RevealObserver />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <NewsletterLoader />
    </>
  );
}
