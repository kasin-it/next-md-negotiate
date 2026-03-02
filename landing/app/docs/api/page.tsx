import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function ApiReferencePage() {
  return (
    <div className="prose-terminal">
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
      <div className="code-block">
        <span className="function">createMdVersion</span>&lt;
        <span className="type">T</span> <span className="keyword">extends</span>{" "}
        <span className="type">string</span>&gt;({"\n  "}
        pattern: <span className="type">T</span>,{"\n  "}
        handler: (params: <span className="type">ExtractParams</span>&lt;
        <span className="type">T</span>&gt;) =&gt;{" "}
        <span className="type">Promise</span>&lt;
        <span className="type">string</span>&gt;,{"\n  "}
        options?: {"{"}
        {"\n    "}hintText?: <span className="type">string</span>;
        {"\n    "}skipHint?: <span className="type">boolean</span>;
        {"\n  }"}
        {"\n): "}
        <span className="type">MdVersionHandler</span>
      </div>

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
      <div className="code-block">
        <span className="function">createMdHandler</span>({"\n  "}
        registry: <span className="type">MdVersionHandler</span>[]
        {"\n): ("}
        {"\n  "}req: <span className="type">Request</span>,
        {"\n  "}ctx: {"{ "}params: <span className="type">Promise</span>&lt;{"{ "}path?: <span className="type">string</span>[]
        {" }>"} {"}"}
        {"\n) => "}
        <span className="type">Promise</span>&lt;
        <span className="type">Response</span>&gt;
      </div>
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
      <div className="code-block">
        <span className="function">createMdApiHandler</span>({"\n  "}
        registry: <span className="type">MdVersionHandler</span>[]
        {"\n): ("}
        {"\n  "}req: <span className="type">NextApiRequest</span>,
        {"\n  "}res: <span className="type">NextApiResponse</span>
        {"\n) => "}
        <span className="type">Promise</span>&lt;
        <span className="type">void</span>&gt;
      </div>

      {/* ── createRewritesFromConfig ───────────── */}

      <h2>createRewritesFromConfig</h2>
      <p>
        Generate Next.js rewrite rules from your config. These rewrites match
        requests with markdown Accept headers and redirect them to the internal
        handler.
      </p>
      <div className="code-block">
        <span className="function">createRewritesFromConfig</span>({"\n  "}
        handlers: <span className="type">MdVersionHandler</span>[],{"\n  "}
        options?: {"{ "}internalPrefix?: <span className="type">string</span>
        {" }"}
        {"\n): "}
        <span className="type">Rewrite</span>[]
      </div>
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
      <div className="code-block">
        <span className="function">createNegotiatorFromConfig</span>({"\n  "}
        handlers: <span className="type">MdVersionHandler</span>[],{"\n  "}
        options?: {"{ "}internalPrefix?: <span className="type">string</span>
        {" }"}
        {"\n): ("}
        {"\n  "}request: <span className="type">Request</span>
        {"\n) => "}
        <span className="type">NextResponse</span> |{" "}
        <span className="type">undefined</span>
      </div>

      {/* ── Lower-level APIs ───────────────────── */}

      <h2>Lower-level APIs</h2>
      <p>
        For advanced use cases, these functions provide direct access to the
        rewrite and negotiation logic without requiring a config array:
      </p>

      <h3>createMarkdownRewrites</h3>
      <div className="code-block">
        <span className="function">createMarkdownRewrites</span>(options: {"{"}
        {"\n  "}routes: <span className="type">string</span>[],
        {"\n  "}internalPrefix?: <span className="type">string</span>
        {"\n}): "}
        <span className="type">Rewrite</span>[]
      </div>

      <h3>createMarkdownNegotiator</h3>
      <div className="code-block">
        <span className="function">createMarkdownNegotiator</span>(options: {"{"}
        {"\n  "}routes: <span className="type">string</span>[],
        {"\n  "}internalPrefix?: <span className="type">string</span>
        {"\n}): ("}
        {"\n  "}request: <span className="type">Request</span>
        {"\n) => "}
        <span className="type">NextResponse</span> |{" "}
        <span className="type">undefined</span>
      </div>

      {/* ── LlmHint ────────────────────────────── */}

      <h2>LlmHint</h2>
      <p>
        React component that renders a hidden hint for LLM agents.
      </p>
      <div className="code-block">
        <span className="green">{"<LlmHint"}</span>{"\n  "}
        <span className="type">message</span>?:{" "}
        <span className="type">string</span>
        {"\n"}
        <span className="green">{"/>"}</span>
      </div>
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
      <div className="code-block">
        <span className="keyword">type</span>{" "}
        <span className="type">ExtractParams</span>&lt;
        <span className="type">T</span> <span className="keyword">extends</span>{" "}
        <span className="type">string</span>&gt;
        {"\n\n"}
        <span className="comment">{"// Examples:"}</span>
        {"\n"}
        <span className="type">ExtractParams</span>&lt;
        <span className="string">{`'/products/[productId]'`}</span>&gt;
        {"\n  → { "}
        <span className="type">productId</span>:{" "}
        <span className="type">string</span>
        {" }\n\n"}
        <span className="type">ExtractParams</span>&lt;
        <span className="string">{`'/[org]/[repo]'`}</span>&gt;
        {"\n  → { "}
        <span className="type">org</span>:{" "}
        <span className="type">string</span>; <span className="type">repo</span>
        : <span className="type">string</span>
        {" }\n\n"}
        <span className="type">ExtractParams</span>&lt;
        <span className="string">{`'/docs/[...slug]'`}</span>&gt;
        {"\n  → { "}
        <span className="type">slug</span>:{" "}
        <span className="type">string</span>
        {" }"}
      </div>

      <h3>MdVersionHandler</h3>
      <div className="code-block">
        <span className="keyword">interface</span>{" "}
        <span className="type">MdVersionHandler</span> {"{"}
        {"\n  "}pattern: <span className="type">string</span>;
        {"\n  "}handler: (params: <span className="type">Record</span>&lt;
        <span className="type">string</span>,{" "}
        <span className="type">string</span>&gt;) =&gt;{" "}
        <span className="type">Promise</span>&lt;
        <span className="type">string</span>&gt;;
        {"\n  "}hintText?: <span className="type">string</span>;
        {"\n  "}skipHint?: <span className="type">boolean</span>;
        {"\n}"}
      </div>

      {/* ── CLI ────────────────────────────────── */}

      <h2>CLI Commands</h2>

      <h3>init</h3>
      <div className="code-block">
        <span className="green">$</span> npx next-md-negotiate init [flags]
        {"\n\n"}
        <span className="dim">Flags:</span>
        {"\n  --rewrites     "}
        <span className="comment">Use rewrites strategy (skip prompt)</span>
        {"\n  --middleware   "}
        <span className="comment">Use middleware strategy (skip prompt)</span>
        {"\n  --add-hints   "}
        <span className="comment">Inject LlmHint into pages</span>
      </div>

      <h3>add-hints</h3>
      <div className="code-block">
        <span className="green">$</span> npx next-md-negotiate add-hints
        {"\n\n"}
        <span className="dim">
          Injects {"<LlmHint />"} into all pages with configured routes.
        </span>
      </div>

      <h3>remove-hints</h3>
      <div className="code-block">
        <span className="green">$</span> npx next-md-negotiate remove-hints
        {"\n\n"}
        <span className="dim">
          Removes all {"<LlmHint />"} components and imports from pages.
        </span>
      </div>

      <hr />

      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/llm-hints"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          ← LLM Hints
        </Link>
        <Link
          href="/docs"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          Back to Docs
        </Link>
      </div>
    </div>
  );
}
