import { OrganizationSwitcher } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Below the nav-collapse breakpoint, the household switcher and theme toggle
 * have no room left in the top bar (see `AppNav`) — Clerk's `UserButton` menu
 * can't embed arbitrary content, only `label`/`labelIcon`/action-or-link
 * items, so this is a real floating panel instead: the same
 * `position: absolute`, anchored-right, no-backdrop mechanism `FilterPanel`
 * already uses, opened from a custom action inside `UserButton`'s own menu
 * rather than a second avatar-like trigger.
 */
export function MobileAccountPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex w-[200px] flex-col gap-3 rounded-[10px] border border-line bg-surface p-3.5 shadow-frame">
      <div className="flex items-center justify-between font-display text-sm font-semibold text-ink">
        <span>Household &amp; theme</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-[15px] text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-[13px] text-ink-soft">
        <span>Household</span>
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/recipes"
          afterCreateOrganizationUrl="/recipes"
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-[13px] text-ink-soft">
        <span>Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
