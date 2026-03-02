import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function ConceptsPage() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>Core Concepts</h1>
      <p className="subtitle">
        How HTTP content negotiation works and how next-md-negotiate implements
        it for Next.js applications.
      </p>

      <h2>What is content negotiation?</h2>
      <p>
        Content negotiation is a mechanism defined in the HTTP specification that
        allows a client and server to agree on the best representation of a
        resource. The client sends an <code>Accept</code> header indicating what
        content types it can handle, and the server responds with the most
        appropriate format.
      </p>
      <p>
        This is not new or experimental — it has been part of HTTP since the
        beginning. When your browser requests a web page, it sends{" "}
        <code>Accept: text/html</code>. When an API client requests JSON, it
        sends <code>Accept: application/json</code>.
      </p>

      <h2>The Accept header</h2>
      <p>
        The <code>Accept</code> header tells the server what content types the
        client understands. next-md-negotiate looks for these markdown types:
      </p>
      <ul>
        <li>
          <code>text/markdown</code> — the standard MIME type
        </li>
        <li>
          <code>application/markdown</code> — alternative registration
        </li>
        <li>
          <code>text/x-markdown</code> — legacy vendor prefix
        </li>
      </ul>
      <p>
        If the Accept header contains any of these types{" "}
        <strong>and</strong> the requested URL matches a configured route, the
        server returns markdown instead of HTML.
      </p>

      <h2>Browsers vs LLM agents</h2>
      <p>
        The key difference between browsers and LLM agents is the Accept header
        they send:
      </p>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Accept Header</th>
            <th>Gets</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chrome, Firefox, Safari</td>
            <td>
              <code>text/html</code>
            </td>
            <td>Normal HTML page</td>
          </tr>
          <tr>
            <td>LLM agent / AI crawler</td>
            <td>
              <code>text/markdown</code>
            </td>
            <td>Markdown document</td>
          </tr>
          <tr>
            <td>curl (default)</td>
            <td>
              <code>*/*</code>
            </td>
            <td>Normal HTML page</td>
          </tr>
          <tr>
            <td>curl (with header)</td>
            <td>
              <code>text/markdown</code>
            </td>
            <td>Markdown document</td>
          </tr>
        </tbody>
      </table>
      <p>
        Browsers <strong>never</strong> send <code>text/markdown</code> in their
        Accept header, so they always receive the normal HTML page. Your site
        looks and works identically for human visitors.
      </p>

      <h2>Route patterns</h2>
      <p>
        next-md-negotiate supports all standard Next.js route patterns:
      </p>

      <h3>Static routes</h3>
      <div className="code-block">
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/about'`}</span>,{" "}
        <span className="keyword">async</span> () =&gt; {"{"}
        {"\n  "}
        <span className="keyword">return</span>{" "}
        <span className="string">{`'# About Us\\n...'`}</span>;{"\n}"}
        );
      </div>

      <h3>Dynamic parameters</h3>
      <div className="code-block">
        <span className="comment">
          {"// [param] → { param: string }"}
        </span>
        {"\n"}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/products/[productId]'`}</span>,{"\n  "}
        <span className="keyword">async</span> {"({ productId }) => { ... }\n);\n\n"}
        <span className="comment">
          {"// Multiple params"}
        </span>
        {"\n"}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/[org]/[repo]'`}</span>,{"\n  "}
        <span className="keyword">async</span> {"({ org, repo }) => { ... }\n);"}
      </div>

      <h3>Catch-all routes</h3>
      <div className="code-block">
        <span className="comment">
          {"// [...slug] captures nested paths"}
        </span>
        {"\n"}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/docs/[...slug]'`}</span>,{"\n  "}
        <span className="keyword">async</span> {"({ slug }) => {\n"}
        {"    "}
        <span className="comment">
          {"// /docs/getting-started → { slug: 'getting-started' }"}
        </span>
        {"\n"}
        {"    "}
        <span className="comment">
          {"// /docs/api/auth/tokens → { slug: 'api/auth/tokens' }"}
        </span>
        {"\n"}
        {"  }\n);"}
      </div>

      <h2>The request flow</h2>
      <p>
        Here is exactly what happens when a request arrives at your Next.js app
        with content negotiation configured:
      </p>
      <ol>
        <li>
          <strong>Request arrives</strong> — a client sends a GET request to your
          URL
        </li>
        <li>
          <strong>Accept header check</strong> — the library inspects the Accept
          header for markdown MIME types
        </li>
        <li>
          <strong>Route matching</strong> — the URL is matched against your
          configured patterns in <code>mdConfig</code>
        </li>
        <li>
          <strong>Rewrite or passthrough</strong> — if both checks pass, the
          request is rewritten to the internal <code>/md-api/...</code> handler;
          otherwise it passes through unchanged
        </li>
        <li>
          <strong>Handler execution</strong> — your handler function runs,
          receives the extracted parameters, and returns a markdown string
        </li>
        <li>
          <strong>Response</strong> — the markdown is returned with{" "}
          <code>Content-Type: text/markdown; charset=utf-8</code> and status 200
        </li>
      </ol>

      <div className="info-box">
        <strong>First match wins:</strong> Routes in{" "}
        <code>mdConfig</code> are checked in order. The first matching route
        handles the request. If your patterns could overlap, put more specific
        routes first.
      </div>

      <h2>Single source of truth</h2>
      <p>
        All your markdown routes are defined in one place:{" "}
        <code>md.config.ts</code>. This file is used by both the route handler
        (to match requests and generate markdown) and the routing layer (to
        generate rewrites or middleware logic). There is no duplication between
        your page routes and your markdown routes.
      </p>

      <hr />

      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/quickstart"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          ← Quick Start
        </Link>
        <Link
          href="/docs/seo"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          SEO & Crawling →
        </Link>
      </div>
    </div>
  );
}
