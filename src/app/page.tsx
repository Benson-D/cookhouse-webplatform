"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { CHButton, CHLink } from "@/common";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-center gap-[9px]">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">
          C
        </span>
        <span className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
          cookhouse
        </span>
      </div>

      <p className="m-0 max-w-[46ch] text-ink-soft">
        Shared recipes, one grocery list, and what your household actually spends on food.
      </p>

      <SignedOut>
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <CHButton variant="primary">Sign in</CHButton>
          </SignInButton>
          <SignUpButton mode="modal">
            <CHButton variant="ghost">Create an account</CHButton>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <CHLink variant="primary" href="/recipes">
          Go to recipes
        </CHLink>
      </SignedIn>
    </div>
  );
}
