import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function QuickStartPage() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>Quick Start</h1>
      <p className="subtitle">
        Get content negotiation running in your Next.js app in under 2 minutes.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18 or later</li>
        <li>A Next.js 14+ project (App Router or Pages Router)</li>
      </ul>

      <h2>1. Install the package</h2>
      <div className="code-block">
        <span className="green">$</span> npm install next-md-negotiate
      </div>
      <p>
        Or use your preferred package manager:
      </p>
      <div className="code-block">
        <span className="green">$</span> pnpm add next-md-negotiate{"\n"}
        <span className="green">$</span> yarn add next-md-negotiate{"\n"}
        <span className="green">$</span> bun add next-md-negotiate
      </div>

      <h2>2. Initialize your project</h2>
      <p>
        The CLI auto-detects your project structure and creates all necessary files:
      </p>
      <div className="code-block">
        <span className="green">$</span> npx next-md-negotiate init
      </div>
      <p>This command will:</p>
      <ol>
        <li>Detect whether you use App Router or Pages Router</li>
        <li>
          Create a route handler at{" "}
          <code>app/md-api/[[...path]]/route.ts</code>
        </li>
        <li>
          Create a config file at <code>md.config.ts</code>
        </li>
        <li>Ask which routing strategy you prefer (rewrites or middleware)</li>
        <li>Apply the selected strategy to your project</li>
      </ol>

      <div className="info-box">
        <strong>Flags:</strong> Use <code>--rewrites</code> or{" "}
        <code>--middleware</code> to skip the strategy prompt. Add{" "}
        <code>--add-hints</code> to inject LlmHint components automatically.
      </div>

      <h2>3. Define your first markdown route</h2>
      <p>
        Open <code>md.config.ts</code> and add a route:
      </p>
      <div className="code-block">
        <span className="keyword">import</span> {"{ "}
        <span className="type">createMdVersion</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n\n"}
        <span className="keyword">export const</span> mdConfig = [{"\n"}
        {"  "}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/products/[productId]'`}</span>,{" "}
        <span className="keyword">async</span> {"({ productId }) => {\n"}
        {"    "}
        <span className="keyword">const</span> product ={" "}
        <span className="keyword">await</span> getProduct(productId);{"\n"}
        {"    "}
        <span className="keyword">return</span>{" "}
        <span className="string">
          {"`# ${product.name}\\n\\n**Price:** $${product.price}`"}
        </span>
        ;{"\n  }\n  ),\n];"}
      </div>

      <p>
        The handler receives <strong>fully type-safe parameters</strong>{" "}
        extracted from the route pattern. TypeScript knows that{" "}
        <code>{`'/products/[productId]'`}</code> gives you{" "}
        <code>{`{ productId: string }`}</code>.
      </p>

      <h2>4. Test it</h2>
      <p>Start your dev server and test with curl:</p>
      <div className="code-block">
        <span className="comment">{"# Start the dev server"}</span>
        {"\n"}
        <span className="green">$</span> npm run dev{"\n\n"}
        <span className="comment">
          {"# Request markdown from your route"}
        </span>
        {"\n"}
        <span className="green">$</span> curl -H{" "}
        <span className="string">{`"Accept: text/markdown"`}</span>{" "}
        localhost:3000/products/42{"\n\n"}
        <span className="comment">{"# Response:"}</span>
        {"\n"}
        <span className="dim">{"# Product 42"}</span>
        {"\n"}
        <span className="dim">{"# "}</span>
        {"\n"}
        <span className="dim">{"# **Price:** $42.00"}</span>
      </div>

      <h2>5. Add LLM hints (optional)</h2>
      <p>
        Help AI agents discover that markdown is available by adding the{" "}
        <code>LlmHint</code> component to your pages:
      </p>
      <div className="code-block">
        <span className="keyword">import</span> {"{ "}
        <span className="type">LlmHint</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n\n"}
        <span className="keyword">export default function</span>{" "}
        <span className="function">ProductPage</span>() {"{"}
        {"\n"}
        {"  "}
        <span className="keyword">return</span> ({"\n"}
        {"    <div>\n"}
        {"      "}
        <span className="green">{"<LlmHint />"}</span>
        {"\n"}
        {"      "}
        <span className="dim">{"{ /* your page content */ }"}</span>
        {"\n"}
        {"    </div>\n"}
        {"  );\n}"}
      </div>
      <p>
        Or run the CLI command to inject hints into all configured pages:
      </p>
      <div className="code-block">
        <span className="green">$</span> npx next-md-negotiate add-hints
      </div>

      <hr />

      <h2>Next steps</h2>
      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/concepts"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          Core Concepts →
        </Link>
        <Link
          href="/docs/configuration"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          Configuration →
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
