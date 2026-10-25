import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ArrowLink({
  href,
  children,
  className,
  inverted = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-bold",
        inverted ? "text-white hover:text-peach" : "text-brand hover:text-ink",
        className,
      )}
    >
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
