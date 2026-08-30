"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { NAV_LINKS } from "./AppNav";

/** Same on all three so they read as one set, not three different hands. */
const iconProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 20,
  height: 20,
  "aria-hidden": true,
};

/** Recipes — echoes the app's own favicon. */
function PotIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 9v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9" />
      <path d="M4 9h16" />
      <path d="M3 8h2M19 8h2" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 4h2l2.2 11.2a2 2 0 0 0 2 1.6h6.6a2 2 0 0 0 2-1.6L20 8H7" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

/** Receipt — ties to receipt scanning, not a generic card icon. */
function ReceiptIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 3h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

const ICONS_BY_HREF: Record<string, () => React.JSX.Element> = {
  "/recipes": PotIcon,
  "/grocery-list": CartIcon,
  "/spending": ReceiptIcon,
};

/**
 * Bottom tab bar replacing `AppNav`'s inline links below the `md:` breakpoint
 * — exactly three destinations is the textbook case for this pattern, and it
 * keeps navigation in thumb reach, worth more here than usual given the
 * grocery list's own one-handed-in-a-shop design goal. `position: sticky`
 * keeps it reachable while the page scrolls underneath it.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-30 flex border-t border-line bg-surface md:hidden">
      {NAV_LINKS.map(({ href, label }) => {
        const Icon = ICONS_BY_HREF[href];
        return (
          <Link
            key={href}
            href={href}
            className={
              pathname.startsWith(href)
                ? "flex flex-1 flex-col items-center gap-[3px] px-1 pb-[13px] pt-[11px] text-center text-xs font-bold text-accent no-underline"
                : "flex flex-1 flex-col items-center gap-[3px] px-1 pb-[13px] pt-[11px] text-center text-xs text-ink-faint no-underline"
            }
          >
            <Icon />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
