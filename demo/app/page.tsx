import Link from "next/link";
import { getAllProducts, getAllBlogPosts } from "@/lib/data";

export default async function Home() {
  const [products, posts] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      {/* Header */}
      <header className="animate-in">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-accent">$</span>
          <h1 className="font-mono text-2xl font-medium tracking-tight">
            next-md-negotiate
          </h1>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Same URL. Two responses. Browsers get HTML, LLMs get Markdown.
        </p>
      </header>

      {/* Negotiation demo */}
      <section className="animate-in animate-in-delay-1 mt-10 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Browser
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/70">
            Accept: text/html
          </p>
          <p className="mt-2 text-xs text-muted">
            &rarr; renders your Next.js page
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-accent-dim p-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            LLM / AI Agent
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/70">
            Accept: text/markdown
          </p>
          <p className="mt-2 text-xs text-accent/70">
            &rarr; returns your Markdown
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="animate-in animate-in-delay-2 mt-14">
        <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Products
        </h2>
        <ul className="mt-4 space-y-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.id}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/30 hover:bg-surface-hover"
              >
                <span className="text-[15px] font-medium group-hover:text-accent transition-colors">
                  {p.name}
                </span>
                <span className="font-mono text-sm text-muted">
                  ${p.price}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Blog */}
      <section className="animate-in animate-in-delay-3 mt-14">
        <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Blog
        </h2>
        <ul className="mt-4 space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/30 hover:bg-surface-hover"
              >
                <span className="text-[15px] font-medium group-hover:text-accent transition-colors">
                  {post.title}
                </span>
                <span className="font-mono text-xs text-muted">
                  {post.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Terminal */}
      <section className="animate-in animate-in-delay-4 mt-14">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-muted">terminal</span>
          </div>
          <div className="p-4">
            <p className="font-mono text-xs leading-relaxed text-muted">
              <span className="text-accent">$</span>{" "}
              <span className="text-foreground/80">
                curl -H &quot;Accept: text/markdown&quot;
              </span>{" "}
              <span className="text-foreground/50">
                http://localhost:3000/products/1
              </span>
            </p>
            <div className="mt-3 border-t border-border/50 pt-3">
              <p className="font-mono text-xs leading-loose text-foreground/60">
                <span className="text-accent/80"># Wireless Headphones</span>
                <br />
                <br />
                <span className="text-foreground/40">**Price:** $79.99</span>
                <br />
                <br />
                <span className="text-foreground/40">
                  Noise-cancelling over-ear headphones with 30h battery life.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="animate-in animate-in-delay-4 mt-14 border-t border-border pt-6">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">npm</span> install next-md-negotiate
        </p>
      </footer>
    </main>
  );
}
