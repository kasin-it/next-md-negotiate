import type { ExtractParams, MdVersionHandler } from './types.js';
import { validatePattern } from './validatePattern.js';

export interface MdVersionOptions {
  hintText?: string;
  skipHint?: boolean;
}

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
  handler: (params: ExtractParams<T>) => Promise<string>,
  options?: MdVersionOptions,
): MdVersionHandler {
  validatePattern(pattern);
  return {
    pattern,
    handler: handler as (params: Record<string, string>) => Promise<string>,
    hintText: options?.hintText,
    skipHint: options?.skipHint,
  };
}
