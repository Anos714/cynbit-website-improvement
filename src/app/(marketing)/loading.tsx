import { Container } from "@/components/ui/container";

export default function MarketingLoading() {
  return (
    <div className="section-space" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <Container>
        <div className="h-5 w-28 animate-pulse rounded-full bg-mint motion-reduce:animate-none" />
        <div className="mt-7 h-16 w-full max-w-2xl animate-pulse rounded-2xl bg-mint motion-reduce:animate-none md:h-24" />
        <div className="mt-5 h-6 w-full max-w-xl animate-pulse rounded-full bg-mint motion-reduce:animate-none" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-card bg-shell motion-reduce:animate-none"
            />
          ))}
        </div>
        <div className="mt-20 space-y-4">
          <div className="h-4 w-full max-w-3xl animate-pulse rounded-full bg-mint motion-reduce:animate-none" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-mint motion-reduce:animate-none" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-mint motion-reduce:animate-none" />
        </div>
      </Container>
    </div>
  );
}
