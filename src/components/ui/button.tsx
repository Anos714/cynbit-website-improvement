import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "amber" | "ghost" | "on-dark";
type Size = "regular" | "small" | "large";

const variantClasses: Record<Variant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
  amber: "button-amber",
  ghost: "button-ghost",
  "on-dark": "button-on-dark",
};

const sizeClasses: Record<Size, string> = {
  regular: "",
  small: "min-h-10 px-4 text-[0.84rem]",
  large: "min-h-14 px-7 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "regular",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn("button-base", variantClasses[variant], sizeClasses[size], className);
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "regular",
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant = "primary", size = "regular", ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
