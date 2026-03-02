"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { title: "Overview", href: "/docs" },
  { title: "Quick Start", href: "/docs/quickstart" },
  { title: "Core Concepts", href: "/docs/concepts" },
  { title: "SEO & Crawling", href: "/docs/seo" },
  { title: "Configuration", href: "/docs/configuration" },
  { title: "LLM Hints", href: "/docs/llm-hints" },
  { title: "API Reference", href: "/docs/api" },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-20">
        <div className="font-mono text-[10px] text-fg-3 uppercase tracking-[0.12em] mb-3 pl-4">
          Documentation
        </div>
        <nav className="border-l border-line">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-1.5 pl-4 pr-2 font-mono text-[13px] transition-colors relative ${
                  active
                    ? "text-t-green"
                    : "text-fg-3 hover:text-fg-2"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-px bg-t-green -translate-x-px" />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

/* Mobile navigation for docs */
export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden mb-6 overflow-x-auto">
      <div className="flex gap-1 pb-2 min-w-max">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded font-mono text-[11px] whitespace-nowrap transition-colors ${
                active
                  ? "bg-t-green/10 text-t-green border border-t-green/20"
                  : "text-fg-3 hover:text-fg-2 border border-transparent"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
