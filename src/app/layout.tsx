import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DermaVision AI",
  description: "Explainable skin lesion classification from dermoscopic images (learning and screening support).",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              DermaVision AI
            </Link>
            <div className="flex gap-5 text-sm">
              <Link href="/" className="hover:underline">
                Analyze
              </Link>
              <Link href="/classes" className="hover:underline">
                Lesion classes
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-xs text-slate-500">
          v3.2
        </footer>
      </body>
    </html>
  );
}
