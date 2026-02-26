const VALID_PATTERN = /^(\/([a-zA-Z0-9_-]+|\[(\.\.\.)?[a-zA-Z_]+\]))+$|^\/$/;

/**
 * Validates a Next.js-style route pattern.
 * Throws if the pattern is malformed.
 *
 * Valid examples:  `/products/[productId]`, `/docs/[...slug]`, `/about`
 * Invalid:         `products/[id`, `//foo`, `/[`
 */
export function validatePattern(pattern: string): void {
  if (!VALID_PATTERN.test(pattern)) {
    throw new Error(
      `Invalid route pattern: "${pattern}". ` +
        'Patterns must start with / and use [param] or [...param] for dynamic segments.'
    );
  }
}
