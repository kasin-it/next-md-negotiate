"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV, getDocsNeighbors } from "../docs/nav";

/** Extra next links for hub pages (beyond sequential next). */
const EXTRA_NEXT: Record<string, readonly { title: string; href: string }[]> = {
  "/docs/quickstart": [
    { title: "Configuration", href: "/docs/configuration" },
    { title: "SEO & Crawling", href: "/docs/seo" },
  ],
};

export function DocsPager() {
  const pathname = usePathname();
  const { prev, next } = getDocsNeighbors(pathname);
  const extras = EXTRA_NEXT[pathname] ?? [];

  // Last page: restore "Back to Docs" (Overview) as an exit path.
  const backToDocs =
    !next && prev && pathname !== "/docs"
      ? { title: "Back to Docs", href: DOCS_NAV[0].href }
      : null;

  if (!prev && !next && extras.length === 0 && !backToDocs) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {prev ? (
        <Link href={prev.href} className="docs-nav-link">
          ← {prev.title}
        </Link>
      ) : null}
      {next ? (
        <Link href={next.href} className="docs-nav-link">
          {next.title} →
        </Link>
      ) : null}
      {extras.map((item) => (
        <Link key={item.href} href={item.href} className="docs-nav-link">
          {item.title} →
        </Link>
      ))}
      {backToDocs ? (
        <Link href={backToDocs.href} className="docs-nav-link">
          {backToDocs.title}
        </Link>
      ) : null}
    </div>
  );
}
