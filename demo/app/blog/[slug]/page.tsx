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
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
        &larr; Back
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">{post.date}</p>
      <p className="mt-6 leading-7 text-zinc-700 dark:text-zinc-300">
        {post.content}
      </p>
    </main>
  );
}
