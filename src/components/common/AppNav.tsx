"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

/**
 * App chrome. Clerk's OrganizationSwitcher stands in for the household
 * selector — every recipe and list procedure is scoped to the active
 * organization.
 */
export function AppNav() {
  const pathname = usePathname();
  const onRecipes = pathname.startsWith("/recipes");
  const onGroceryList = pathname.startsWith("/grocery-list");
  const onSpending = pathname.startsWith("/spending");

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
        <nav className="flex gap-5 text-[13.5px]">
          <Link
            href="/recipes"
            className={
              onRecipes ? "font-semibold text-ink no-underline" : "text-ink-soft no-underline"
            }
          >
            Recipes
          </Link>
          <Link
            href="/grocery-list"
            className={
              onGroceryList
                ? "font-semibold text-ink no-underline"
                : "text-ink-soft no-underline"
            }
          >
            Grocery list
          </Link>
          <Link
            href="/spending"
            className={
              onSpending ? "font-semibold text-ink no-underline" : "text-ink-soft no-underline"
            }
          >
            Spending
          </Link>
        </nav>

        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/recipes"
          afterCreateOrganizationUrl="/recipes"
        />
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}
