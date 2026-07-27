import { LlmHint } from "next-md-negotiate";
import Link from "next/link";
import { CodeBlock } from "../../components/code-block";
import { DocsPager } from "../../components/docs-pager";

export default function ApiReferencePage() {
  return (
    <div className="prose-docs">
      <LlmHint />
      <h1>API Reference</h1>
      <p className="subtitle">
        Complete reference for every function, component, type, and CLI command
        exported by next-md-negotiate.
      </p>

      {/* ── createMdVersion ────────────────────── */}

      <h2>createMdVersion</h2>
      <p>
        Define a markdown route. This is the primary function you use in{" "}
        <code>md.config.ts</code>.
      </p>
      <CodeBlock>{`createMdVersion<T extends string>(
  pattern: T,
  handler: (params: ExtractParams<T>) => Promise<string>,
  options?: {
    hintText?: string;
    skipHint?: boolean;
  }
): MdVersionHandler`}</CodeBlock>

      <table>
        <thead>
          <tr>
            <th>Param</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>pattern</code></td>
            <td><code>string</code></td>
            <td>Next.js route pattern</td>
          </tr>
          <tr>
            <td><code>handler</code></td>
            <td><code>(params) =&gt; Promise&lt;string&gt;</code></td>
            <td>Returns markdown string for the matched route</td>
          </tr>
          <tr>
            <td><code>options.hintText</code></td>
            <td><code>string?</code></td>
            <td>Custom hint message for this route</td>
          </tr>
          <tr>
            <td><code>options.skipHint</code></td>
            <td><code>boolean?</code></td>
            <td>Skip LlmHint injection for this route</td>
          </tr>
        </tbody>
      </table>

      {/* ── createMdHandler ────────────────────── */}

      <h2>createMdHandler</h2>
      <p>
        Create an App Router route handler from your config. Use this in{" "}
        <code>app/md-api/[[...path]]/route.ts</code>.
      </p>
      <CodeBlock>{`createMdHandler(
  registry: MdVersionHandler[]
): (
  req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) => Promise<Response>`}</CodeBlock>
      <p>
        Returns a standard web <code>Response</code> with{" "}
        <code>Content-Type: text/markdown; charset=utf-8</code> on match, or
        404 if no route matches.
      </p>

      {/* ── createMdApiHandler ─────────────────── */}

      <h2>createMdApiHandler</h2>
      <p>
        Create a Pages Router API handler. Use this in{" "}
        <code>pages/api/md-api/[...path].ts</code>.
      </p>
      <CodeBlock>{`createMdApiHandler(
  registry: MdVersionHandler[]
): (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>`}</CodeBlock>

      {/* ── createRewritesFromConfig ───────────── */}

      <h2>createRewritesFromConfig</h2>
      <p>
        Generate Next.js rewrite rules from your config. These rewrites match
        requests with markdown Accept headers and redirect them to the internal
        handler.
      </p>
      <CodeBlock>{`createRewritesFromConfig(
  handlers: MdVersionHandler[],
  options?: { internalPrefix?: string }
): Rewrite[]`}</CodeBlock>
      <p>
        The <code>internalPrefix</code> defaults to <code>/md-api</code>.
        Each rewrite includes a header condition matching{" "}
        <code>text/markdown</code>, <code>application/markdown</code>, or{" "}
        <code>text/x-markdown</code> in the Accept header.
      </p>

      {/* ── createNegotiatorFromConfig ─────────── */}

      <h2>createNegotiatorFromConfig</h2>
      <p>
        Create a middleware negotiation function from your config. Returns a
        rewrite response when a markdown request matches, or{" "}
        <code>undefined</code> to pass through.
      </p>
      <CodeBlock>{`createNegotiatorFromConfig(
  handlers: MdVersionHandler[],
  options?: { internalPrefix?: string }
): (
  request: Request
) => NextResponse | undefined`}</CodeBlock>

      {/* ── Lower-level APIs ───────────────────── */}

      <h2>Lower-level APIs</h2>
      <p>
        For advanced use cases, these functions provide direct access to the
        rewrite and negotiation logic without requiring a config array:
      </p>

      <h3>createMarkdownRewrites</h3>
      <CodeBlock>{`createMarkdownRewrites(options: {
  routes: string[],
  internalPrefix?: string
}): Rewrite[]`}</CodeBlock>

      <h3>createMarkdownNegotiator</h3>
      <CodeBlock>{`createMarkdownNegotiator(options: {
  routes: string[],
  internalPrefix?: string
}): (
  request: Request
) => NextResponse | undefined`}</CodeBlock>

      {/* ── LlmHint ────────────────────────────── */}

      <h2>LlmHint</h2>
      <p>
        React component that renders a hidden hint for LLM agents.
      </p>
      <CodeBlock>{`<LlmHint
  message?: string
/>`}</CodeBlock>
      <p>
        Renders <code>{"<script type=\"text/llms.txt\">message</script>"}</code>.
        Invisible to browsers, readable by LLMs. See{" "}
        <Link href="/docs/llm-hints">LLM Hints</Link> for details.
      </p>

      {/* ── Types ──────────────────────────────── */}

      <h2>Types</h2>

      <h3>ExtractParams&lt;T&gt;</h3>
      <p>
        Utility type that extracts parameter names from a route pattern string:
      </p>
      <CodeBlock>{`type ExtractParams<T extends string>

// Examples:
ExtractParams<'/products/[productId]'>
  → { productId: string }

ExtractParams<'/[org]/[repo]'>
  → { org: string; repo: string }

ExtractParams<'/docs/[...slug]'>
  → { slug: string }`}</CodeBlock>

      <h3>MdVersionHandler</h3>
      <CodeBlock>{`interface MdVersionHandler {
  pattern: string;
  handler: (params: Record<string, string>) => Promise<string>;
  hintText?: string;
  skipHint?: boolean;
}`}</CodeBlock>

      {/* ── CLI ────────────────────────────────── */}

      <h2>CLI Commands</h2>

      <h3>init</h3>
      <CodeBlock>{`$ npx next-md-negotiate init [flags]

Flags:
  --rewrites     Use rewrites strategy (skip prompt)
  --middleware   Use middleware strategy (skip prompt)
  --add-hints    Inject LlmHint into pages`}</CodeBlock>

      <h3>add-hints</h3>
      <CodeBlock>{`$ npx next-md-negotiate add-hints

Injects <LlmHint /> into all pages with configured routes.`}</CodeBlock>

      <h3>remove-hints</h3>
      <CodeBlock>{`$ npx next-md-negotiate remove-hints

Removes all <LlmHint /> components and imports from pages.`}</CodeBlock>

      <hr />
      <DocsPager />
    </div>
  );
}
