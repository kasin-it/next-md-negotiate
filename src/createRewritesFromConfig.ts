import type { MdVersionHandler } from './types.js';
import { createMarkdownRewrites } from './createMarkdownRewrites.js';

/**
 * Generates Next.js rewrite rules directly from your `mdConfig` array,
 * eliminating the need to duplicate route patterns.
 *
 * @example
 * // next.config.ts
 * import { createRewritesFromConfig } from 'next-md-negotiate';
 * import { mdConfig } from './md.config';
 *
 * export default {
 *   async rewrites() {
 *     return { beforeFiles: createRewritesFromConfig(mdConfig) };
 *   },
 * };
 */
export function createRewritesFromConfig(
  handlers: MdVersionHandler[],
  options?: { internalPrefix?: string },
) {
  return createMarkdownRewrites({
    routes: handlers.map((h) => h.pattern),
    internalPrefix: options?.internalPrefix,
  });
}
