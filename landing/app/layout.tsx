import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "next-md-negotiate",
    template: "%s · next-md-negotiate",
  },
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
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-surface font-sans text-fg antialiased">
        <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-tight text-fg transition-colors hover:text-fg-2"
            >
              next-md-negotiate
            </Link>

            <nav className="flex items-center gap-1 sm:gap-4">
              <Link
                href="/docs"
                className="rounded-md px-2.5 py-1.5 text-sm text-fg-2 transition-colors hover:text-fg"
              >
                Docs
              </Link>
              <a
                href="https://github.com/kasin-it/next-md-negotiate"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md px-2.5 py-1.5 text-sm text-fg-2 transition-colors hover:text-fg sm:inline"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/next-md-negotiate"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md px-2.5 py-1.5 text-sm text-fg-2 transition-colors hover:text-fg md:inline"
              >
                npm
              </a>
              <Link
                href="/docs/quickstart"
                className="ml-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
