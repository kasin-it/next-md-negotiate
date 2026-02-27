import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllBlogPosts } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
        back
      </Link>

      <article className="mt-10 animate-in">
        <h1 className="font-mono text-2xl font-medium tracking-tight">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-muted">
          {post.date}
        </p>
        <p className="mt-8 text-[15px] leading-relaxed text-muted">
          {post.content}
        </p>
      </article>

      <div className="mt-10 animate-in animate-in-delay-1 rounded-lg border border-border bg-surface p-4">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span>{" "}
          curl -H &quot;Accept: text/markdown&quot; /blog/{slug}
        </p>
      </div>
    </main>
  );
}
