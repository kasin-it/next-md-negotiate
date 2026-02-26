import { describe, it, expect } from 'vitest';
import { createRewritesFromConfig } from '../createRewritesFromConfig.js';
import type { MdVersionHandler } from '../types.js';

const handler = async () => '# test';

function fakeHandler(pattern: string): MdVersionHandler {
  return { pattern, handler };
}

describe('createRewritesFromConfig', () => {
  it('produces correct rewrites from MdVersionHandler[]', () => {
    const config = [
      fakeHandler('/products/[productId]'),
      fakeHandler('/blog/[slug]'),
    ];

    const rewrites = createRewritesFromConfig(config);

    expect(rewrites).toHaveLength(2);
    expect(rewrites[0].source).toBe('/products/:productId');
    expect(rewrites[0].destination).toBe('/md-api/products/:productId');
    expect(rewrites[1].source).toBe('/blog/:slug');
    expect(rewrites[1].destination).toBe('/md-api/blog/:slug');
  });

  it('supports custom internalPrefix', () => {
    const config = [fakeHandler('/test')];

    const rewrites = createRewritesFromConfig(config, {
      internalPrefix: '/_markdown',
    });

    expect(rewrites[0].destination).toBe('/_markdown/test');
  });

  it('returns empty array for empty config', () => {
    const rewrites = createRewritesFromConfig([]);
    expect(rewrites).toEqual([]);
  });
});
