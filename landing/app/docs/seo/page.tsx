import { LlmHint } from "next-md-negotiate";
import Link from "next/link";

export default function SeoPage() {
  return (
    <div className="prose-terminal">
      <LlmHint />
      <h1>SEO & Crawling Budget</h1>
      <p className="subtitle">
        How content negotiation avoids duplicate content penalties and preserves
        your crawling budget.
      </p>

      <h2>The problem with separate endpoints</h2>
      <p>
        The common approach to serving markdown for LLMs is to create separate
        API endpoints — something like <code>/api/products/42.md</code> or{" "}
        <code>/api/md/products/42</code>. This creates problems:
      </p>
      <ul>
        <li>
          <strong>Duplicate content:</strong> Two URLs serve the same
          information. Search engines may see this as duplicate content and
          penalize your site
        </li>
        <li>
          <strong>Wasted crawl budget:</strong> Search engine crawlers may
          discover and index your markdown endpoints, wasting precious crawl
          budget on content that isn&apos;t meant for them
        </li>
        <li>
          <strong>Sitemap bloat:</strong> You need to either exclude markdown
          URLs from your sitemap or accept an inflated sitemap
        </li>
        <li>
          <strong>Maintenance overhead:</strong> Two sets of routes to maintain,
          two sets of URLs to manage
        </li>
      </ul>

      <h2>How content negotiation solves this</h2>
      <p>
        next-md-negotiate uses HTTP content negotiation, which means{" "}
        <strong>no new URLs are created</strong>. The same URL{" "}
        <code>/products/42</code> serves both HTML and markdown depending on the
        Accept header:
      </p>

      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Separate Endpoints</th>
            <th>Content Negotiation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>URLs created</td>
            <td>2x (HTML + markdown)</td>
            <td>1x (same URL)</td>
          </tr>
          <tr>
            <td>Duplicate content risk</td>
            <td>High</td>
            <td>None</td>
          </tr>
          <tr>
            <td>Crawl budget impact</td>
            <td>Doubled</td>
            <td>Zero</td>
          </tr>
          <tr>
            <td>Sitemap changes</td>
            <td>Required</td>
            <td>None</td>
          </tr>
          <tr>
            <td>robots.txt changes</td>
            <td>Recommended</td>
            <td>None</td>
          </tr>
        </tbody>
      </table>

      <h2>Zero impact on crawling budget</h2>
      <p>
        Crawling budget is the number of pages a search engine will crawl on your
        site within a given time period. Every URL it crawls uses part of this
        budget.
      </p>
      <p>With next-md-negotiate:</p>
      <ul>
        <li>
          <strong>No new URLs exist</strong> — there is nothing extra to crawl
        </li>
        <li>
          <strong>Crawlers send text/html</strong> — standard search engine
          crawlers (Googlebot, Bingbot, etc.) always request HTML, so they get
          the normal page
        </li>
        <li>
          <strong>No accidental indexing</strong> — markdown is only returned
          when explicitly requested via the Accept header, which crawlers
          don&apos;t do
        </li>
        <li>
          <strong>robots.txt unchanged</strong> — no new paths to block or allow
        </li>
      </ul>

      <h2>How different crawlers behave</h2>

      <h3>Standard search engines</h3>
      <p>
        Google, Bing, Yandex, and other search engines send{" "}
        <code>Accept: text/html</code>. They will always receive your normal HTML
        page. Content negotiation is invisible to them — your SEO is completely
        unaffected.
      </p>

      <h3>LLM crawlers</h3>
      <p>
        AI crawlers like those from OpenAI, Anthropic, and Perplexity can opt-in
        to receive markdown by sending <code>Accept: text/markdown</code>. This
        is beneficial for both sides:
      </p>
      <ul>
        <li>
          <strong>For you:</strong> LLM agents consume significantly less
          bandwidth (markdown is 10-50x smaller than HTML)
        </li>
        <li>
          <strong>For LLMs:</strong> Clean, structured markdown is easier to parse
          and produces better results than extracting text from HTML
        </li>
      </ul>

      <h3>Standard web crawlers</h3>
      <p>
        Tools like wget, curl (without explicit headers), and most web scrapers
        send generic Accept headers (<code>*/*</code>). They receive HTML by
        default. Only explicit <code>text/markdown</code> requests get markdown.
      </p>

      <h2>Canonical URLs</h2>
      <p>
        Since both representations share the same URL, there is no canonical URL
        conflict. Your existing <code>{"<link rel=\"canonical\">"}</code> tags
        continue to work exactly as before. No changes to your canonical URL
        strategy are needed.
      </p>

      <h2>Best practices</h2>

      <ol>
        <li>
          <strong>Keep content in sync</strong> — The markdown version should
          contain the same information as the HTML version. Don&apos;t hide
          important content in one format only
        </li>
        <li>
          <strong>Markdown should be a subset</strong> — It&apos;s fine for the
          markdown version to be simpler (no navigation, no sidebars, no
          decorative content). Focus on the core content
        </li>
        <li>
          <strong>Don&apos;t block LLM crawlers</strong> — If you want to serve
          markdown to AI agents, make sure your robots.txt doesn&apos;t block
          their user agents
        </li>
        <li>
          <strong>Use LlmHint</strong> — The{" "}
          <Link href="/docs/llm-hints">LlmHint component</Link> helps AI agents
          discover that markdown is available, so they can re-request with the
          right header
        </li>
      </ol>

      <div className="info-box">
        <strong>Bottom line:</strong> Content negotiation is the SEO-safe way to
        serve markdown to LLMs. No new URLs, no duplicate content, no wasted
        crawl budget. Your search rankings are not affected.
      </div>

      <hr />

      <div className="flex flex-col sm:flex-row gap-3 not-prose mt-4">
        <Link
          href="/docs/concepts"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          ← Core Concepts
        </Link>
        <Link
          href="/docs/configuration"
          className="border border-line rounded-lg px-4 py-3 font-mono text-sm text-fg-2 hover:text-t-green hover:border-t-green/30 transition-all"
        >
          Configuration →
        </Link>
      </div>
    </div>
  );
}
