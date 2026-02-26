import { describe, it, expect } from 'vitest';
import { createMarkdownNegotiator } from '../createMarkdownNegotiator.js';

function makeRequest(path: string, accept: string) {
  return new Request(`http://localhost${path}`, {
    headers: { accept },
  });
}

describe('createMarkdownNegotiator', () => {
  const options = {
    routes: ['/products/[productId]', '/blog/[slug]'],
  };

  describe('markdown requests on matching routes', () => {
    it('returns rewrite response for text/markdown', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(makeRequest('/products/abc', 'text/markdown'));

      expect(res).not.toBeUndefined();
      expect(res!.headers.get('x-middleware-rewrite')).toBe(
        'http://localhost/md-api/products/abc'
      );
    });

    it('returns rewrite response for application/markdown', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(makeRequest('/blog/hello', 'application/markdown'));

      expect(res).not.toBeUndefined();
      expect(res!.headers.get('x-middleware-rewrite')).toBe(
        'http://localhost/md-api/blog/hello'
      );
    });

    it('returns rewrite response for text/x-markdown', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(makeRequest('/products/x', 'text/x-markdown'));

      expect(res).not.toBeUndefined();
    });

    it('returns rewrite when markdown is among multiple accept types', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(
        makeRequest('/products/x', 'text/html, text/markdown')
      );

      expect(res).not.toBeUndefined();
    });
  });

  describe('pass-through cases', () => {
    it('returns undefined for text/html accept', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(makeRequest('/products/abc', 'text/html'));

      expect(res).toBeUndefined();
    });

    it('returns undefined for non-matching route', () => {
      const handler = createMarkdownNegotiator(options);
      const res = handler(makeRequest('/unknown/path', 'text/markdown'));

      expect(res).toBeUndefined();
    });

    it('returns undefined when no accept header', () => {
      const handler = createMarkdownNegotiator(options);
      const req = new Request('http://localhost/products/abc');
      const res = handler(req);

      expect(res).toBeUndefined();
    });
  });

  describe('custom prefix', () => {
    it('uses custom internal prefix', () => {
      const handler = createMarkdownNegotiator({
        routes: ['/products/[id]'],
        internalPrefix: '/_markdown',
      });
      const res = handler(makeRequest('/products/abc', 'text/markdown'));

      expect(res!.headers.get('x-middleware-rewrite')).toBe(
        'http://localhost/_markdown/products/abc'
      );
    });
  });
});
