import Link from "next/link";
import { LlmHint } from "next-md-negotiate";

const SECTIONS = [
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
    desc: "How content negotiation preserves crawling budget and avoids duplicate content penalties.",
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    desc: "md.config.ts, route patterns, handler functions, integration strategies, and options.",
  },
  {
    title: "LLM Hints",
    href: "/docs/llm-hints",
    desc: "Make your markdown endpoints discoverable to AI agents with the LlmHint component.",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    desc: "Complete reference for every function, component, type, and CLI command.",
  },
];

export default function DocsOverview() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>Documentation</h1>
      <p className="subtitle">
        Everything you need to add content negotiation to your Next.js app.
        Serve markdown to LLMs and HTML to humans — from the same URL.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 not-prose">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group block border border-line rounded-lg p-5 bg-surface-1 transition-all hover:border-line-2 hover:bg-surface-2 no-underline"
          >
            <h3 className="font-mono text-sm font-bold text-fg mb-2 group-hover:text-t-green transition-colors">
              {s.title}
              <span className="text-fg-3 ml-2 group-hover:text-t-green/50 transition-colors">
                →
              </span>
            </h3>
            <p className="text-[13px] text-fg-3 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      <hr />

      <h2>How it works — the short version</h2>

      <p>
        HTTP has a built-in mechanism for content negotiation: the{" "}
        <code>Accept</code> header. When an LLM agent requests a page with{" "}
        <code>Accept: text/markdown</code>, next-md-negotiate intercepts the
        request and returns a markdown version instead of the normal HTML page.
      </p>

      <p>
        The key insight: <strong>no new URLs are created</strong>. The same URL
        serves both formats. This means zero impact on your sitemap, zero
        duplicate content, and zero wasted crawling budget.
      </p>

      <div className="code-block">
        <span className="comment">
          {"// Same URL, different Accept header, different response"}
        </span>
        {"\n\n"}
        <span className="green">GET</span> /products/42{"\n"}
        Accept: text/html        → <span className="amber">HTML page (~26 KB)</span>
        {"\n\n"}
        <span className="green">GET</span> /products/42{"\n"}
        Accept: text/markdown    → <span className="green">Markdown doc (~101 B)</span>
      </div>
    </div>
  );
}
