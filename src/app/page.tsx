export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <div className="max-w-3xl">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--brand)]">
          Cynbit Technologies
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.05em] sm:text-7xl">
          The rebuild has started.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          The new public site is being assembled here, one reviewed branch at a time.
        </p>
      </div>
    </main>
  );
}
