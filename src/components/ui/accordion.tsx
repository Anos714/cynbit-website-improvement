import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-[1.35rem] bg-shell px-5 py-1 open:bg-white md:px-7"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-headline text-lg font-bold tracking-[-0.025em] marker:content-none md:text-xl">
            {item.question}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-brand transition-transform duration-200 group-open:rotate-45 group-open:bg-amber group-open:text-ink">
              <Plus aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </span>
          </summary>
          <div className="pb-6 pr-10 text-muted leading-relaxed">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
