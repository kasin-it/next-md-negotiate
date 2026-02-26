import { negotiateRequest, type NegotiateOptions } from './negotiateRequest.js';
import { validatePattern } from './validatePattern.js';

/**
 * Shared implementation for proxy and middleware handlers.
 *
 * Returns a rewrite response for markdown requests matching configured
 * routes, or `undefined` to pass through.
 */
export function createRewriteHandler(options: NegotiateOptions) {
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
