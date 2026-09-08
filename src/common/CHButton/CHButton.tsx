"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type CHButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  pressed?: boolean;
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

// The look every toggle-shaped button (favoriting, filtering) switches to
// when it's "on" — the same accent-soft wash `TagChip` uses for a selected chip.
const pressedClasses = "border border-transparent bg-accent-soft text-accent";

/**
 * The app's button — `primary` (filled) or `ghost` (outlined), plus a
 * `pressed` toggle state (favoriting, filtering). Use `CHLink` for
 * navigation instead — same look, real `<a>` under it.
 */
export function CHButton({
  variant = "ghost",
  pressed,
  className,
  children,
  ...props
}: CHButtonProps) {
  const classes = cn(base, pressed ? pressedClasses : variantClasses[variant], className);

  return (
    <button type="button" aria-pressed={pressed} className={classes} {...props}>
      {children}
    </button>
  );
}
