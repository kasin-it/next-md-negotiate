import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function LlmHintsPage() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>LLM Hints</h1>
      <p className="subtitle">
        Make your markdown endpoints discoverable to AI agents with invisible
        hints embedded in your HTML.
      </p>

      <h2>The discoverability problem</h2>
      <p>
        Content negotiation works when an LLM agent{" "}
        <strong>knows to send</strong>{" "}
        <code>Accept: text/markdown</code>. But most AI agents visiting your site
        for the first time will just request HTML — they don&apos;t know that
        markdown is available.
      </p>
      <p>
        LLM hints solve this by embedding a hidden instruction in your HTML that
        tells AI agents: &ldquo;A structured markdown version of this page is
        available. Re-request with{" "}
        <code>Accept: text/markdown</code> to get it.&rdquo;
      </p>

      <h2>The LlmHint component</h2>
      <p>
        Add the <code>LlmHint</code> component to any page that has a markdown
        version:
      </p>
      <div className="code-block">
        <span className="keyword">import</span> {"{ "}
        <span className="type">LlmHint</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n\n"}
        <span className="keyword">export default function</span>{" "}
        <span className="function">Page</span>() {"{"}
        {"\n  "}
        <span className="keyword">return</span> ({"\n    <div>\n      "}
        <span className="green">{"<LlmHint />"}</span>
        {"\n      <h1>My Page</h1>\n      <p>Page content...</p>\n    </div>"}
        {"\n  );\n}"}
      </div>

      <h2>How it works</h2>
      <p>
        The component renders a <code>{"<script>"}</code> tag with a special
        type attribute that browsers ignore but LLMs can read:
      </p>
      <div className="code-block">
        <span className="dim">{"<!-- Rendered HTML (invisible to browsers) -->"}</span>
        {"\n"}
        <span className="keyword">{"<script"}</span>{" "}
        <span className="type">{"type"}</span>=
        <span className="string">{`"text/llms.txt"`}</span>
        <span className="keyword">{">"}</span>
        {"\n  "}You are viewing the HTML version of this page.
        {"\n  "}A structured markdown version is available and
        {"\n  "}is significantly smaller and easier to parse.
        {"\n  "}To receive the markdown version, re-request
        {"\n  "}this exact URL with the HTTP header
        {"\n  "}<span className="green">{"`Accept: text/markdown`"}</span>.
        {"\n"}
        <span className="keyword">{"</script>"}</span>
      </div>
      <p>
        The <code>type=&quot;text/llms.txt&quot;</code> attribute means browsers
        won&apos;t execute or display this script. But when an LLM processes the
        page HTML, it reads the content and learns that markdown is available.
      </p>

      <div className="info-box">
        This approach is inspired by{" "}
        <a
          href="https://vercel.com/blog/a-proposal-for-inline-llm-instructions-in-html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-t-cyan border-b border-t-cyan/30 hover:border-t-cyan"
        >
          Vercel&apos;s proposal for inline LLM instructions
        </a>{" "}
        in HTML.
      </div>

      <h2>Custom messages</h2>
      <p>You can customize the hint message in three ways:</p>

      <h3>1. Per-component</h3>
      <div className="code-block">
        <span className="green">{"<LlmHint"}</span>{" "}
        <span className="type">message</span>=
        <span className="string">
          {`"Markdown available. Request with Accept: text/markdown."`}
        </span>
        {" "}
        <span className="green">{"/>"}</span>
      </div>

      <h3>2. Per-route (in md.config.ts)</h3>
      <div className="code-block">
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/products/[id]'`}</span>, handler, {"{"}
        {"\n  "}
        <span className="type">hintText</span>:{" "}
        <span className="string">
          {`'Product data available as markdown...'`}
        </span>
        {"\n});"}
      </div>

      <h3>3. Global default (in md.config.ts)</h3>
      <p>
        Used by the CLI <code>add-hints</code> command when injecting{" "}
        <code>{"<LlmHint />"}</code> components into your pages:
      </p>
      <div className="code-block">
        <span className="keyword">export const</span> defaultHintText =
        {"\n  "}
        <span className="string">
          {`'This page has a markdown version. Use Accept: text/markdown.'`}
        </span>
        ;
      </div>

      <h2>Skipping hints</h2>
      <p>
        To skip the LlmHint for a specific route (e.g., internal pages you
        don&apos;t want LLMs to re-request):
      </p>
      <div className="code-block">
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/internal/dashboard'`}</span>, handler, {"{"}
        {"\n  "}
        <span className="type">skipHint</span>:{" "}
        <span className="keyword">true</span>
        {"\n});"}
      </div>

      <h2>CLI commands</h2>
      <p>
        The CLI can automatically inject or remove LlmHint components from all
        your pages that have corresponding markdown routes:
      </p>
      <div className="code-block">
        <span className="comment">{"# Add hints to all configured pages"}</span>
        {"\n"}
        <span className="green">$</span> npx next-md-negotiate add-hints
        {"\n\n"}
        <span className="comment">{"# Remove all hints"}</span>
        {"\n"}
        <span className="green">$</span> npx next-md-negotiate remove-hints
      </div>
      <p>The CLI will:</p>
      <ol>
        <li>
          Parse your <code>md.config.ts</code> for{" "}
          <code>createMdVersion()</code> calls
        </li>
        <li>Find the corresponding page file for each route</li>
        <li>
          Add the import and <code>{"<LlmHint />"}</code> component (or remove
          them)
        </li>
        <li>
          Skip routes with <code>skipHint: true</code>
        </li>
      </ol>

      <h2>When to use hints</h2>
      <ul>
        <li>
          <strong>Public content pages:</strong> Product pages, blog posts, docs — add hints so LLMs
          discover the markdown version
        </li>
        <li>
          <strong>Internal pages:</strong> Dashboards, settings — use{" "}
          <code>skipHint: true</code> since LLMs don&apos;t need these
        </li>
        <li>
          <strong>High-traffic pages:</strong> Always add hints — these are the
          pages LLM agents are most likely to visit first
        </li>
      </ul>

      <hr />

      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/configuration"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          ← Configuration
        </Link>
        <Link
          href="/docs/api"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          API Reference →
        </Link>
      </div>
    </div>
  );
}
