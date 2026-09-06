import { OrganizationSwitcher } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Floating panel for the household switcher + theme toggle, opened from a
 * custom action in `UserButton`'s menu — Clerk's menu can't embed arbitrary
 * content, only label/action/link items.
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
