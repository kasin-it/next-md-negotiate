import type { ExtractParams, MdVersionHandler } from './types.js';
import { validatePattern } from './validatePattern.js';

/**
 * Defines a markdown version for a route.
 *
 * @example
 * createMdVersion('/products/[productId]', async ({ productId }) => {
 *   const product = await getProduct(productId);
 *   return `# ${product.name}\n\n${product.description}`;
 * });
 */
export function createMdVersion<T extends string>(
  pattern: T,
  handler: (params: ExtractParams<T>) => Promise<string>
): MdVersionHandler {
  validatePattern(pattern);
  return { pattern, handler: handler as (params: Record<string, string>) => Promise<string> };
}
