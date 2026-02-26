/**
 * Extracts parameter names from a Next.js-style route pattern.
 *
 * '/products/[productId]'        → { productId: string }
 * '/blog/[slug]'                 → { slug: string }
 * '/docs/[section]/[page]'       → { section: string; page: string }
 * '/docs/[...slug]'              → { slug: string }
 */
export type ExtractParams<T extends string> =
  T extends `${string}[...${infer Param}]${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${string}[${infer Param}]${infer Rest}`
      ? { [K in Param]: string } & ExtractParams<Rest>
      : {};

export interface MdVersionHandler {
  pattern: string;
  handler: (params: Record<string, string>) => Promise<string>;
}
