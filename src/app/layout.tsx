import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookhouse",
  description: "Shared recipes, grocery lists and spending for your household.",
};

/**
 * All system fonts, so no next/font import — `--font-display-stack` and
 * friends in globals.css are the whole story.
 *
 * `appearance.variables` points Clerk at this app's own CSS custom
 * properties rather than Clerk's defaults (a purple brand color nowhere in
 * this design, and light-mode-assuming text that goes illegible on a dark
 * background). Passed as `var(--x)` strings, not resolved hex values, so
 * this needs setting once — no theme-state plumbing, no re-render on
 * toggle: the browser repaints Clerk's UI the same way it repaints
 * everything else when the underlying custom property changes.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--accent)",
          colorBackground: "var(--surface)",
          colorText: "var(--ink)",
          colorTextSecondary: "var(--ink-soft)",
          colorTextOnPrimaryBackground: "var(--accent-ink)",
          colorInputBackground: "var(--surface-2)",
          colorInputText: "var(--ink)",
          colorNeutral: "var(--ink-faint)",
          colorDanger: "var(--danger)",
          colorSuccess: "var(--accent)",
          colorWarning: "var(--amber)",
          colorShimmer: "var(--line-soft)",
        },
      }}
    >
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-surface text-ink">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
