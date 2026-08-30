"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { MobileAccountPanel } from "./MobileAccountPanel";

export const NAV_LINKS = [
  { href: "/recipes", label: "Recipes" },
  { href: "/grocery-list", label: "Grocery list" },
  { href: "/spending", label: "Spending" },
] as const;

/**
 * App chrome. Clerk's OrganizationSwitcher stands in for the household
 * selector — every recipe and list procedure is scoped to the active
 * organization.
 *
 * Below the `md:` breakpoint (matching the grid's own mobile-first
 * convention, e.g. `RecipeListScreen`'s `grid-cols-2 md:grid-cols-3`), the
 * nav links move to `MobileTabBar` and the household switcher moves into
 * `MobileAccountPanel`, reached from a custom action in `UserButton`'s own
 * menu — the top bar itself collapses to just the brand and `UserButton`.
 */
export function AppNav() {
  const pathname = usePathname();
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-[22px] py-3.5">
      <Link href="/recipes" className="flex items-center gap-[9px] no-underline">
        <span className="grid h-[22px] w-[22px] place-items-center rounded-md bg-accent font-display text-xs font-bold text-accent-ink">
          C
        </span>
        <span className="font-display text-base font-semibold tracking-[-0.01em] text-ink">
          cookhouse
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-[22px]">
        <nav className="hidden gap-5 text-[13.5px] md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname.startsWith(href)
                  ? "font-semibold text-ink no-underline"
                  : "text-ink-soft no-underline"
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <OrganizationSwitcher
            hidePersonal
            afterSelectOrganizationUrl="/recipes"
            afterCreateOrganizationUrl="/recipes"
          />
        </div>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        <div className="relative">
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Household & theme"
                labelIcon={<span aria-hidden>⚙️</span>}
                onClick={() => setIsAccountPanelOpen(true)}
              />
            </UserButton.MenuItems>
          </UserButton>

          {isAccountPanelOpen && (
            <MobileAccountPanel onClose={() => setIsAccountPanelOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
