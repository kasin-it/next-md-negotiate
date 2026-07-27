import { LlmHint } from "next-md-negotiate";
import { CodeBlock } from "../../components/code-block";
import { DocsPager } from "../../components/docs-pager";

export default function ConfigurationPage() {
  return (
    <div className="prose-docs">
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
      <CodeBlock>{`import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  createMdVersion('/', async () => {
    return '# Home\\n\\nWelcome to our site.';
  }),

  createMdVersion('/products/[productId]',
    async ({ productId }) => {
      const p = await db.products.find(productId);
      return \`# \${p.name}\\n\\n**Price:** $\${p.price}\`;
  }),

  createMdVersion('/blog/[...slug]',
    async ({ slug }) => {
      const post = await getPost(slug);
      return post.markdown;
  }),
];`}</CodeBlock>

      <h2>createMdVersion</h2>
      <p>
        The main function for defining markdown routes. It takes a pattern, a
        handler, and optional configuration:
      </p>
      <CodeBlock>{`createMdVersion(pattern, handler, options?)`}</CodeBlock>

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
      <CodeBlock>{`// Static
'/about'              → matches /about

// Dynamic
'/products/[id]'    → matches /products/42
'/[org]/[repo]'     → matches /vercel/next.js

// Catch-all
'/docs/[...slug]'   → matches /docs/a/b/c

// Root
'/'                   → matches /`}</CodeBlock>

      <h2>Type-safe parameters</h2>
      <p>
        TypeScript automatically infers the correct parameter types from your
        route pattern using the <code>ExtractParams</code> utility type:
      </p>
      <CodeBlock>{`// TypeScript knows the exact params

'/products/[productId]'
  → { productId: string }

'/[org]/[repo]'
  → { org: string; repo: string }

'/docs/[...slug]'
  → { slug: string }

'/'
  → {}`}</CodeBlock>

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
      <CodeBlock>{`// next.config.ts
import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

export default {
  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },
}`}</CodeBlock>

      <h3>Strategy 2: Middleware</h3>
      <p>
        Uses Next.js middleware to intercept requests. Gives you more control but
        adds slight runtime overhead.
      </p>
      <CodeBlock>{`// middleware.ts
import { createNegotiatorFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

const negotiate = createNegotiatorFromConfig(mdConfig);

export function middleware(request) {
  const response = negotiate(request);
  if (response) return response;
}`}</CodeBlock>

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
      <CodeBlock>{`import { createMdHandler } from 'next-md-negotiate';
import { mdConfig } from '@/md.config';

export const GET = createMdHandler(mdConfig);`}</CodeBlock>

      <div className="info-box">
        <strong>Pages Router:</strong> Use <code>createMdApiHandler</code>{" "}
        instead, which returns a Next.js API route handler compatible with{" "}
        <code>NextApiRequest</code> / <code>NextApiResponse</code>.
      </div>

      <hr />
      <DocsPager />
    </div>
  );
}
