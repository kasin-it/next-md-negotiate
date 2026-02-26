import Link from "next/link";
import { getAllProducts, getAllBlogPosts } from "@/lib/data";

export default async function Home() {
  const products = await getAllProducts();
  const posts = await getAllBlogPosts();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        next-md-negotiate demo
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Same URL serves HTML to browsers and Markdown to LLMs.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Products</h2>
        <ul className="mt-3 space-y-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.id}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {p.name}
              </Link>
              <span className="ml-2 text-sm text-zinc-500">${p.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Blog</h2>
        <ul className="mt-3 space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {post.title}
              </Link>
              <span className="ml-2 text-sm text-zinc-500">{post.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">Try it</h2>
        <code className="mt-1 block text-xs text-zinc-600 dark:text-zinc-400">
          curl -H &quot;Accept: text/markdown&quot; http://localhost:3000/products/1
        </code>
      </section>
    </main>
  );
}
