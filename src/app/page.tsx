"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { CHButton, CHLink, CartIcon, PotIcon, ReceiptIcon } from "@/common";
import { placeholderGradient } from "@/modules/recipes/utils/placeholder";

const cardClasses =
  "absolute grid h-[52px] w-[52px] place-items-center rounded-xl border border-line-soft opacity-55 shadow-raised md:h-[84px] md:w-[84px] md:rounded-[14px]";

export default function Home() {
  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(circle at 50% 38%, var(--accent-soft) 0%, transparent 62%), var(--surface)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[length:16px_16px] opacity-40 md:bg-[length:22px_22px]"
        style={{
          backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px)",
          WebkitMaskImage: "radial-gradient(circle at 50% 38%, black 0%, transparent 66%)",
          maskImage: "radial-gradient(circle at 50% 38%, black 0%, transparent 66%)",
        }}
      />

      <div
        className={`${cardClasses} left-[6%] top-[7%] -rotate-[8deg] md:left-[9%] md:top-[13%]`}
        style={{ background: placeholderGradient("landing-1") }}
        suppressHydrationWarning
      >
        <PotIcon className="h-5 w-5 stroke-white/85 md:h-[30px] md:w-[30px]" />
      </div>
      <div
        className={`${cardClasses} right-[6%] top-[7%] rotate-[7deg] md:right-[10%] md:top-[12%]`}
        style={{ background: placeholderGradient("landing-2") }}
        suppressHydrationWarning
      >
        <CartIcon className="h-5 w-5 stroke-white/85 md:h-[30px] md:w-[30px]" />
      </div>
      <div
        className={`${cardClasses} bottom-[13%] left-[15%] hidden rotate-[6deg] md:grid`}
        style={{ background: placeholderGradient("landing-3") }}
        suppressHydrationWarning
      >
        <ReceiptIcon className="h-5 w-5 stroke-white/85 md:h-[30px] md:w-[30px]" />
      </div>

      <div className="relative z-10 flex animate-[empty-fade-in_420ms_ease] flex-col items-center gap-[14px] px-5 py-8 md:gap-[18px] md:px-6 md:py-10">
        <div className="flex items-center gap-[9px]">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">
            C
          </span>
          <span className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
            cookhouse
          </span>
        </div>

        <p className="m-0 max-w-[46ch] text-[13.5px] text-ink-soft md:text-[14.5px]">
          Shared recipes, one grocery list, and what your household actually spends on food.
        </p>

        <div className="flex gap-5 md:gap-[26px]">
          <div className="flex flex-col items-center gap-1.5 text-[11.5px] text-ink-faint">
            <PotIcon className="h-5 w-5 stroke-accent" />
            Recipes
          </div>
          <div className="flex flex-col items-center gap-1.5 text-[11.5px] text-ink-faint">
            <CartIcon className="h-5 w-5 stroke-accent" />
            Grocery lists
          </div>
          <div className="flex flex-col items-center gap-1.5 text-[11.5px] text-ink-faint">
            <ReceiptIcon className="h-5 w-5 stroke-accent" />
            Spending
          </div>
        </div>

        <SignedOut>
          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
            <SignInButton mode="modal">
              <CHButton variant="primary" className="w-full text-center md:w-auto">
                Sign in
              </CHButton>
            </SignInButton>
            <SignUpButton mode="modal">
              <CHButton variant="ghost" className="w-full text-center md:w-auto">
                Create an account
              </CHButton>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <CHLink variant="primary" href="/recipes">
            Go to recipes
          </CHLink>
        </SignedIn>
      </div>
    </div>
  );
}
