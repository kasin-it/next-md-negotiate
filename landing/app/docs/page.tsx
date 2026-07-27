import Link from "next/link";
import { LlmHint } from "next-md-negotiate";
import { CodeBlock } from "../components/code-block";
import { DOCS_NAV } from "./nav";

export default function DocsOverview() {
  return (
    <div className="prose-docs">
      <LlmHint />
      <h1>Documentation</h1>
      <p className="subtitle">
        Add content negotiation to your Next.js app. Serve markdown to LLMs and
        HTML to humans from the same URL.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {DOCS_NAV.filter((s) => s.href !== "/docs").map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group block rounded-xl border border-line bg-surface-1 p-5 no-underline shadow-sm transition-colors hover:border-line-2 hover:bg-surface-2/50"
          >
            <h3 className="mb-1.5 text-sm font-semibold text-fg group-hover:text-accent">
              {s.title}
              <span className="ml-1.5 text-fg-3 transition-colors group-hover:text-accent/50">
                →
              </span>
            </h3>
            <p className="text-[13px] leading-relaxed text-fg-2">{s.desc}</p>
          </Link>
        ))}
      </div>

      <hr />

      <h2>How it works — short version</h2>

      <p>
        HTTP already supports content negotiation via the{" "}
        <code>Accept</code> header. When an agent requests a page with{" "}
        <code>Accept: text/markdown</code>, next-md-negotiate returns a markdown
        body instead of the HTML page.
      </p>

      <p>
        The important part: <strong>no new URLs are created</strong>. One path
        serves both formats — no sitemap changes, no duplicate content, no wasted
        crawl budget.
      </p>

      <CodeBlock>{`// Same URL, different Accept, different response

GET /products/42
Accept: text/html        → HTML page (~26 KB)

GET /products/42
Accept: text/markdown    → Markdown (~101 B)`}</CodeBlock>
    </div>
  );
}
