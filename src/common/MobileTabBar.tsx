"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./AppNav";
import { CartIcon, PotIcon, ReceiptIcon } from "./TabBarIcons";

type IconProps = { className?: string };

const ICONS_BY_HREF: Record<string, (props: IconProps) => React.JSX.Element> = {
  "/recipes": PotIcon,
  "/grocery-list": CartIcon,
  "/spending": ReceiptIcon,
};

/**
 * Bottom tab bar replacing `AppNav`'s inline links below `md:`, keeping
 * navigation in thumb reach.
 *
 * `position: fixed`. The layout adds matching bottom padding so it never
 * covers content.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-surface md:hidden">
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
            <Icon className={pathname.startsWith(href) ? "animate-tab-icon-pop" : undefined} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
