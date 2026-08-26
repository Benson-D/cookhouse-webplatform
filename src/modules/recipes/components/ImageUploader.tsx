"use client";

import { useRef } from "react";
import type { GalleryItem } from "../hooks/useRecipeImages";

/**
 * The photo row. First image is the cover.
 *
 * Renders attached and not-yet-uploaded photos in one strip — on a new recipe
 * the files are held locally and uploaded after save, and the user shouldn't
 * have to know which is which. Pending ones are marked so it's clear they
 * aren't stored yet.
 *
 * Reordering isn't built; `reorderImages` exists on the API but drag-to-order
 * needs a drag library, which is a bigger decision than this form.
 */
export function ImageUploader({
  items,
  isUploading,
  uploadError,
  onAdd,
  onRemove,
}: {
  items: GalleryItem[];
  isUploading: boolean;
  uploadError: string | null;
  onAdd: (file: File) => void;
  onRemove: (key: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-[9px] sm:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={item.key}
            className="relative aspect-square overflow-hidden rounded-[7px] border border-line-soft"
          >
            {/*
              A plain <img>: these are presigned bucket URLs and local blob:
              URLs, neither of which next/image can optimise without whitelisting
              a host that isn't decided yet (R2 vs S3 is still open).
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.kind === "attached" ? (item.caption ?? "") : ""}
              className="h-full w-full object-cover"
            />

            {index === 0 && (
              <span className="absolute bottom-[5px] left-[5px] rounded-[3px] bg-black/60 px-[5px] py-px font-mono text-[9px] tracking-[0.05em] text-white">
                COVER
              </span>
            )}

            {item.kind === "pending" && (
              <span className="absolute bottom-[5px] right-[5px] rounded-[3px] bg-amber-soft px-[5px] py-px font-mono text-[9px] tracking-[0.05em] text-amber">
                ON SAVE
              </span>
            )}

            <button
              type="button"
              onClick={() => onRemove(item.key)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute right-[5px] top-[5px] grid h-[17px] w-[17px] place-items-center rounded bg-white/85 text-[10px] text-[#444] hover:bg-white"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="grid aspect-square place-items-center rounded-[7px] border border-dashed border-line bg-surface-2 text-lg text-ink-faint hover:text-ink disabled:opacity-60"
          aria-label="Add a photo"
        >
          {isUploading ? "…" : "+"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onAdd(file);
          // Reset so picking the same file twice still fires a change.
          event.target.value = "";
        }}
      />

      {uploadError && (
        <p className="m-0 text-[11.5px] text-[#B4442F]" role="alert">
          {uploadError}
        </p>
      )}
    </div>
  );
}
