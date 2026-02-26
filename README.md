# next-md-negotiate

Content negotiation for Next.js — serve Markdown to LLMs and HTML to browsers from the same URL.

## The problem

Your Next.js app serves HTML. LLMs, crawlers, and AI agents want Markdown. Today you're stuck choosing between:

- **Separate endpoints** (`/api/products/123.md`) — duplicates your routing, goes stale, and clients have to know about a non-standard URL scheme.
- **Markdown-only pages** — breaks the browser experience for human visitors.

The HTTP `Accept` header already solves this. A browser sends `Accept: text/html`. An LLM client sends `Accept: text/markdown`. Your server should respond accordingly — but Next.js has no built-in way to do this.

## The solution

`next-md-negotiate` intercepts requests that ask for Markdown, rewrites them to an internal API route, and returns the Markdown version you define — all transparently, from the same URL.

```
Browser   → GET /products/42  Accept: text/html       → your normal Next.js page
LLM agent → GET /products/42  Accept: text/markdown   → your Markdown version
```

No new URLs. No duplicate routing. The client just sets an `Accept` header.

## Install

```bash
npm install next-md-negotiate
```

## Quick start

### 1. Scaffold the handler

```bash
npx next-md-negotiate init
```

This creates:

- **App Router:** `app/md-api/[...path]/route.ts`
- **Pages Router:** `pages/api/md-api/[...path].ts`
- **Config:** `md.config.ts`

### 2. Define your Markdown versions

```ts
// md.config.ts
import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    const product = await db.products.find(productId);
    return `# ${product.name}\n\nPrice: $${product.price}\n\n${product.description}`;
  }),

  createMdVersion('/blog/[slug]', async ({ slug }) => {
    const post = await db.posts.find(slug);
    return `# ${post.title}\n\n${post.content}`;
  }),
];
```

Parameters are type-safe — `{ productId }` is inferred from the `[productId]` in the pattern.

### 3. Add rewrites to `next.config`

This works with both App Router and Pages Router, on any supported Next.js version. Routes are generated directly from your config — no duplication.

```ts
// next.config.ts
import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

export default {
  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },
};
```

That's it. Requests with `Accept: text/markdown` get your Markdown. Everything else is untouched.

## How it works

```
                         Accept: text/markdown?
                                │
                      ┌─────────┴─────────┐
                      │ yes               │ no
                      ▼                   ▼
              Route matches?        Normal Next.js
                      │              page renders
               ┌──────┴──────┐
               │ yes         │ no
               ▼             ▼
        Rewrite to        Pass through
       /md-api/...
               │
               ▼
    Catch-all handler
    runs your function
               │
               ▼
     200 text/markdown
```

1. The rewrite/middleware/proxy layer checks the `Accept` header for `text/markdown`, `application/markdown`, or `text/x-markdown`.
2. If the request matches a configured route, it internally rewrites to `/md-api/...`.
3. The catch-all route handler matches the path against your registry and calls your function.
4. Your function returns a Markdown string. The handler sends it back as `text/markdown; charset=utf-8`.

## Alternative: middleware or proxy

The `next.config` rewrites approach covers most use cases. If you need content negotiation to live in your request-handling layer instead — for example, you already have a `middleware.ts` handling auth/i18n/redirects, or you're on Next.js 16+ using `proxy.ts` — use `createNegotiatorFromConfig`:

```ts
// middleware.ts or proxy.ts
import { createNegotiatorFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

const md = createNegotiatorFromConfig(mdConfig);

export function middleware(request: Request) {
  // Check markdown negotiation first
  const mdResponse = md(request);
  if (mdResponse) return mdResponse;

  // ...your other middleware logic (auth, i18n, etc.)
}
```

Routes are read from `mdConfig` — the same single source of truth used by rewrites and the handler.

### When to use what

| Method | Best for |
|---|---|
| **`next.config` rewrites** | Most projects. Zero runtime overhead — Next.js handles the routing natively. Works with both App Router and Pages Router. |
| **`middleware.ts` / `proxy.ts`** | Projects that already have a middleware or proxy and want all request interception in one place. |

## Testing it

```bash
# Normal HTML response
curl http://localhost:3000/products/42

# Markdown response
curl -H "Accept: text/markdown" http://localhost:3000/products/42
```

## API

### `createMdVersion(pattern, handler)`

Defines a Markdown version for a route.

```ts
createMdVersion('/products/[productId]', async ({ productId }) => {
  return `# Product ${productId}`;
});
```

**Supported patterns:**
- Named params: `/products/[productId]`
- Catch-all params: `/docs/[...slug]`
- Multiple params: `/[org]/[repo]`
- Static routes: `/about`

### `createMdHandler(mdConfig)`

Creates an App Router handler for the catch-all route. Assign it to `GET`.

```ts
export const GET = createMdHandler(mdConfig);
```

### `createMdApiHandler(mdConfig)`

Creates a Pages Router API handler for the catch-all route.

```ts
export default createMdApiHandler(mdConfig);
```

### `createRewritesFromConfig(mdConfig, options?)`

Generates Next.js rewrite rules directly from your `mdConfig` array. The recommended approach for most projects.

```ts
createRewritesFromConfig(mdConfig)
```

### `createNegotiatorFromConfig(mdConfig, options?)`

Creates a middleware/proxy handler directly from your `mdConfig` array. Returns a `Response` for markdown requests, or `undefined` to pass through.

```ts
const md = createNegotiatorFromConfig(mdConfig);
```

**Options (shared by both):**

| Option | Type | Default | Description |
|---|---|---|---|
| `internalPrefix` | `string` | `'/md-api'` | Internal rewrite destination prefix |

### `createMarkdownRewrites(options)` / `createMarkdownNegotiator(options)`

Lower-level versions that accept explicit route arrays. Use the config-based versions above unless you have a reason not to.

| Option | Type | Default | Description |
|---|---|---|---|
| `routes` | `string[]` | required | Route patterns to negotiate |
| `internalPrefix` | `string` | `'/md-api'` | Internal rewrite destination prefix |

## License

MIT
