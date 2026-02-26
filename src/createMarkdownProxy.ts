import { createRewriteHandler } from './createRewriteHandler.js';
import type { NegotiateOptions } from './negotiateRequest.js';

/**
 * Creates a proxy handler for Next.js 16+ `proxy.ts`.
 *
 * Returns a rewrite response for markdown requests matching
 * configured routes, or `undefined` to pass through.
 *
 * @example
 * // proxy.ts
 * import { createMarkdownProxy } from 'next-md-negotiate';
 *
 * const markdownProxy = createMarkdownProxy({
 *   routes: ['/products/[productId]', '/blog/[slug]'],
 * });
 *
 * export function proxy(request: Request) {
 *   return markdownProxy(request);
 * }
 */
export function createMarkdownProxy(options: NegotiateOptions) {
  return createRewriteHandler(options);
}
