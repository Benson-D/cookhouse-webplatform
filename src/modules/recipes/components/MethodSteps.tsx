import { formatTimer, type RecipeStep } from "../utils";

/**
 * Numbered from the stored `step` value rather than list position.
 *
 * Timers are already in the stored JSON and render as a pill; nothing counts
 * down yet — that's the cook-mode flow, which is where a state machine would
 * earn its place.
 */
export function MethodSteps({ steps }: { steps: RecipeStep[] }) {
  if (steps.length === 0) {
    return (
      <p className="m-0 text-[13.5px] text-ink-faint">
        No method recorded for this recipe.
      </p>
    );
  }

  return (
    <ol className="m-0 flex list-none flex-col gap-[13px] p-0">
      {steps.map((step, index) => (
        <li
          key={`${step.step}-${index}`}
          className="flex gap-3 text-[13.5px] leading-[1.55] text-ink-soft"
        >
          <span className="mt-px grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent">
            {step.step}
          </span>
          <span>
            {step.text}
            {step.timerSeconds ? (
              <span className="ml-1.5 rounded bg-amber-soft px-1.5 py-px font-mono text-[10.5px] text-amber">
                {formatTimer(step.timerSeconds)}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
