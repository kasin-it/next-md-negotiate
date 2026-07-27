import Link from "next/link";
import { LlmHint } from "next-md-negotiate";
import { TerminalDemo } from "./components/terminal-demo";
import { CopyButton } from "./components/copy-button";
import { CodeBlock } from "./components/code-block";
import { InlineCode } from "./components/inline-code";
import {
  DEMO_PATH,
  DEMO_HTML,
  DEMO_MARKDOWN,
  DEMO_HTML_SIZE,
  DEMO_MD_SIZE,
  DEMO_RATIO,
} from "./content/demo-product";

const FEATURES = [
  {
    title: "One URL, two formats",
    desc: "No /api/products/42.md endpoints. The canonical path serves both HTML and markdown.",
  },
  {
    title: "Type-safe route params",
    desc: "Patterns like /products/[productId] infer TypeScript types for your handlers.",
  },
  {
    title: "SEO-safe by design",
    desc: "Crawlers see HTML only. No duplicate content, no wasted crawl budget.",
  },
  {
    title: "Discoverable by agents",
    desc: "Optional LlmHint tells AI clients markdown is available via Accept.",
  },
  {
    title: "App Router & Pages",
    desc: "Same config and patterns for both Next.js routers.",
  },
  {
    title: "One-command setup",
    desc: "npx next-md-negotiate init detects your project and wires routing.",
  },
];

const STEPS = [
  {
    label: "Configure",
    meta: "md.config.ts",
    body: "Map URL patterns to handlers that return markdown. Params are typed from the pattern.",
    code: `// md.config.ts
export const mdConfig = [
  createMdVersion(
    '/products/[productId]',
    async ({ productId }) => {
      return \`# \${name}\`
    }
  )
];`,
  },
  {
    label: "Negotiate",
    meta: "Accept header",
    body: (
      <>
        Browsers request HTML. Agents that send{" "}
        <InlineCode>Accept: text/markdown</InlineCode> get markdown instead.
      </>
    ),
    code: `Browser   → Accept: text/html
          → React page

LLM agent → Accept: text/markdown
          → markdown body`,
  },
  {
    label: "Serve",
    meta: "Same URL",
    body: "No parallel endpoints, no sitemap noise, no duplicate-content risk.",
    code: `GET ${DEMO_PATH}

// Browser
Content-Type: text/html · ${DEMO_HTML_SIZE}

// Agent
Content-Type: text/markdown · ${DEMO_MD_SIZE}`,
  },
];

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-5 ${className}`.trim()}>
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
      {subtitle != null && (
        <p className="mt-1 text-sm text-fg-3">{subtitle}</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <LlmHint />

      {/* Hero */}
      <Section className="pt-16 sm:pt-24 pb-10">
        <p className="mb-4 text-sm font-medium text-accent">
          Content negotiation for Next.js
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl sm:leading-[1.1]">
          Markdown for agents.
          <br />
          HTML for people.
          <br />
          <span className="text-fg-3">Same URL.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-2 sm:text-lg">
          next-md-negotiate serves <InlineCode>text/markdown</InlineCode> or{" "}
          <InlineCode>text/html</InlineCode> based on the{" "}
          <InlineCode>Accept</InlineCode> header — without splitting your
          routes.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-line bg-surface-1 px-4 py-2.5 shadow-sm">
            <code className="font-mono text-sm text-fg">
              npm install next-md-negotiate
            </code>
            <CopyButton text="npm install next-md-negotiate" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get started
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-lg border border-line bg-surface-1 px-4 py-2.5 text-sm font-medium text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
            >
              Read docs
            </Link>
          </div>
        </div>
      </Section>

      {/* Signature: dual response */}
      <Section className="py-12 sm:py-16">
        <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            title="One request, negotiated response"
            subtitle={
              <>
                Same path. Different <InlineCode>Accept</InlineCode>. Different
                body.
              </>
            }
          />
          <div className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-1 px-3 py-1.5 font-mono text-sm">
            <span className="font-semibold text-accent">GET</span>
            <span className="text-fg">{DEMO_PATH}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* HTML */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface-1 shadow-sm">
            <div className="flex items-center justify-between border-b border-line bg-surface-2/80 px-4 py-2.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-fg-3">
                Accept: text/html
              </span>
              <span className="text-[11px] text-fg-3">Browser</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-fg-2">
              {DEMO_HTML}
            </pre>
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px]">
              <span className="font-mono text-fg-3">text/html</span>
              <span className="font-mono font-medium text-fg">
                {DEMO_HTML_SIZE}
              </span>
            </div>
          </div>

          {/* Markdown */}
          <div className="overflow-hidden rounded-xl border border-accent/25 bg-surface-1 shadow-sm ring-1 ring-accent/10">
            <div className="flex items-center justify-between border-b border-accent/15 bg-accent-soft px-4 py-2.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-accent">
                Accept: text/markdown
              </span>
              <span className="text-[11px] text-accent/70">LLM agent</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-fg-2">
              {DEMO_MARKDOWN}
            </pre>
            <div className="flex items-center justify-between border-t border-accent/15 bg-accent-soft/50 px-4 py-2.5 text-[11px]">
              <span className="font-mono text-accent/70">text/markdown</span>
              <div className="flex items-center gap-2">
                <span className="text-fg-3">{DEMO_RATIO}</span>
                <span className="font-mono font-semibold text-accent">
                  {DEMO_MD_SIZE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Terminal demo */}
      <Section className="py-12 sm:py-16">
        <div className="mb-8">
          <SectionHeading
            title="Try the header"
            subtitle="One Accept header is enough to switch formats."
          />
        </div>
        <TerminalDemo />
      </Section>

      {/* How it works */}
      <Section className="border-t border-line py-14 sm:py-20">
        <SectionHeading
          title="How it works"
          subtitle="Configure routes, negotiate on Accept, serve both from one path."
        />
        <div className="mt-10 space-y-10">
          {STEPS.map((step) => (
            <div
              key={step.label}
              className="grid gap-6 sm:grid-cols-[140px_1fr]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {step.label}
                </p>
                <p className="mt-1 text-sm text-fg-3">{step.meta}</p>
              </div>
              <div>
                <p className="mb-3 text-sm leading-relaxed text-fg-2">
                  {step.body}
                </p>
                <CodeBlock className="text-[12px]">{step.code}</CodeBlock>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="border-t border-line py-14 sm:py-20">
        <SectionHeading
          title="Built for production Next.js"
          subtitle="Small surface area. Clear defaults."
        />
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface-1 p-5 transition-colors hover:bg-surface-2/60"
            >
              <h3 className="text-sm font-semibold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Live demo note */}
      <Section className="border-t border-line py-14 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Live on this site
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-fg">
          This documentation uses next-md-negotiate
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-fg-2">
          Request any page with <InlineCode>Accept: text/markdown</InlineCode>{" "}
          to get the markdown version.
        </p>
        <div className="mt-5 inline-block rounded-lg border border-line bg-surface-1 px-4 py-3 shadow-sm">
          <code className="font-mono text-[13px] text-fg-2">
            curl -H &quot;Accept: text/markdown&quot; &lt;this-url&gt;
          </code>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-fg-3">
            MIT License —{" "}
            <a
              href="https://kasin-it.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-2 underline-offset-2 hover:text-fg hover:underline"
            >
              Kacper Siniło
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-fg-3">
            <Link href="/docs" className="hover:text-fg transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/kasin-it/next-md-negotiate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/next-md-negotiate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
            >
              npm
            </a>
            <a
              href="https://x.com/kacpersinilo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
