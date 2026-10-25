import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { NewsletterTrigger } from "@/components/forms/newsletter-trigger";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/social-icon";
import { footerNav, legalNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-white">
      <Container className="pb-5 pt-16 md:pt-24">
        <div className="grid gap-10 pb-16 md:pb-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.55fr)] lg:items-end">
          <div>
            <p className="max-w-[12ch] font-headline text-[clamp(3rem,7vw,6.8rem)] font-extrabold leading-[0.92] tracking-[-0.06em]">
              Build what comes next.
            </p>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              Bring us the knotty problem, the ambitious roadmap, or the idea that is still on a
              whiteboard. We will tell you honestly how we can help.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <ButtonLink href="/contact" variant="on-dark" size="large">
              Start a project
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-white/80 transition-colors hover:text-white"
            >
              <Mail aria-hidden="true" className="size-4" />
              {site.email}
            </a>
          </div>
        </div>

        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo inverted className="h-10 w-auto" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">
              AI automation, software and cloud architecture. Designed in Jaipur for teams working
              on a bigger horizon.
            </p>
            <div className="mt-7 flex gap-2.5">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-peach hover:text-ink"
                >
                  <SocialIcon name={social.label} className="size-4" />
                  <span className="sr-only">Cynbit on {social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((column) => (
              <nav key={column.title} aria-label={`${column.title} links`}>
                <p className="font-headline text-base font-bold text-white">{column.title}</p>
                <ul className="mt-4 grid gap-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-sm font-medium text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="grid gap-8 pb-16 md:grid-cols-2">
          <div>
            <p className="font-headline text-base font-bold text-white">Visit the studio</p>
            <address className="mt-4 flex max-w-xs items-start gap-3 text-sm not-italic leading-relaxed text-white/65">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber" />
              <span>
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
                <br />
                {site.address.country}
              </span>
            </address>
          </div>
          <div>
            <p className="font-headline text-base font-bold text-white">Talk to a person</p>
            <ul className="mt-4 grid gap-2 text-sm text-white/65">
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-white"
                  >
                    <Phone aria-hidden="true" className="size-3.5 text-amber" />
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-[1.2rem] bg-white/[0.055] px-5 py-5 text-xs text-white/70 md:flex-row md:items-center md:justify-between md:px-7">
          <p>© {new Date().getFullYear()} Cynbit Technologies. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <NewsletterTrigger className="text-white/70" />
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white"
            >
              Photography: Unsplash
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
