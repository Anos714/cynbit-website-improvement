import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationAreaServed } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Cynbit Technologies | AI automation and software",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/brand/cynbit-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/cynbit-favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: "Cynbit Technologies | AI automation and software",
    description: site.description,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cynbit Technologies | AI automation and software",
    description: site.description,
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur, Rajasthan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f6f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${jakarta.variable}`}
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "ProfessionalService"],
                "@id": `${site.url}/#organization`,
                name: site.name,
                description: site.description,
                slogan: site.tagline,
                url: site.url,
                logo: `${site.url}/brand/cynbit-logo.svg`,
                email: site.email,
                telephone: site.phones[0],
                foundingDate: "2024",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: site.address.line1,
                  addressLocality: site.address.city,
                  addressRegion: site.address.region,
                  postalCode: site.address.postalCode,
                  addressCountry: site.address.country,
                },
                areaServed: organizationAreaServed,
                knowsAbout: [
                  "AI automation",
                  "AI agents",
                  "LLM automation",
                  "Software engineering",
                  "Cloud infrastructure",
                  "Technical SEO",
                  "Growth engineering",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "sales",
                  email: site.email,
                  telephone: site.phones[0],
                  areaServed: "IN",
                },
                sameAs: site.socials.map((social) => social.href),
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                url: site.url,
                name: site.name,
                description: site.description,
                publisher: { "@id": `${site.url}/#organization` },
                inLanguage: "en-IN",
              },
            ],
          }}
        />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
