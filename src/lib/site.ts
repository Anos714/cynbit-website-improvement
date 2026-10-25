const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://cynbit-website-improvement.vercel.app";

export const site = {
  name: "Cynbit Technologies",
  shortName: "Cynbit",
  url: configuredUrl,
  tagline: "The optimistic architect",
  description:
    "Cynbit Technologies architects AI automation, custom software and scalable cloud systems from Jaipur, India.",
  email: "opportunities@cynbit.in",
  supportEmail: "support@cynbit.in",
  phones: ["+91 89479 62667", "+91 78912 09777", "+91 83023 37367"],
  address: {
    line1: "32/115 Pratap Nagar",
    city: "Jaipur",
    region: "Rajasthan",
    postalCode: "302033",
    country: "India",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/cynbit-in/" },
    { label: "Instagram", href: "https://www.instagram.com/cynbit.in/" },
    { label: "Facebook", href: "https://www.facebook.com/people/Cynbit-Technologies/61557066036732/" },
    { label: "X", href: "https://x.com/Cynbit_in" },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items?: NavItem[];
};

export const primaryNav: NavGroup[] = [
  {
    label: "Company",
    items: [
      { label: "Our story", href: "/story", description: "The blueprint behind Cynbit." },
      { label: "The team", href: "/team", description: "The architects behind the work." },
      { label: "Careers", href: "/careers", description: "Build the next chapter with us." },
      { label: "Social impact", href: "/impact", description: "Technology as a lever for progress." },
    ],
  },
  {
    label: "Expertise",
    items: [
      { label: "Services", href: "/services", description: "AI, software, cloud and growth." },
      { label: "Products", href: "/products", description: "Three platforms, one ecosystem." },
      { label: "Case studies", href: "/case-studies", description: "Challenge, build, outcome." },
    ],
  },
  { label: "Work", href: "/case-studies" },
  {
    label: "BitElevate",
    items: [
      { label: "The programme", href: "/bitelevate", description: "From engineering hallways to industry." },
      { label: "Learning paths", href: "/bitelevate/paths", description: "Build a path around your ambition." },
      { label: "Student diaries", href: "/diaries", description: "Unfiltered student journeys." },
    ],
  },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = [
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/story" },
      { label: "The team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Social impact", href: "/impact" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "BitElevate",
    links: [
      { label: "Programme", href: "/bitelevate" },
      { label: "Learning paths", href: "/bitelevate/paths" },
      { label: "Student diaries", href: "/diaries" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export const legalNav = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;
