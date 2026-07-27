"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "../docs/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 shrink-0 lg:block">
      <div className="sticky top-24">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-fg-3">
          Documentation
        </p>
        <nav className="flex flex-col gap-0.5">
          {DOCS_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-fg-2 hover:bg-surface-2 hover:text-fg"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 overflow-x-auto lg:hidden">
      <div className="flex min-w-max gap-1 pb-1">
        {DOCS_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors ${
                active
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-fg-3 hover:bg-surface-2 hover:text-fg-2"
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
