"use client";

import { useRef, useState } from "react";
import { CHButton } from "@/common";
import { cn } from "@/lib/cn";
import styles from "./ReceiptScanning.module.css";

/**
 * `capture="environment"` is what makes this a one-tap scan on a phone —
 * mobile browsers open the camera directly instead of a "Photo Library /
 * Take Photo" chooser when it's set. Desktop ignores it and falls back to a
 * normal file picker.
 *
 * While scanning, the prompt's button/copy is replaced by the picked photo
 * itself with a sweeping line playing over it — a spinner says "wait," this
 * says "reading this," and it doubles as confirmation the right photo was
 * captured.
 */
export function ReceiptPickerPrompt({
  onPick,
  isDisabled,
  previewUrl,
  isScanning,
}: {
  onPick: (file: File) => void;
  isDisabled: boolean;
  previewUrl: string | null;
  isScanning: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // The scanning preview is the *raw* picked file, still HEIC if that's what
  // the camera captured — no browser but Safari renders that in an <img>
  // (see handlePick's own comment in ReceiptScanScreen). Tracks which url
  // failed rather than a plain boolean, so a new pick (a new blob url)
  // clears it for free instead of needing an effect to reset it.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (isScanning && previewUrl) {
    const showPlaceholder = failedUrl === previewUrl;
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 px-[22px] py-16 text-center",
          styles.scanEnter
        )}
      >
        <div
          className="relative aspect-[3/4] w-[220px] overflow-hidden rounded-[9px] border border-line-soft"
          style={
            showPlaceholder
              ? { background: "linear-gradient(175deg, #F6F1E4 0%, #ECE4CD 45%, #DFD2AC 100%)" }
              : undefined
          }
        >
          {!showPlaceholder && (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob: preview, never uploaded anywhere but the receipt bucket
            <img
              src={previewUrl}
              alt="Scanning receipt"
              className="h-full w-full object-cover"
              onError={() => setFailedUrl(previewUrl)}
            />
          )}
          <div className={styles.scanLine} />
        </div>
        <h2 className="m-0 font-display text-[19px] font-semibold text-ink">
          Reading your receipt…
        </h2>
        <p className="m-0 text-[13.5px] text-ink-soft">Usually just a few seconds.</p>
      </div>
    );
  }

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
