import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getAllProducts } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ productId: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
        &larr; Back
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{product.name}</h1>
      <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-400">
        ${product.price}
      </p>
      <p className="mt-6 leading-7 text-zinc-700 dark:text-zinc-300">
        {product.description}
      </p>
    </main>
  );
}
