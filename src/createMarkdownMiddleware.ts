import { createRewriteHandler } from './createRewriteHandler.js';
import type { NegotiateOptions } from './negotiateRequest.js';

/**
 * Creates a middleware handler for Next.js 14-15 `middleware.ts`.
 *
 * Returns a rewrite response for markdown requests matching configured
 * routes, or `undefined` to pass through.
 *
 * @example
 * // middleware.ts
 * import { createMarkdownMiddleware } from 'next-md-negotiate';
 *
 * const markdownMiddleware = createMarkdownMiddleware({
 *   routes: ['/products/[productId]', '/blog/[slug]'],
 * });
 *
 * export function middleware(request: Request) {
 *   return markdownMiddleware(request);
 * }
 */
export function createMarkdownMiddleware(options: NegotiateOptions) {
  return createRewriteHandler(options);
}
