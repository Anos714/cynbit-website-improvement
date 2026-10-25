export const dynamic = "force-dynamic";

export function POST() {
  // CSP reports are discarded deliberately: they can be noisy and may contain
  // URLs. Review them in the browser console or a dedicated collector instead.
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
