import { LlmHint } from "next-md-negotiate";
import { CodeBlock } from "../../components/code-block";
import { DocsPager } from "../../components/docs-pager";

export default function LlmHintsPage() {
  return (
    <div className="prose-docs">
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
      <CodeBlock>{`import { LlmHint } from 'next-md-negotiate';

export default function Page() {
  return (
    <div>
      <LlmHint />
      <h1>My Page</h1>
      <p>Page content...</p>
    </div>
  );
}`}</CodeBlock>

      <h2>How it works</h2>
      <p>
        The component renders a <code>{"<script>"}</code> tag with a special
        type attribute that browsers ignore but LLMs can read:
      </p>
      <CodeBlock>{`<!-- Rendered HTML (invisible to browsers) -->
<script type="text/llms.txt">
  You are viewing the HTML version of this page.
  A structured markdown version is available and
  is significantly smaller and easier to parse.
  To receive the markdown version, re-request
  this exact URL with the HTTP header
  \`Accept: text/markdown\`.
</script>`}</CodeBlock>
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
          className="text-accent border-b border-accent/30 hover:border-accent"
        >
          Vercel&apos;s proposal for inline LLM instructions
        </a>{" "}
        in HTML.
      </div>

      <h2>Custom messages</h2>
      <p>You can customize the hint message in three ways:</p>

      <h3>1. Per-component</h3>
      <CodeBlock>{`<LlmHint message="Markdown available. Request with Accept: text/markdown." />`}</CodeBlock>

      <h3>2. Per-route (in md.config.ts)</h3>
      <CodeBlock>{`createMdVersion('/products/[id]', handler, {
  hintText: 'Product data available as markdown...'
});`}</CodeBlock>

      <h3>3. Global default (in md.config.ts)</h3>
      <p>
        Used by the CLI <code>add-hints</code> command when injecting{" "}
        <code>{"<LlmHint />"}</code> components into your pages:
      </p>
      <CodeBlock>{`export const defaultHintText =
  'This page has a markdown version. Use Accept: text/markdown.';`}</CodeBlock>

      <h2>Skipping hints</h2>
      <p>
        To skip the LlmHint for a specific route (e.g., internal pages you
        don&apos;t want LLMs to re-request):
      </p>
      <CodeBlock>{`createMdVersion('/internal/dashboard', handler, {
  skipHint: true
});`}</CodeBlock>

      <h2>CLI commands</h2>
      <p>
        The CLI can automatically inject or remove LlmHint components from all
        your pages that have corresponding markdown routes:
      </p>
      <CodeBlock>{`# Add hints to all configured pages
$ npx next-md-negotiate add-hints

# Remove all hints
$ npx next-md-negotiate remove-hints`}</CodeBlock>
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
      <DocsPager />
    </div>
  );
}
