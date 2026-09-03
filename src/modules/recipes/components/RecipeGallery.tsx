"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { RecipeImageWithUrl } from "../types";
import { placeholderGradient } from "../utils";

/**
 * Hero photo plus the ordered thumbnail strip.
 *
 * Images arrive ordered with sortOrder 0 first — that's the thumbnail used
 * everywhere else, so the strip doubles as thumbnail selection.
 *
 * Plain `<img>` rather than `next/image`: these are presigned URLs on a bucket
 * host that is still an open config decision, and `next/image` would need that
 * host declared in `images.remotePatterns` up front.
 */
export function RecipeGallery({
  images,
  fallbackSeed,
  recipeName,
}: {
  images: RecipeImageWithUrl[];
  fallbackSeed: string;
  recipeName: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[3/2] rounded-[9px] border border-line-soft"
        style={{ background: placeholderGradient(fallbackSeed) }}
        role="img"
        aria-label={`No photo for ${recipeName}`}
      />
    );
  }

  const active = images[Math.min(selected, images.length - 1)];

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element -- presigned bucket URL, host not yet fixed */}
      <img
        src={active.url}
        alt={active.caption ?? recipeName}
        className="aspect-[3/2] w-full rounded-[9px] border border-line-soft object-cover"
      />

      {images.length > 1 && (
        <div className="mt-[7px] grid grid-cols-4 gap-[7px]">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-current={index === selected}
              className={cn(
                "aspect-square overflow-hidden rounded-[5px] border border-line-soft",
                index === selected && "outline outline-2 outline-offset-1 outline-accent"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
