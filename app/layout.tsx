// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BiteTrak – Eat Better. Plan Smarter.",
  description:
    "AI-powered food planning for real dietary needs: IBS-safe, gluten-free, immune-neutral, keto, high-protein, or fully customized.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {/* NAVBAR */}
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-btBlue flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-semibold">BT</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                BiteTrak
              </span>
            </a>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a
                href="/#why"
                className="hover:text-slate-900 transition-colors"
              >
                Why BiteTrak
              </a>
              <a
                href="/#features"
                className="hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="/dashboard"
                className="hover:text-slate-900 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/#pricing"
                className="hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Log in
              </button>
              <a
                href="/#get-started"
                className="inline-flex items-center justify-center rounded-full bg-btBlue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-btBlue/30 hover:bg-btBlueDark transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Mobile menu icon (non-functional placeholder) */}
            <button className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-300">
              <span className="sr-only">Open menu</span>
              <div className="w-4 h-0.5 bg-slate-700 mb-1" />
              <div className="w-4 h-0.5 bg-slate-700 mb-1" />
              <div className="w-4 h-0.5 bg-slate-700" />
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="pb-24">{children}</main>

        {/* FOOTER */}
        <footer className="bg-slate-950 text-slate-400">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs">
              © {new Date().getFullYear()} BiteTrak. Not medical advice. Always
              consult your care team before changing your diet.
            </p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="hover:text-slate-200">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-200">
                Terms
              </a>
              <a href="#" className="hover:text-slate-200">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
