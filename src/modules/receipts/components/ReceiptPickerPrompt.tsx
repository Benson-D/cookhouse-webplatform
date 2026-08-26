"use client";

import { useRef } from "react";
import { CHButton } from "@/components/common";

/**
 * `capture="environment"` is what makes this a one-tap scan on a phone —
 * mobile browsers open the camera directly instead of a "Photo Library /
 * Take Photo" chooser when it's set. Desktop ignores it and falls back to a
 * normal file picker.
 */
export function ReceiptPickerPrompt({
  onPick,
  isDisabled,
}: {
  onPick: (file: File) => void;
  isDisabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-3 px-[22px] py-16 text-center">
      <h2 className="m-0 font-display text-[19px] font-semibold text-ink">Scan a receipt</h2>
      <p className="m-0 max-w-[48ch] text-sm text-ink-soft">
        Line it up and snap a photo — we&apos;ll read the items off it for you to review.
      </p>

      <CHButton
        variant="primary"
        className="mt-2"
        disabled={isDisabled}
        onClick={() => inputRef.current?.click()}
      >
        {isDisabled ? "Scanning…" : "Scan receipt"}
      </CHButton>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onPick(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
