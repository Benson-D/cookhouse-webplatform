"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

const STORAGE_KEY = "cookhouse-theme";
const ATTRIBUTE = "data-app-theme";

/**
 * No stored choice means *follow the system* (globals.css handles that via
 * prefers-color-scheme), so the common case needs no attribute and no
 * hydration mismatch. Choosing a side sets `data-app-theme` on `<html>`,
 * which wins over the media query.
 *
 * The attribute is the source of truth, not React state — mirroring it into
 * state would mean restoring from localStorage with a setState-in-effect,
 * which cascades renders. The effect below only writes to the DOM; the
 * subscription reads back from it.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ATTRIBUTE],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme | null {
  const value = document.documentElement.getAttribute(ATTRIBUTE);
  return value === "light" || value === "dark" ? value : null;
}

/** Nothing is set during SSR — the system preference governs until hydration. */
function getServerSnapshot(): Theme | null {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute(ATTRIBUTE, stored);
    }
  }, []);

  function choose(next: Theme) {
    document.documentElement.setAttribute(ATTRIBUTE, next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div className="inline-flex gap-px rounded-full border border-line p-0.5">
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => choose(option)}
          className={cn(
            "rounded-full px-3 py-[5px] text-xs capitalize leading-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            theme === option ? "bg-accent-soft font-semibold text-accent" : "text-ink-faint"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
