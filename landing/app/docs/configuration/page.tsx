import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function ConfigurationPage() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>Configuration</h1>
      <p className="subtitle">
        Everything about md.config.ts, route patterns, handler functions, and
        integration strategies.
      </p>

      <h2>md.config.ts</h2>
      <p>
        The configuration file is the single source of truth for all your
        markdown routes. It exports an array of route handlers created with{" "}
        <code>createMdVersion</code>:
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
        <span className="string">{`'/'`}</span>,{" "}
        <span className="keyword">async</span> () =&gt; {"{"}
        {"\n    "}
        <span className="keyword">return</span>{" "}
        <span className="string">{`'# Home\\n\\nWelcome to our site.'`}</span>;
        {"\n  }),\n\n  "}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/products/[productId]'`}</span>,{"\n    "}
        <span className="keyword">async</span> {"({ productId }) => {\n"}
        {"      "}
        <span className="keyword">const</span> p ={" "}
        <span className="keyword">await</span> db.products.find(productId);
        {"\n      "}
        <span className="keyword">return</span>{" "}
        <span className="string">{"`# \\${p.name}\\n\\n**Price:** $\\${p.price}`"}</span>
        ;{"\n  }),\n\n  "}
        <span className="function">createMdVersion</span>(
        <span className="string">{`'/blog/[...slug]'`}</span>,{"\n    "}
        <span className="keyword">async</span> {"({ slug }) => {\n"}
        {"      "}
        <span className="keyword">const</span> post ={" "}
        <span className="keyword">await</span> getPost(slug);{"\n      "}
        <span className="keyword">return</span> post.markdown;
        {"\n  }),\n];"}
      </div>

      <h2>createMdVersion</h2>
      <p>
        The main function for defining markdown routes. It takes a pattern, a
        handler, and optional configuration:
      </p>
      <div className="code-block">
        <span className="function">createMdVersion</span>(pattern, handler, options?)
      </div>

      <h3>Parameters</h3>
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
            <td>
              <code>pattern</code>
            </td>
            <td>
              <code>string</code>
            </td>
            <td>
              Next.js-style route pattern (<code>/path</code>,{" "}
              <code>/path/[param]</code>, <code>/path/[...slug]</code>)
            </td>
          </tr>
          <tr>
            <td>
              <code>handler</code>
            </td>
            <td>
              <code>(params) =&gt; Promise&lt;string&gt;</code>
            </td>
            <td>
              Async function that receives extracted params and returns markdown
            </td>
          </tr>
          <tr>
            <td>
              <code>options</code>
            </td>
            <td>
              <code>object</code>
            </td>
            <td>Optional configuration (see below)</td>
          </tr>
        </tbody>
      </table>

      <h3>Options</h3>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>hintText</code>
            </td>
            <td>
              <code>string</code>
            </td>
            <td>default message</td>
            <td>Custom LlmHint message for this route</td>
          </tr>
          <tr>
            <td>
              <code>skipHint</code>
            </td>
            <td>
              <code>boolean</code>
            </td>
            <td>
              <code>false</code>
            </td>
            <td>Skip LlmHint injection for this route</td>
          </tr>
        </tbody>
      </table>

      <h2>Route patterns</h2>
      <p>Patterns follow Next.js App Router conventions:</p>
      <div className="code-block">
        <span className="comment">{"// Static"}</span>
        {"\n"}
        <span className="string">{`'/about'`}</span>
        {"              "}
        <span className="dim">→ matches /about</span>
        {"\n\n"}
        <span className="comment">{"// Dynamic"}</span>
        {"\n"}
        <span className="string">{`'/products/[id]'`}</span>
        {"    "}
        <span className="dim">→ matches /products/42</span>
        {"\n"}
        <span className="string">{`'/[org]/[repo]'`}</span>
        {"     "}
        <span className="dim">→ matches /vercel/next.js</span>
        {"\n\n"}
        <span className="comment">{"// Catch-all"}</span>
        {"\n"}
        <span className="string">{`'/docs/[...slug]'`}</span>
        {"   "}
        <span className="dim">→ matches /docs/a/b/c</span>
        {"\n\n"}
        <span className="comment">{"// Root"}</span>
        {"\n"}
        <span className="string">{`'/'`}</span>
        {"                   "}
        <span className="dim">→ matches /</span>
      </div>

      <h2>Type-safe parameters</h2>
      <p>
        TypeScript automatically infers the correct parameter types from your
        route pattern using the <code>ExtractParams</code> utility type:
      </p>
      <div className="code-block">
        <span className="comment">{"// TypeScript knows the exact params"}</span>
        {"\n\n"}
        <span className="string">{`'/products/[productId]'`}</span>
        {"\n  → "}
        <span className="type">{`{ productId: string }`}</span>
        {"\n\n"}
        <span className="string">{`'/[org]/[repo]'`}</span>
        {"\n  → "}
        <span className="type">{`{ org: string; repo: string }`}</span>
        {"\n\n"}
        <span className="string">{`'/docs/[...slug]'`}</span>
        {"\n  → "}
        <span className="type">{`{ slug: string }`}</span>
        {"\n\n"}
        <span className="string">{`'/'`}</span>
        {"\n  → "}
        <span className="type">{`{}`}</span>
      </div>

      <h2>Integration strategies</h2>
      <p>
        There are two ways to connect content negotiation to your Next.js
        routing: <strong>rewrites</strong> and <strong>middleware</strong>.
      </p>

      <h3>Strategy 1: Rewrites (recommended)</h3>
      <p>
        Uses Next.js native rewrite rules with header conditions. Zero runtime
        overhead — rewrites are evaluated by the Next.js router before your code
        runs.
      </p>
      <div className="code-block">
        <span className="comment">{"// next.config.ts"}</span>
        {"\n"}
        <span className="keyword">import</span> {"{ "}
        <span className="type">createRewritesFromConfig</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n"}
        <span className="keyword">import</span> {"{ mdConfig } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'./md.config'`}</span>;{"\n\n"}
        <span className="keyword">export default</span> {"{\n  "}
        <span className="keyword">async</span>{" "}
        <span className="function">rewrites</span>() {"{"}
        {"\n    "}
        <span className="keyword">return</span> {"{\n"}
        {"      beforeFiles: "}
        <span className="function">createRewritesFromConfig</span>(mdConfig),
        {"\n    };\n  },\n}"}
      </div>

      <h3>Strategy 2: Middleware</h3>
      <p>
        Uses Next.js middleware to intercept requests. Gives you more control but
        adds slight runtime overhead.
      </p>
      <div className="code-block">
        <span className="comment">{"// middleware.ts"}</span>
        {"\n"}
        <span className="keyword">import</span> {"{ "}
        <span className="type">createNegotiatorFromConfig</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n"}
        <span className="keyword">import</span> {"{ mdConfig } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'./md.config'`}</span>;{"\n\n"}
        <span className="keyword">const</span> negotiate ={" "}
        <span className="function">createNegotiatorFromConfig</span>(mdConfig);
        {"\n\n"}
        <span className="keyword">export function</span>{" "}
        <span className="function">middleware</span>(request) {"{"}
        {"\n  "}
        <span className="keyword">const</span> response = negotiate(request);
        {"\n  "}
        <span className="keyword">if</span> (response){" "}
        <span className="keyword">return</span> response;
        {"\n}"}
      </div>

      <h3>Comparison</h3>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Rewrites</th>
            <th>Middleware</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance</td>
            <td>Zero overhead</td>
            <td>Slight overhead</td>
          </tr>
          <tr>
            <td>Flexibility</td>
            <td>Limited</td>
            <td>Full control</td>
          </tr>
          <tr>
            <td>Setup</td>
            <td>next.config.ts</td>
            <td>middleware.ts</td>
          </tr>
          <tr>
            <td>Best for</td>
            <td>Most projects</td>
            <td>Custom logic needed</td>
          </tr>
        </tbody>
      </table>

      <h2>Route handler</h2>
      <p>
        Both strategies route matched requests to an internal handler. For App
        Router, this lives at <code>app/md-api/[[...path]]/route.ts</code>:
      </p>
      <div className="code-block">
        <span className="keyword">import</span> {"{ "}
        <span className="type">createMdHandler</span>
        {" } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'next-md-negotiate'`}</span>;{"\n"}
        <span className="keyword">import</span> {"{ mdConfig } "}
        <span className="keyword">from</span>{" "}
        <span className="string">{`'@/md.config'`}</span>;{"\n\n"}
        <span className="keyword">export const</span> GET ={" "}
        <span className="function">createMdHandler</span>(mdConfig);
      </div>

      <div className="info-box">
        <strong>Pages Router:</strong> Use <code>createMdApiHandler</code>{" "}
        instead, which returns a Next.js API route handler compatible with{" "}
        <code>NextApiRequest</code> / <code>NextApiResponse</code>.
      </div>

      <hr />

      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/seo"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          ← SEO & Crawling
        </Link>
        <Link
          href="/docs/llm-hints"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          LLM Hints →
        </Link>
      </div>
    </div>
  );
}
