import { LlmHint } from "next-md-negotiate";
import { CodeBlock } from "../../components/code-block";
import { DocsPager } from "../../components/docs-pager";

export default function QuickStartPage() {
  return (
    <div className="prose-docs">
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
      <CodeBlock>{`$ npm install next-md-negotiate`}</CodeBlock>
      <p>
        Or use your preferred package manager:
      </p>
      <CodeBlock>{`$ pnpm add next-md-negotiate
$ yarn add next-md-negotiate
$ bun add next-md-negotiate`}</CodeBlock>

      <h2>2. Initialize your project</h2>
      <p>
        The CLI auto-detects your project structure and creates all necessary files:
      </p>
      <CodeBlock>{`$ npx next-md-negotiate init`}</CodeBlock>
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
      <CodeBlock>{`import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    const product = await getProduct(productId);
    return \`# \${product.name}\\n\\n**Price:** $\${product.price}\`;
  }),
];`}</CodeBlock>

      <p>
        The handler receives <strong>fully type-safe parameters</strong>{" "}
        extracted from the route pattern. TypeScript knows that{" "}
        <code>{`'/products/[productId]'`}</code> gives you{" "}
        <code>{`{ productId: string }`}</code>.
      </p>

      <h2>4. Test it</h2>
      <p>Start your dev server and test with curl:</p>
      <CodeBlock>{`# Start the dev server
$ npm run dev

# Request markdown from your route
$ curl -H "Accept: text/markdown" localhost:3000/products/42

# Response:
# Product 42

**Price:** $42.00`}</CodeBlock>

      <h2>5. Add LLM hints (optional)</h2>
      <p>
        Help AI agents discover that markdown is available by adding the{" "}
        <code>LlmHint</code> component to your pages:
      </p>
      <CodeBlock>{`import { LlmHint } from 'next-md-negotiate';

export default function ProductPage() {
  return (
    <div>
      <LlmHint />
      { /* your page content */ }
    </div>
  );
}`}</CodeBlock>
      <p>
        Or run the CLI command to inject hints into all configured pages:
      </p>
      <CodeBlock>{`$ npx next-md-negotiate add-hints`}</CodeBlock>

      <hr />

      <h2>Next steps</h2>
      <DocsPager />
    </div>
  );
}
