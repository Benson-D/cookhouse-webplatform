import { cn } from "@/lib/cn";
import { computeDueStatus, formatFrequency, type DueTone } from "../utils";
import type { Staple } from "../types";

const TONE_CLASSES: Record<DueTone, string> = {
  default: "text-ink-faint",
  warn: "text-amber",
  late: "text-danger",
};

export function StapleRow({ staple, onRemove }: { staple: Staple; onRemove: () => void }) {
  const status = computeDueStatus(
    staple.lastAddedAt ? new Date(staple.lastAddedAt) : null,
    staple.frequencyDays
  );

  return (
    <li className="grid grid-cols-[160px_1fr_24px] items-center gap-3 border-b border-line-soft py-[11px] text-sm">
      <div>
        <div className="font-medium text-ink">{staple.ingredient.name}</div>
        <div className="tabular font-mono text-[11.5px] text-ink-faint">
          {formatFrequency(staple.frequencyDays)}
        </div>
      </div>

      <div className="tabular font-mono text-xs text-ink-faint">
        {status.lastAddedLabel} ·{" "}
        <span className={cn("font-bold", TONE_CLASSES[status.tone])}>{status.statusLabel}</span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${staple.ingredient.name} from staples`}
        className="text-[15px] text-ink-faint hover:text-ink"
      >
        ×
      </button>
    </li>
  );
}
