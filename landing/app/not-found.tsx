import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-center px-5 py-16">
      <div className="w-full border-y border-line py-12 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-12 sm:py-16">
        <p className="font-mono text-sm text-accent" aria-label="HTTP status 404">
          HTTP/1.1 404
          <span className="mt-2 block text-fg-3">route_not_found</span>
        </p>

        <div className="mt-10 max-w-xl sm:mt-0">
          <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            This route has no representation.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fg-2">
            Check the URL, browse the documentation index, or use the sitemap to
            find the resource you meant to request.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Browse documentation
            </Link>
            <Link
              href="/sitemap.xml"
              className="rounded-lg border border-line bg-surface-1 px-4 py-2.5 text-sm font-medium text-fg-2 transition-colors hover:border-line-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Open sitemap
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
