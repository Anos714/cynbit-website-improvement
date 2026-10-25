import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";

export function CaseStudyCard({
  study,
  className,
  elevated = false,
  priority = false,
}: {
  study: CaseStudy;
  className?: string;
  elevated?: boolean;
  priority?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/case-studies/${study.slug}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden rounded-card bg-mint",
            elevated ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        >
          <Image
            src={study.image}
            alt=""
            fill
            priority={priority}
            sizes={elevated ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute left-4 top-4">
            <Tag tone="default">{study.category}</Tag>
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-brand">{study.client}</p>
            <h3 className="mt-2 font-headline text-[clamp(1.4rem,2.2vw,2.15rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              {study.title}
            </h3>
          </div>
          <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-mint text-brand transition-colors group-hover:bg-amber group-hover:text-ink">
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-bold text-ink">{study.metricValue}</span> {study.metricLabel}
          <span className="text-muted"> · client-reported</span>
        </p>
      </Link>
    </article>
  );
}
