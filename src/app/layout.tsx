import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookhouse",
  description: "Shared recipes, grocery lists and spending for your household.",
};

/** `appearance.variables` points Clerk at this app's own CSS custom properties instead of Clerk's defaults. */
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
