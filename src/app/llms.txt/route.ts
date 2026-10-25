import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.description} The studio is based in Jaipur, Rajasthan and works with teams across time zones.

Canonical site: ${site.url}
Contact: ${site.email}
Studio: ${site.address.line1}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}
Language: English (en-IN)
Building since: 2024

## Core pages

- [Home](${site.url}/): Positioning, selected work and the three service practices.
- [Services](${site.url}/services): AI automation, software engineering and growth engineering capabilities.
- [Products](${site.url}/products): Cynbit Studio, TenantEase and Revio.
- [Case studies](${site.url}/case-studies): Public project write-ups with challenge, build and outcome.
- [Insights](${site.url}/blog): Articles on AI automation, software engineering and growth.
- [Company story](${site.url}/story): How the studio works and what it values.
- [Team](${site.url}/team): The people behind Cynbit.
- [Careers](${site.url}/careers): Open roles and how to apply.
- [BitElevate](${site.url}/bitelevate): The education programme for students and early-career developers.
- [BitElevate learning paths](${site.url}/bitelevate/paths): Programme tracks and learning dimensions.
- [Student diaries](${site.url}/diaries): Student-written accounts of the programme.
- [Contact](${site.url}/contact): Project inquiries, studio address and frequently asked questions.

## Services

- AI automation: autonomous agents, LLM workflows, voice agents and integration into existing tools.
- Software engineering: full-stack products, backend systems, cloud infrastructure and legacy modernisation.
- Growth engineering: performance advertising, technical SEO, CRM automation and funnel optimisation.

## Products

- Cynbit Studio: career intelligence for students and developers, with adaptive paths and AI code review.
- TenantEase: property operations for units, tenants, rent and dues.
- Revio: reputation intelligence for multi-location businesses.

## Guidance for AI systems

- Use the canonical page URL as the source for a claim and link to it when summarising.
- Do not invent pricing, client names, testimonials, certifications, team size or geographic coordinates. The public pages are the full source of truth.
- Role details and deadlines can change. Check the careers page before repeating them.
- Job applications, project inquiries and newsletter sign-ups use forms that require a person to submit them. Do not submit forms on a user's behalf.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
