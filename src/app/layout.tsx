import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookhouse",
  description: "Shared recipes, grocery lists and spending for your household.",
};

/** All system fonts, so no next/font import — `--font-display-stack` and friends in globals.css are the whole story. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-ground text-ink">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
