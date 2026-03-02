import { createMdVersion } from "next-md-negotiate";

const docsContent: Record<string, string> = {
  quickstart: `# Quick Start

Get content negotiation running in your Next.js app in under 2 minutes.

## Prerequisites

- Node.js 18 or later
- A Next.js 14+ project (App Router or Pages Router)

## 1. Install the package

\`\`\`bash
npm install next-md-negotiate
\`\`\`

Or use pnpm/yarn/bun:

\`\`\`bash
pnpm add next-md-negotiate
yarn add next-md-negotiate
bun add next-md-negotiate
\`\`\`

## 2. Initialize your project

\`\`\`bash
npx next-md-negotiate init
\`\`\`

This will:
1. Detect App Router or Pages Router
2. Create a route handler at \`app/md-api/[[...path]]/route.ts\`
3. Create \`md.config.ts\`
4. Ask which strategy you prefer (rewrites or middleware)
5. Apply the selected strategy

**Flags:** \`--rewrites\`, \`--middleware\` (skip prompt), \`--add-hints\` (inject LlmHint).

## 3. Define your first markdown route

\`\`\`typescript
// md.config.ts
import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    const product = await getProduct(productId);
    return \`# \${product.name}\\n\\n**Price:** $\${product.price}\`;
  }),
];
\`\`\`

## 4. Test it

\`\`\`bash
npm run dev
curl -H "Accept: text/markdown" localhost:3000/products/42
\`\`\`

## 5. Add LLM hints (optional)

\`\`\`tsx
import { LlmHint } from 'next-md-negotiate';

export default function Page() {
  return (
    <div>
      <LlmHint />
      {/* your content */}
    </div>
  );
}
\`\`\`

Or use the CLI: \`npx next-md-negotiate add-hints\`
`,

  concepts: `# Core Concepts

How HTTP content negotiation works and how next-md-negotiate implements it.

## What is content negotiation?

Content negotiation is an HTTP mechanism that lets a client and server agree on the best representation of a resource. The client sends an \`Accept\` header indicating what content types it can handle, and the server responds with the most appropriate format.

## The Accept header

next-md-negotiate looks for these markdown types in the Accept header:
- \`text/markdown\` — the standard MIME type
- \`application/markdown\` — alternative registration
- \`text/x-markdown\` — legacy vendor prefix

If the Accept header contains any of these **and** the URL matches a configured route, markdown is returned.

## Browsers vs LLM agents

| Client | Accept Header | Gets |
|--------|--------------|------|
| Chrome, Firefox, Safari | text/html | Normal HTML page |
| LLM agent / AI crawler | text/markdown | Markdown document |
| curl (default) | */* | Normal HTML page |
| curl (with header) | text/markdown | Markdown document |

Browsers **never** send \`text/markdown\`, so they always get HTML.

## Route patterns

- Static: \`/about\` — matches /about
- Dynamic: \`/products/[productId]\` — matches /products/42
- Multiple params: \`/[org]/[repo]\` — matches /vercel/next.js
- Catch-all: \`/docs/[...slug]\` — matches /docs/a/b/c
- Root: \`/\` — matches /

## The request flow

1. Request arrives
2. Accept header checked for markdown MIME types
3. URL matched against configured patterns
4. If both match: rewrite to internal handler
5. Handler runs, returns markdown string
6. Response sent with \`Content-Type: text/markdown; charset=utf-8\`

First matching route wins — put specific routes before general ones.
`,

  seo: `# SEO & Crawling Budget

How content negotiation preserves crawling budget and avoids duplicate content penalties.

## The problem with separate endpoints

Creating separate endpoints like \`/api/products/42.md\` causes:
- **Duplicate content:** Two URLs serve the same info — search engines may penalize this
- **Wasted crawl budget:** Crawlers may index markdown endpoints
- **Sitemap bloat:** Extra URLs to manage
- **Maintenance overhead:** Two sets of routes

## How content negotiation solves this

**No new URLs are created.** Same URL \`/products/42\` serves both formats:

| Aspect | Separate Endpoints | Content Negotiation |
|--------|-------------------|-------------------|
| URLs created | 2x | 1x |
| Duplicate content risk | High | None |
| Crawl budget impact | Doubled | Zero |
| Sitemap changes | Required | None |
| robots.txt changes | Recommended | None |

## Zero impact on crawling budget

- No new URLs exist — nothing extra to crawl
- Crawlers send text/html — they get normal pages
- No accidental indexing of markdown
- robots.txt unchanged

## How different crawlers behave

**Search engines** (Google, Bing): Send \`Accept: text/html\`. Always get HTML. Completely unaffected.

**LLM crawlers** (OpenAI, Anthropic, Perplexity): Can opt-in with \`Accept: text/markdown\`. Get smaller, cleaner content.

**Standard crawlers** (wget, curl): Send generic Accept headers. Get HTML by default.

## Best practices

1. Keep HTML and markdown content in sync
2. Markdown can be a simplified subset of the HTML
3. Don't block LLM crawlers in robots.txt if you want to serve them markdown
4. Use LlmHint to help AI agents discover markdown availability
`,

  configuration: `# Configuration

Everything about md.config.ts, route patterns, handler functions, and integration strategies.

## md.config.ts

The configuration file exports an array of route handlers:

\`\`\`typescript
import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  createMdVersion('/', async () => {
    return '# Home\\n\\nWelcome to our site.';
  }),

  createMdVersion('/products/[productId]', async ({ productId }) => {
    const p = await db.products.find(productId);
    return \`# \${p.name}\\n\\n**Price:** $\${p.price}\`;
  }),
];
\`\`\`

## createMdVersion

\`createMdVersion(pattern, handler, options?)\`

| Param | Type | Description |
|-------|------|-------------|
| pattern | string | Next.js route pattern |
| handler | (params) => Promise<string> | Returns markdown |
| options.hintText | string? | Custom LlmHint message |
| options.skipHint | boolean? | Skip LlmHint injection |

## Type-safe parameters

TypeScript infers params from route patterns:
- \`'/products/[productId]'\` -> \`{ productId: string }\`
- \`'/[org]/[repo]'\` -> \`{ org: string; repo: string }\`
- \`'/docs/[...slug]'\` -> \`{ slug: string }\`

## Integration: Rewrites (recommended)

\`\`\`typescript
// next.config.ts
import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

export default {
  async rewrites() {
    return { beforeFiles: createRewritesFromConfig(mdConfig) };
  },
};
\`\`\`

## Integration: Middleware

\`\`\`typescript
// middleware.ts
import { createNegotiatorFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

const negotiate = createNegotiatorFromConfig(mdConfig);

export function middleware(request) {
  const response = negotiate(request);
  if (response) return response;
}
\`\`\`

## Route handler

App Router (\`app/md-api/[[...path]]/route.ts\`):
\`\`\`typescript
import { createMdHandler } from 'next-md-negotiate';
import { mdConfig } from '@/md.config';
export const GET = createMdHandler(mdConfig);
\`\`\`

Pages Router: Use \`createMdApiHandler\` instead.
`,

  "llm-hints": `# LLM Hints

Make your markdown endpoints discoverable to AI agents.

## The discoverability problem

Content negotiation works when an LLM agent knows to send \`Accept: text/markdown\`. But most agents visiting your site for the first time will just request HTML.

LLM hints embed a hidden instruction in HTML that tells agents: "A markdown version is available. Re-request with \`Accept: text/markdown\`."

## The LlmHint component

\`\`\`tsx
import { LlmHint } from 'next-md-negotiate';

export default function Page() {
  return (
    <div>
      <LlmHint />
      <h1>My Page</h1>
    </div>
  );
}
\`\`\`

## How it works

Renders: \`<script type="text/llms.txt">...message...</script>\`

The \`type="text/llms.txt"\` means browsers ignore it. LLMs reading the HTML see the instruction.

Inspired by [Vercel's proposal for inline LLM instructions](https://vercel.com/blog/a-proposal-for-inline-llm-instructions-in-html).

## Custom messages

**Per-component:** \`<LlmHint message="Custom message" />\`

**Per-route:** \`createMdVersion('/path', handler, { hintText: '...' })\`

**Global:** \`export const defaultHintText = '...'\` in md.config.ts

## Skipping hints

\`createMdVersion('/internal', handler, { skipHint: true })\`

## CLI commands

\`\`\`bash
npx next-md-negotiate add-hints     # Inject into all configured pages
npx next-md-negotiate remove-hints  # Remove all hints
\`\`\`
`,

  api: `# API Reference

Complete reference for all exports from next-md-negotiate.

## createMdVersion(pattern, handler, options?)

Define a markdown route.

- **pattern** (string): Next.js route pattern
- **handler** ((params) => Promise<string>): Returns markdown
- **options.hintText** (string?): Custom LlmHint message
- **options.skipHint** (boolean?): Skip LlmHint injection

## createMdHandler(mdConfig)

App Router handler. Use in \`app/md-api/[[...path]]/route.ts\`.
Returns web Response with \`Content-Type: text/markdown; charset=utf-8\`.

## createMdApiHandler(mdConfig)

Pages Router handler. Use in \`pages/api/md-api/[...path].ts\`.

## createRewritesFromConfig(mdConfig, options?)

Generate Next.js rewrite rules. \`options.internalPrefix\` defaults to \`/md-api\`.

## createNegotiatorFromConfig(mdConfig, options?)

Create middleware negotiation function. Returns rewrite response or undefined.

## createMarkdownRewrites(options)

Lower-level: generate rewrites from route string array.

## createMarkdownNegotiator(options)

Lower-level: create negotiator from route string array.

## LlmHint

React component. Props: \`message?: string\`.
Renders \`<script type="text/llms.txt">message</script>\`.

## Types

### ExtractParams<T>

Infers params from route pattern:
- \`'/products/[productId]'\` -> \`{ productId: string }\`
- \`'/[org]/[repo]'\` -> \`{ org: string; repo: string }\`
- \`'/docs/[...slug]'\` -> \`{ slug: string }\`

### MdVersionHandler

\`\`\`typescript
interface MdVersionHandler {
  pattern: string;
  handler: (params: Record<string, string>) => Promise<string>;
  hintText?: string;
  skipHint?: boolean;
}
\`\`\`

## CLI

- \`npx next-md-negotiate init [--rewrites|--middleware] [--add-hints]\`
- \`npx next-md-negotiate add-hints\`
- \`npx next-md-negotiate remove-hints\`
`,
};

export const mdConfig = [
  createMdVersion("/", async () => {
    return `# next-md-negotiate

Serve markdown to LLMs. HTML to humans. Same URL.

## What is this?

next-md-negotiate is a content negotiation library for Next.js. It lets you serve markdown to LLM agents and HTML to browsers from the same URL using HTTP Accept headers.

## How it works

1. **Configure** — define markdown routes in \`md.config.ts\`
2. **Negotiate** — the Accept header determines the response format
3. **Serve** — same URL returns HTML to browsers, markdown to LLMs

## Quick install

\`\`\`bash
npm install next-md-negotiate
npx next-md-negotiate init
\`\`\`

## Key features

- **Zero duplicate URLs** — single canonical URL for both formats
- **Type-safe params** — TypeScript infers parameters from route patterns
- **SEO neutral** — search engines only see HTML, no duplicate content
- **LLM discoverable** — hidden hints tell AI agents markdown is available
- **Both routers** — works with App Router and Pages Router
- **One command setup** — CLI detects your project and configures everything

## Links

- Documentation: /docs
- Quick Start: /docs/quickstart
- GitHub: https://github.com/kasin-it/next-md-negotiate
- npm: https://www.npmjs.com/package/next-md-negotiate
`;
  }),

  createMdVersion("/docs", async () => {
    return `# Documentation — next-md-negotiate

Everything you need to add content negotiation to your Next.js app.

## Pages

- [Quick Start](/docs/quickstart) — Install, initialize, and serve your first markdown route
- [Core Concepts](/docs/concepts) — HTTP content negotiation, Accept headers, route patterns
- [SEO & Crawling](/docs/seo) — How content negotiation preserves crawling budget
- [Configuration](/docs/configuration) — md.config.ts, patterns, handlers, strategies
- [LLM Hints](/docs/llm-hints) — Make markdown endpoints discoverable to AI agents
- [API Reference](/docs/api) — Complete reference for all exports

## How it works (short version)

HTTP has a built-in mechanism for content negotiation: the Accept header. When an LLM agent requests a page with \`Accept: text/markdown\`, next-md-negotiate returns a markdown version instead of the normal HTML page.

The key insight: **no new URLs are created**. Same URL serves both formats. Zero impact on sitemap, zero duplicate content, zero wasted crawling budget.
`;
  }),

  createMdVersion("/docs/[...slug]", async ({ slug }) => {
    const content = docsContent[slug];
    if (!content) {
      return `# Not Found\n\nNo documentation found for: ${slug}`;
    }
    return content;
  }),
];
