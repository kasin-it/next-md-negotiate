import type { MdVersionHandler } from './types.js';
import { createMarkdownNegotiator } from './createMarkdownNegotiator.js';

/**
 * Creates a middleware/proxy negotiator directly from your `mdConfig` array,
 * eliminating the need to duplicate route patterns.
 *
 * @example
 * // middleware.ts
 * import { createNegotiatorFromConfig } from 'next-md-negotiate';
 * import { mdConfig } from './md.config';
 *
 * const md = createNegotiatorFromConfig(mdConfig);
 *
 * export function middleware(request: Request) {
 *   const mdResponse = md(request);
 *   if (mdResponse) return mdResponse;
 *   // ...your other middleware logic
 * }
 */
export function createNegotiatorFromConfig(
  handlers: MdVersionHandler[],
  options?: { internalPrefix?: string },
) {
  return createMarkdownNegotiator({
    routes: handlers.map((h) => h.pattern),
    internalPrefix: options?.internalPrefix,
  });
}
