import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("container-page", className)} {...props} />;
}

export function ReadingContainer({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("container-reading", className)} {...props} />;
}
