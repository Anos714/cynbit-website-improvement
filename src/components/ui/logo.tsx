import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverted = false,
  priority = false,
}: {
  className?: string;
  inverted?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/cynbit-logo.svg"
      alt="Cynbit Technologies"
      width={400}
      height={165}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-9 w-auto", inverted && "brightness-0 invert", className)}
    />
  );
}
