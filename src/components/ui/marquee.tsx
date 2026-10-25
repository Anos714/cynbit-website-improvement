import { cn } from "@/lib/utils";

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const sequence = [...items, ...items];

  return (
    <div className={cn("marquee-mask", className)}>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {sequence.map((item, index) => (
              <span key={`${copy}-${index}-${item}`} className="flex items-center">
                <span className="px-5 font-headline text-xl font-bold tracking-[-0.03em] md:px-8 md:text-3xl">
                  {item}
                </span>
                <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
