import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/content/site-pages";

const tone = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
} as const;

export function ProductPlate({ product }: { product: Product }) {
  return (
    <div
      className={`relative overflow-hidden rounded-card ${tone[product.tone]} p-5 md:p-6`}
      aria-label={`${product.name} capability view`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-headline text-3xl font-extrabold tracking-[-0.06em] text-brand-deep">
          {product.monogram}
        </span>
        <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-bold text-ink">
          {product.category}
        </span>
      </div>

      <div className="mt-10 rounded-[1.2rem] bg-brand-deep p-4 text-white md:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white/55">Capability view</p>
          <ArrowUpRight aria-hidden="true" className="size-4 text-peach" />
        </div>
        <p className="mt-6 max-w-[15ch] font-headline text-[clamp(1.65rem,2.4vw,2.3rem)] font-extrabold leading-none tracking-[-0.05em]">
          {product.tagline}
        </p>
        <ul className="mt-7 grid gap-2">
          {product.features.slice(0, 3).map((feature) => (
            <li
              key={feature.title}
              className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.07] px-3.5 py-3"
            >
              <span className="text-sm font-semibold text-white/85">{feature.title}</span>
              <span aria-hidden="true" className="size-1.5 rounded-full bg-amber" />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        A view of the product direction and capability set, not a live performance claim.
      </p>
    </div>
  );
}
