import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "next-md-negotiate",
  description:
    "Serve markdown to LLMs and HTML to humans from the same URL. HTTP content negotiation for Next.js.",
  openGraph: {
    title: "next-md-negotiate",
    description:
      "Serve markdown to LLMs and HTML to humans from the same URL.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${spaceMono.variable}`}>
      <body className="bg-surface font-sans text-fg antialiased scanlines">
        <nav className="fixed top-0 z-50 w-full border-b border-line bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
            <Link
              href="/"
              className="font-mono text-sm font-bold tracking-tight text-t-green transition-colors hover:text-t-green-dim"
            >
              <span className="text-fg-3 hidden sm:inline">~/</span>
              next-md
            </Link>

            <div className="flex items-center gap-2 sm:gap-5">
              <Link
                href="/docs"
                className="font-mono text-xs sm:text-sm text-fg-2 transition-colors hover:text-fg"
              >
                docs
              </Link>
              <a
                href="https://github.com/kasin-it/next-md-negotiate"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline font-mono text-sm text-fg-2 transition-colors hover:text-fg"
              >
                github
              </a>
              <a
                href="https://www.npmjs.com/package/next-md-negotiate"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline font-mono text-sm text-fg-2 transition-colors hover:text-fg"
              >
                npm
              </a>
              <Link
                href="/docs/quickstart"
                className="ml-1 rounded border border-t-green/25 bg-t-green/5 px-3 py-1.5 font-mono text-[11px] sm:text-xs font-bold text-t-green transition-all hover:bg-t-green/10 hover:border-t-green/40"
              >
                get started
              </Link>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
