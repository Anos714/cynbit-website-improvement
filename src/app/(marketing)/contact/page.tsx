import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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

              <form className="mt-8 grid gap-5">
                <div className="form-honey" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="name">
                      Your name *
                    </label>
                    <input
                      className="field-input"
                      id="name"
                      name="name"
                      autoComplete="name"
                      maxLength={120}
                      placeholder="Rahul Sain"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="email">
                      Work email *
                    </label>
                    <input
                      className="field-input"
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="company">
                      Company
                    </label>
                    <input
                      className="field-input"
                      id="company"
                      name="company"
                      autoComplete="organization"
                      maxLength={160}
                      placeholder="Company or team"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="interest">
                      What is this about?
                    </label>
                    <select className="field-input" id="interest" name="interest" defaultValue="project">
                      <option value="project">A new project</option>
                      <option value="ai">AI automation</option>
                      <option value="software">Software engineering</option>
                      <option value="product">Cynbit products</option>
                      <option value="bitelevate">BitElevate</option>
                      <option value="careers">Careers</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="message">
                    What are you building? *
                  </label>
                  <textarea
                    className="field-input"
                    id="message"
                    name="message"
                    maxLength={5000}
                    placeholder="The problem, the outcome you need and any constraints worth knowing."
                    required
                  />
                </div>

                <div className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    value="yes"
                    className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
                    required
                  />
                  <label htmlFor="consent">
                    I agree that Cynbit may use these details to respond to this inquiry. See the{" "}
                    <Link href="/privacy" className="font-bold text-brand underline underline-offset-4">
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" size="large">
                    Send inquiry
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                  <p className="max-w-xs text-xs leading-relaxed text-muted">
                    This form is not a newsletter sign-up. We will not add you to a marketing list.
                  </p>
                </div>
              </form>
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
                <p className="mt-4 text-xs leading-relaxed text-white/45">
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
