import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type CHLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

const base =
  "whitespace-nowrap rounded-lg px-[15px] py-2 text-[13.5px] font-semibold " +
  "transition duration-140 ease-out active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 " +
  "focus-visible:outline-accent disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  primary: "border border-accent bg-accent text-accent-ink hover:opacity-90",
  ghost: "border border-line bg-transparent text-ink hover:bg-surface-2",
};

/**
 * A `CHButton`-styled `<Link>` — for real navigation, not a click handler
 * pretending to navigate.
 *
 * Owns its own styling constants rather than importing `CHButton`'s — each
 * common component is meant to be manageable on its own. No `pressed` state:
 * nothing that navigates is also a toggle today: add it if that changes.
 */
export function CHLink({
  variant = "ghost",
  className,
  children,
  ...props
}: CHLinkProps) {
  const classes = cn(base, variantClasses[variant], "no-underline", className);

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  );
}
