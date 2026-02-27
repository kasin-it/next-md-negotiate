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
          {product.name}
        </h1>
        <p className="mt-3 font-mono text-lg text-accent">
          ${product.price}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          {product.description}
        </p>
      </article>

      <div className="mt-10 animate-in animate-in-delay-1 rounded-lg border border-border bg-surface p-4">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span>{" "}
          curl -H &quot;Accept: text/markdown&quot; /products/{productId}
        </p>
      </div>
    </main>
  );
}
