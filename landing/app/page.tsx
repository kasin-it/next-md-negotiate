import Link from "next/link";
import { LlmHint } from "next-md-negotiate";
import { TerminalDemo } from "./components/terminal-demo";
import { CopyButton } from "./components/copy-button";

const FEATURES = [
  {
    title: "Zero Duplicate URLs",
    desc: "Single canonical URL serves both formats. No /api/products/42.md endpoints cluttering your sitemap.",
    icon: "~",
  },
  {
    title: "Type-Safe Params",
    desc: "Route parameters are inferred from patterns. TypeScript knows [productId] means { productId: string }.",
    icon: "T",
  },
  {
    title: "SEO Neutral",
    desc: "Search engines only see HTML. No duplicate content penalties. Crawling budget stays intact.",
    icon: "#",
  },
  {
    title: "LLM Discoverable",
    desc: "Hidden hints tell AI agents markdown is available. They re-request with the right Accept header.",
    icon: ">",
  },
  {
    title: "Both Routers",
    desc: "Works with App Router and Pages Router. Same config, same patterns, same API.",
    icon: "/",
  },
  {
    title: "One Command Setup",
    desc: "npx next-md-negotiate init detects your project, creates config, sets up routing. Done.",
    icon: "$",
  },
];

export default function Home() {
  return (
    <main className="pt-14">
      <LlmHint />

      {/* ════════════════════════════════════════════ */}
      {/* ── HERO ──────────────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="relative px-5 pt-20 sm:pt-28 pb-8">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-t-green/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-line-2 bg-surface-2 font-mono text-[11px] text-fg-3">
            <span className="w-1.5 h-1.5 rounded-full bg-t-green animate-glow" />
            v1.1.2 — content negotiation for Next.js
          </div>

          {/* Title */}
          <h1 className="animate-fade-in stagger-1 font-mono font-bold text-3xl sm:text-5xl md:text-6xl tracking-tighter leading-[1.1]">
            <span className="text-t-green animate-glow">next-md</span>
            <br />
            <span className="text-fg">negotiate</span>
          </h1>

          {/* Tagline */}
          <p className="animate-fade-in stagger-2 mt-6 font-mono text-base sm:text-lg text-fg-2 max-w-xl mx-auto leading-relaxed">
            Serve{" "}
            <span className="text-t-amber">markdown to LLMs</span>.{" "}
            <span className="text-fg">HTML to humans</span>.{" "}
            <span className="text-fg-3">Same URL.</span>
          </p>

          {/* Install command */}
          <div className="animate-fade-in stagger-3 mt-10 inline-flex items-center gap-3 bg-surface-1 border border-line rounded-lg px-5 py-3">
            <code className="font-mono text-sm text-fg-2">
              <span className="text-t-green">$</span>{" "}
              npm install next-md-negotiate
            </code>
            <CopyButton text="npm install next-md-negotiate" />
          </div>

          {/* CTAs */}
          <div className="animate-fade-in stagger-4 mt-8 flex items-center justify-center gap-4">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-2 rounded-lg border border-t-green/30 bg-t-green/8 px-5 py-2.5 font-mono text-sm font-bold text-t-green transition-all hover:bg-t-green/15 hover:border-t-green/50"
            >
              get started
              <span className="text-t-green/60">→</span>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-line-2 px-5 py-2.5 font-mono text-sm text-fg-2 transition-all hover:border-line-3 hover:text-fg"
            >
              read docs
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── NEGOTIATION FLOW ──────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="px-5 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Request bar */}
          <div className="animate-fade-in stagger-5 flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-surface-2 border border-line-2 rounded-lg font-mono text-sm">
              <span className="text-t-green font-bold">GET</span>
              <span className="text-fg">/products/42</span>
            </div>
          </div>

          {/* Vertical connector + label */}
          <div className="animate-fade-in stagger-6 flex flex-col items-center py-5 gap-3">
            <div className="w-px h-5 bg-gradient-to-b from-line-2 to-t-cyan/30" />
            <div className="relative px-4 py-1.5 rounded-full border border-t-cyan/15 bg-t-cyan/[0.04] font-mono text-[10px] text-t-cyan uppercase tracking-[0.14em]">
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-px bg-t-cyan/20" />
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-px bg-t-cyan/20" />
              content negotiation
            </div>
            {/* Branch lines */}
            <div className="hidden sm:flex items-start w-full max-w-md">
              <div className="flex-1 h-px bg-gradient-to-l from-line-2 to-transparent" />
              <div className="flex flex-col items-center -mt-px">
                <div className="w-px h-4 bg-line-2" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-line-2 to-transparent" />
            </div>
            <div className="sm:hidden w-px h-3 bg-line-2" />
          </div>

          {/* Response panels */}
          <div className="grid sm:grid-cols-2 gap-4 animate-fade-in stagger-6">
            {/* HTML panel — dimmed, heavy */}
            <div className="relative rounded-lg border border-line bg-surface-1/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-line bg-surface-2/60">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-2">
                  Accept: text/html
                </span>
                <span className="font-mono text-[10px] text-fg-2">Browser</span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-[1.8] text-fg whitespace-pre">{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport"
    content="width=device..."/>
  <link rel="stylesheet"
    href="/_next/static/css/
    a8f2e...c3.css"/>
  <script src="/_next/static/
    chunks/webpack-3b...js"
    async=""></script>
</head>
<body class="__variable_
  a8c2f __variable_e9b36">
  <div id="__next">
    <main class="flex min-h-
      screen flex-col">
      <h1>Product 42</h1>
      <span>$42.00</span>
    </main>
  </div>
</body>
</html>`}</div>
              <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-surface-2/60">
                <span className="font-mono text-[10px] text-fg-2">text/html; charset=utf-8</span>
                <span className="font-mono text-[11px] font-bold text-fg">~26 KB</span>
              </div>
            </div>

            {/* Markdown panel — bright, clean, glowing */}
            <div className="relative rounded-lg border border-t-green/25 bg-surface-1 overflow-hidden shadow-[0_0_40px_-12px_rgba(0,255,65,0.1)]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-t-green/15 bg-t-green/[0.03]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-t-green/80">
                  Accept: text/markdown
                </span>
                <span className="font-mono text-[10px] text-t-green/60">LLM Agent</span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-[1.8] whitespace-pre"><span className="text-white font-bold"># Product 42</span>
{"\n"}
<span className="text-t-amber">**Price:**</span><span className="text-fg"> $42.00</span>
<span className="text-t-amber">**Category:**</span><span className="text-fg"> Electronics</span>
<span className="text-t-amber">**In Stock:**</span><span className="text-fg"> Yes</span>
{"\n"}
<span className="text-fg-2">A premium electronic product</span>
<span className="text-fg-2">with exceptional build quality</span>
<span className="text-fg-2">and innovative features.</span></div>
              <div className="flex items-center justify-between px-4 py-2 border-t border-t-green/15 bg-t-green/[0.03]">
                <span className="font-mono text-[10px] text-t-green/60">text/markdown; charset=utf-8</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-t-green/50">~257x smaller</span>
                  <span className="font-mono text-[11px] font-bold text-t-green">~101 B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shared URL note */}
          <div className="animate-fade-in stagger-6 mt-6 text-center">
            <span className="font-mono text-[11px] text-fg-3">
              same url · same content · different format
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── TERMINAL DEMO ─────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="px-5 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-mono font-bold text-xl sm:text-2xl text-fg">
              See it in action
            </h2>
            <p className="mt-2 font-mono text-sm text-fg-3">
              One header. That&apos;s all it takes.
            </p>
          </div>
          <TerminalDemo />
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── HOW IT WORKS ──────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="px-5 py-16 sm:py-24 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-mono font-bold text-xl sm:text-2xl text-fg">
              Three steps. Zero complexity.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 01 */}
            <div className="group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-3xl font-bold text-t-green/30">
                  01
                </span>
                <span className="font-mono text-sm font-bold text-fg uppercase tracking-wider">
                  Configure
                </span>
              </div>
              <p className="text-sm text-fg-3 mb-4 leading-relaxed">
                Define your markdown routes in a single config file. Each route
                maps a URL pattern to a handler that returns markdown.
              </p>
              <div className="code-block text-[12px]">
                <span className="comment">{"// md.config.ts"}</span>
                {"\n"}
                <span className="keyword">{"export const"}</span>
                {" mdConfig = [\n  "}
                <span className="function">createMdVersion</span>
                {"(\n    "}
                <span className="string">{"'/products/[productId]'"}</span>
                {",\n    "}
                <span className="keyword">{"async"}</span>
                {" ({ productId }) => {\n      "}
                <span className="keyword">{"return"}</span>
                {" "}
                <span className="string">{"`# ${name}`"}</span>
                {"\n    }\n  )\n];"}
              </div>
            </div>

            {/* Step 02 */}
            <div className="group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-3xl font-bold text-t-green/30">
                  02
                </span>
                <span className="font-mono text-sm font-bold text-fg uppercase tracking-wider">
                  Negotiate
                </span>
              </div>
              <p className="text-sm text-fg-3 mb-4 leading-relaxed">
                HTTP Accept header determines the response format. Browsers get
                HTML. LLM agents requesting markdown get markdown.
              </p>
              <div className="code-block text-[12px]">
                <span className="comment">{"// Automatic routing"}</span>
                {"\n\n"}
                <span className="dim">{"Browser   →"}</span>
                {" Accept: text/html\n"}
                <span className="dim">{"          →"}</span>
                <span className="amber">{" renders React page"}</span>
                {"\n\n"}
                <span className="dim">{"LLM Agent →"}</span>
                {" Accept: text/markdown\n"}
                <span className="dim">{"          →"}</span>
                <span className="green">{" returns markdown"}</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-3xl font-bold text-t-green/30">
                  03
                </span>
                <span className="font-mono text-sm font-bold text-fg uppercase tracking-wider">
                  Serve
                </span>
              </div>
              <p className="text-sm text-fg-3 mb-4 leading-relaxed">
                Same URL serves both formats. No duplicate endpoints. No SEO
                penalties. Crawling budget preserved.
              </p>
              <div className="code-block text-[12px]">
                <span className="green">{"GET"}</span>
                {" /products/42\n\n"}
                <span className="comment">{"// Browser sees:"}</span>
                {"\n"}
                <span className="dim">{"Content-Type: text/html"}</span>
                {"\n"}
                <span className="dim">{"Size: ~26 KB"}</span>
                {"\n\n"}
                <span className="comment">{"// LLM agent sees:"}</span>
                {"\n"}
                <span className="green">{"Content-Type: text/markdown"}</span>
                {"\n"}
                <span className="green">{"Size: ~101 B"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── FEATURES ──────────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="px-5 py-16 sm:py-24 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-mono font-bold text-xl sm:text-2xl text-fg">
              Built for production
            </h2>
            <p className="mt-2 font-mono text-sm text-fg-3">
              Everything you need. Nothing you don&apos;t.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative border border-line rounded-lg p-5 bg-surface-1 transition-colors hover:border-line-2 hover:bg-surface-2"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-surface-3 border border-line font-mono text-sm font-bold text-t-green shrink-0">
                    {f.icon}
                  </span>
                  <h3 className="font-mono text-sm font-bold text-fg pt-1">
                    {f.title}
                  </h3>
                </div>
                <p className="text-[13px] text-fg-3 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── LIVE DEMO ─────────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <section className="px-5 py-16 sm:py-20 border-t border-line">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-[11px] text-t-green uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-t-green animate-glow" />
            Live demo
          </div>
          <h2 className="font-mono font-bold text-xl sm:text-2xl text-fg mb-4">
            This site runs next-md-negotiate
          </h2>
          <p className="font-mono text-sm text-fg-3 mb-8 max-w-lg mx-auto leading-relaxed">
            Every page on this site serves markdown to LLM agents.
            Try it yourself — request any page with an Accept: text/markdown header.
          </p>
          <div className="inline-block bg-surface-1 border border-line rounded-lg px-5 py-3 text-left">
            <code className="font-mono text-[13px] text-fg-2">
              <span className="text-t-green">$</span> curl -H{" "}
              <span className="text-t-amber">&quot;Accept: text/markdown&quot;</span>{" "}
              <span className="text-fg-3">{"<this-url>"}</span>
            </code>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* ── FOOTER ────────────────────────────────── */}
      {/* ════════════════════════════════════════════ */}

      <footer className="px-5 py-10 border-t border-line">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-fg-3">
            MIT License —{" "}
            <a
              href="https://kasin-it.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-2 hover:text-fg transition-colors"
            >
              Kacper Siniło
            </a>
          </div>
          <div className="flex items-center gap-5 font-mono text-xs text-fg-3">
            <Link href="/docs" className="hover:text-fg-2 transition-colors">
              docs
            </Link>
            <a
              href="https://github.com/kasin-it/next-md-negotiate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-2 transition-colors"
            >
              github
            </a>
            <a
              href="https://www.npmjs.com/package/next-md-negotiate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-2 transition-colors"
            >
              npm
            </a>
            <a
              href="https://x.com/kacpersinilo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-2 transition-colors"
            >
              x
            </a>
            <a
              href="https://www.linkedin.com/in/kacper-sini%C5%82o/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-2 transition-colors"
            >
              linkedin
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
