export const DOCS_NAV = [
  {
    title: "Overview",
    href: "/docs",
    desc: "Add content negotiation to your Next.js app. Serve markdown to LLMs and HTML to humans from the same URL.",
  },
  {
    title: "Quick Start",
    href: "/docs/quickstart",
    desc: "Install, initialize, and serve your first markdown route in under 2 minutes.",
  },
  {
    title: "Core Concepts",
    href: "/docs/concepts",
    desc: "HTTP content negotiation, Accept headers, route patterns, and the request flow.",
  },
  {
    title: "SEO & Crawling",
    href: "/docs/seo",
    desc: "How content negotiation preserves crawl budget and avoids duplicate content.",
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    desc: "md.config.ts, route patterns, handlers, integration strategies, and options.",
  },
  {
    title: "LLM Hints",
    href: "/docs/llm-hints",
    desc: "Make markdown endpoints discoverable to AI agents with LlmHint.",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    desc: "Every function, component, type, and CLI command.",
  },
] as const;

export type DocsNavItem = (typeof DOCS_NAV)[number];

export function getDocsNeighbors(pathname: string): {
  prev: DocsNavItem | null;
  next: DocsNavItem | null;
} {
  const i = DOCS_NAV.findIndex((item) => item.href === pathname);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? DOCS_NAV[i - 1] : null,
    next: i < DOCS_NAV.length - 1 ? DOCS_NAV[i + 1] : null,
  };
}
