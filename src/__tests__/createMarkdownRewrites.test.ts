import { describe, it, expect } from 'vitest';
import { createMarkdownRewrites } from '../createMarkdownRewrites.js';

describe('createMarkdownRewrites', () => {
  describe('pattern translation', () => {
    it('converts [param] to :param', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/products/[productId]'],
      });

      expect(rewrites[0].source).toBe('/products/:productId');
      expect(rewrites[0].destination).toBe('/md-api/products/:productId');
    });

    it('converts [...param] to :param*', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/docs/[...slug]'],
      });

      expect(rewrites[0].source).toBe('/docs/:slug*');
      expect(rewrites[0].destination).toBe('/md-api/docs/:slug*');
    });

    it('converts multiple params', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/[org]/[repo]'],
      });

      expect(rewrites[0].source).toBe('/:org/:repo');
      expect(rewrites[0].destination).toBe('/md-api/:org/:repo');
    });

    it('leaves static routes unchanged', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/about'],
      });

      expect(rewrites[0].source).toBe('/about');
      expect(rewrites[0].destination).toBe('/md-api/about');
    });
  });

  describe('prefix', () => {
    it('uses /md-api as default prefix', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/test'],
      });

      expect(rewrites[0].destination).toBe('/md-api/test');
    });

    it('uses custom prefix', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/test'],
        internalPrefix: '/_markdown',
      });

      expect(rewrites[0].destination).toBe('/_markdown/test');
    });
  });

  describe('header condition', () => {
    it('includes Accept header check on every rewrite', () => {
      const rewrites = createMarkdownRewrites({
        routes: ['/a', '/b'],
      });

      for (const rewrite of rewrites) {
        expect(rewrite.has).toHaveLength(1);
        expect(rewrite.has[0].type).toBe('header');
        expect(rewrite.has[0].key).toBe('accept');
      }
    });

    it('accept regex matches text/markdown', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('text/markdown')).toBe(true);
    });

    it('accept regex matches application/markdown', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('application/markdown')).toBe(true);
    });

    it('accept regex matches text/x-markdown', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('text/x-markdown')).toBe(true);
    });

    it('accept regex matches when markdown is among multiple types', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('text/html, text/markdown')).toBe(true);
    });

    it('accept regex does not match text/html', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('text/html')).toBe(false);
    });

    it('accept regex does not match application/json', () => {
      const rewrites = createMarkdownRewrites({ routes: ['/a'] });
      const regex = new RegExp(rewrites[0].has[0].value);

      expect(regex.test('application/json')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for empty routes', () => {
      const rewrites = createMarkdownRewrites({ routes: [] });
      expect(rewrites).toEqual([]);
    });

    it('generates correct count for multiple routes', () => {
      const rewrites = createMarkdownRewrites({
        routes: [
          '/a',
          '/b',
          '/c',
        ],
      });
      expect(rewrites).toHaveLength(3);
    });
  });
});
