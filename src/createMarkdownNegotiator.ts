import { negotiateRequest, type NegotiateOptions } from './negotiateRequest.js';
import { validatePattern } from './validatePattern.js';

/**
 * Creates a handler that negotiates markdown content.
 *
 * Use this in `middleware.ts` (Next.js 14–15) or `proxy.ts` (Next.js 16+).
 * Returns a rewrite response for markdown requests matching configured
 * routes, or `undefined` to pass through.
 *
 * @example
 * // middleware.ts
 * import { createMarkdownNegotiator } from 'next-md-negotiate';
 *
 * const md = createMarkdownNegotiator({
 *   routes: ['/products/[productId]', '/blog/[slug]'],
 * });
 *
 * export function middleware(request: Request) {
 *   return md(request);
 * }
 */
export function createMarkdownNegotiator(options: NegotiateOptions) {
  for (const route of options.routes) {
    validatePattern(route);
  }

  return (request: Request): Response | undefined => {
    const rewriteUrl = negotiateRequest(request, options);
    if (!rewriteUrl) return undefined;

    return new Response(null, {
      headers: {
        'x-middleware-rewrite': rewriteUrl.toString(),
      },
    });
  };
}
