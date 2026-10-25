import createBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProduction = process.env.NODE_ENV === "production";
const isDeployed = process.env.VERCEL === "1";
const enforceCsp = isProduction && process.env.CSP_ENFORCE !== "false";

// The marketing site is statically rendered and served from ISR. A per-request
// nonce would force every page into dynamic rendering, undoing the cache fix.
// This static-safe policy is enforced in production and Report-Only in dev so
// React refresh keeps working. A nonce-based policy is the documented follow-up.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "report-uri /api/csp-report",
  ...(isDeployed ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: enforceCsp ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
  // Vercel serves `access-control-allow-origin: *` on static output by
  // default. Restate it for our own origin so HTML documents do not advertise
  // cross-origin readability.
  {
    key: "Access-Control-Allow-Origin",
    value: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://cynbit-website-improvement.vercel.app",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Preload is intentionally deferred until every subdomain is inventoried.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const htmlCacheSources = [
  "/",
  "/story",
  "/team",
  "/services",
  "/products",
  "/case-studies",
  "/impact",
  "/bitelevate",
  "/bitelevate/paths",
  "/diaries",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/blog/:slug",
  "/case-studies/:slug",
  "/careers/:slug",
  "/diaries/:slug",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      ...htmlCacheSources.map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      })),
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
