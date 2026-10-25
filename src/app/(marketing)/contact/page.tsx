import type { Metadata } from "next";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { contactChannels, contactFaq } from "@/content/site-pages";
import { site as siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project, ask about BitElevate or talk to the Cynbit team in Jaipur. Tell us what you are building and we will reply with a practical next step.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Tell us what you're building."
        intro="A short note about the problem, the outcome and the constraints is enough. We will reply with a practical next step, or tell you honestly if we are not the right team."
        tone="mint"
      >
        <div className="rounded-card bg-shell p-6">
          <p className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
            Prefer email?
          </p>
          <a
            href={`mailto:${contactChannels.business}`}
            className="mt-3 inline-flex min-h-10 items-center gap-2 font-bold text-brand"
          >
            <Mail aria-hidden="true" className="size-4" />
            {contactChannels.business}
          </a>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            For project inquiries, partnerships and general questions.
          </p>
        </div>
      </PageHeader>

      <section className="section-space">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="rounded-card bg-shell p-6 md:p-9">
              <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
                Start a conversation.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                Fields marked with an asterisk are required. Please do not send confidential material
                in this first message.
              </p>

              <ContactForm />
            </div>

            <div className="grid gap-5">
              <div className="rounded-card bg-brand-deep p-6 text-white md:p-8">
                <h2 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                  Talk to a person.
                </h2>
                <ul className="mt-6 grid gap-4">
                  {contactChannels.phones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="inline-flex min-h-10 items-center gap-3 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                      >
                        <span className="grid size-8 place-items-center rounded-full bg-white/10">
                          <Phone aria-hidden="true" className="size-3.5 text-amber" />
                        </span>
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${contactChannels.support}`}
                  className="mt-6 inline-flex min-h-10 items-center gap-3 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-white/10">
                    <Mail aria-hidden="true" className="size-3.5 text-amber" />
                  </span>
                  {contactChannels.support}
                </a>
                <p className="mt-4 text-xs leading-relaxed text-white/65">
                  For existing clients and operational support. Project inquiries are best sent
                  through the form.
                </p>
              </div>

              <div className="rounded-card bg-peach p-6 md:p-8">
                <h2 className="font-headline text-2xl font-extrabold tracking-[-0.04em]">
                  Visit the studio.
                </h2>
                <address className="mt-5 flex items-start gap-3 text-sm not-italic leading-relaxed text-muted">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{contactChannels.address}</span>
                </address>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  A visit is by appointment. Write first so the right person is in the room.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    contactChannels.address,
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex min-h-10 items-center gap-2 font-bold text-brand"
                >
                  Open in Google Maps
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>

              <div className="rounded-card bg-sky p-6 md:p-8">
                <p className="font-headline text-xl font-extrabold tracking-[-0.035em]">
                  A note on scope
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Cynbit is a software studio, not a 24/7 emergency service. For security reports,
                  please email {siteConfig.email} with enough detail to reproduce the issue and do not
                  access data that is not yours.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-shell">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <h2 className="display-section max-w-[9ch]">Before you write.</h2>
              <p className="body-lead mt-6">
                The answers we find ourselves repeating, in case they save you a message.
              </p>
              <p className="mt-6 text-sm text-muted">
                Still unsure? Email{" "}
                <a
                  className="font-bold text-brand underline underline-offset-4"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
                .
              </p>
            </div>
            <Accordion items={contactFaq} />
          </div>
        </Container>
      </section>
    </>
  );
}
