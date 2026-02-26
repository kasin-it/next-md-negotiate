import { describe, it, expect } from 'vitest';
import { createNegotiatorFromConfig } from '../createNegotiatorFromConfig.js';
import type { MdVersionHandler } from '../types.js';

const handler = async () => '# test';

function fakeHandler(pattern: string): MdVersionHandler {
  return { pattern, handler };
}

function makeRequest(path: string, accept: string) {
  return new Request(`http://localhost${path}`, {
    headers: { accept },
  });
}

describe('createNegotiatorFromConfig', () => {
  it('returns rewrite response for matching markdown request', () => {
    const config = [
      fakeHandler('/products/[productId]'),
      fakeHandler('/blog/[slug]'),
    ];

    const negotiate = createNegotiatorFromConfig(config);
    const res = negotiate(makeRequest('/products/abc', 'text/markdown'));

    expect(res).not.toBeUndefined();
    expect(res!.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/md-api/products/abc'
    );
  });

  it('returns rewrite for second route in config', () => {
    const config = [
      fakeHandler('/products/[productId]'),
      fakeHandler('/blog/[slug]'),
    ];

    const negotiate = createNegotiatorFromConfig(config);
    const res = negotiate(makeRequest('/blog/hello', 'text/markdown'));

    expect(res).not.toBeUndefined();
    expect(res!.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/md-api/blog/hello'
    );
  });

  it('returns undefined for non-markdown accept', () => {
    const config = [fakeHandler('/products/[productId]')];

    const negotiate = createNegotiatorFromConfig(config);
    const res = negotiate(makeRequest('/products/abc', 'text/html'));

    expect(res).toBeUndefined();
  });

  it('returns undefined for non-matching route', () => {
    const config = [fakeHandler('/products/[productId]')];

    const negotiate = createNegotiatorFromConfig(config);
    const res = negotiate(makeRequest('/unknown/path', 'text/markdown'));

    expect(res).toBeUndefined();
  });

  it('supports custom internalPrefix', () => {
    const config = [fakeHandler('/test')];

    const negotiate = createNegotiatorFromConfig(config, {
      internalPrefix: '/_markdown',
    });
    const res = negotiate(makeRequest('/test', 'text/markdown'));

    expect(res!.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/_markdown/test'
    );
  });

  it('returns empty negotiator for empty config', () => {
    const negotiate = createNegotiatorFromConfig([]);
    const res = negotiate(makeRequest('/anything', 'text/markdown'));

    expect(res).toBeUndefined();
  });
});
