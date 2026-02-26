import { validatePattern } from './validatePattern.js';

const MARKDOWN_ACCEPT_REGEX =
  '.*(text/markdown|application/markdown|text/x-markdown).*';

export interface MarkdownRewriteOptions {
  routes: string[];
  /** Internal route prefix. Defaults to '/md-api'. */
  internalPrefix?: string;
}

/**
 * Generates Next.js rewrite rules that redirect markdown requests
 * to the catch-all handler.
 *
 * Translates Next.js [param] syntax to :param for rewrite rules.
 *
 * @example
 * // next.config.ts
 * import { createMarkdownRewrites } from 'next-md-negotiate';
 *
 * export default {
 *   async rewrites() {
 *     return {
 *       beforeFiles: createMarkdownRewrites({
 *         routes: ['/products/[productId]', '/blog/[slug]'],
 *       }),
 *     };
 *   },
 * };
 */
export function createMarkdownRewrites(options: MarkdownRewriteOptions) {
  const prefix = options.internalPrefix ?? '/md-api';

  return options.routes.map((source) => {
    validatePattern(source);
    // Convert [param] → :param and [...param] → :param* for Next.js rewrites
    const rewritePath = source
      .replace(/\[\.\.\.([a-zA-Z_]+)\]/g, ':$1*')
      .replace(/\[([a-zA-Z_]+)\]/g, ':$1');

    return {
      source: rewritePath,
      has: [
        {
          type: 'header' as const,
          key: 'accept',
          value: MARKDOWN_ACCEPT_REGEX,
        },
      ],
      destination: `${prefix}${rewritePath}`,
    };
  });
}
