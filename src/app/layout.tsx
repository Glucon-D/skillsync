/**
 * @file layout.tsx
 * @description Root layout component with theme support
 * @dependencies next, react
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSync - AI-Powered Career Path Recommender",
  description: "Discover personalized career paths through profile analysis, interest assessment, and intelligent recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
