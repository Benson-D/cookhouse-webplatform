import type { ReactNode } from "react";

/**
 * Empty is a real, expected state, not an edge case — a brand-new household's
 * recipe list is legitimately empty. Reads as an invitation, not a failure:
 * quieter than ErrorState, no accent rule.
 */
export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-[22px] py-14 text-center">
      <h2 className="m-0 font-display text-[19px] font-semibold text-ink">
        {title}
      </h2>
      {message && <p className="m-0 max-w-[48ch] text-sm text-ink-soft">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
