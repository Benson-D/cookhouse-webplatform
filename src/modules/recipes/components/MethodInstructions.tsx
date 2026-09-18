import { Fragment } from "react";
import { CHSectionLabel } from "@/common";
import { formatTimer, groupByHeading, type Instruction } from "../utils/instructions";

/**
 * Grouped by `heading` — some recipes are really two or three sub-recipes in
 * sequence, so a heading splits the method into named sections, each
 * numbered from 1. An unheaded recipe renders as one continuous list, same
 * as before.
 *
 * Owns the generic "Method" label itself, rather than the screen rendering
 * it unconditionally, because whether it's redundant depends on the
 * instructions' own shape: if the very first section already has a named
 * heading, a plain "Method" label right above it would just repeat what
 * that heading already says. It only stays hidden in that one case — an
 * unheaded intro before the first named section still gets it, same as an
 * entirely unheaded recipe.
 *
 * Timers are already in the stored JSON and render as a pill; nothing counts
 * down yet — that's the cook-mode flow, which is where a state machine would
 * earn its place.
 */
export function MethodInstructions({ instructions }: { instructions: Instruction[] }) {
  const groups = groupByHeading(instructions);
  const showMethodLabel = instructions.length === 0 || groups[0]?.heading === undefined;

  if (instructions.length === 0) {
    return (
      <>
        {showMethodLabel && <CHSectionLabel>Method</CHSectionLabel>}
        <p className="m-0 text-[13.5px] text-ink-faint">No method recorded for this recipe.</p>
      </>
    );
  }

  return (
    <>
      {showMethodLabel && <CHSectionLabel>Method</CHSectionLabel>}
      <div className="flex flex-col">
        {groups.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {group.heading && (
              <CHSectionLabel className="mt-5 mb-3">{group.heading}</CHSectionLabel>
            )}

            <ol className="m-0 flex list-none flex-col gap-[13px] p-0">
              {group.items.map((instruction, index) => (
                <li
                  key={`${groupIndex}-${index}`}
                  className="flex gap-3 text-[13.5px] leading-[1.55] text-ink-soft"
                >
                  <span className="mt-px grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent">
                    {index + 1}
                  </span>
                  <span>
                    {instruction.text}
                    {instruction.timerSeconds ? (
                      <span className="ml-1.5 rounded bg-amber-soft px-1.5 py-px font-mono text-[10.5px] text-amber">
                        {formatTimer(instruction.timerSeconds)}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          </Fragment>
        ))}
      </div>
    </>
  );
}
