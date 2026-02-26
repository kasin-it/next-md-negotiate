import { describe, it, expect } from 'vitest';
import { matchPath } from '../matchPath.js';

describe('matchPath', () => {
  describe('single param', () => {
    it('matches a named param', () => {
      expect(matchPath('/products/[productId]', '/products/abc')).toEqual({
        productId: 'abc',
      });
    });

    it('matches numeric values', () => {
      expect(matchPath('/products/[id]', '/products/123')).toEqual({
        id: '123',
      });
    });

    it('matches params with underscores in name', () => {
      expect(matchPath('/users/[user_id]', '/users/42')).toEqual({
        user_id: '42',
      });
    });
  });

  describe('multiple params', () => {
    it('matches two params', () => {
      expect(matchPath('/[org]/[repo]', '/vercel/next')).toEqual({
        org: 'vercel',
        repo: 'next',
      });
    });

    it('matches params with static segments between', () => {
      expect(
        matchPath('/api/v1/[resource]/[id]', '/api/v1/users/42')
      ).toEqual({
        resource: 'users',
        id: '42',
      });
    });
  });

  describe('catch-all params', () => {
    it('matches multiple segments', () => {
      expect(matchPath('/docs/[...slug]', '/docs/a/b/c')).toEqual({
        slug: 'a/b/c',
      });
    });

    it('matches a single segment', () => {
      expect(matchPath('/docs/[...slug]', '/docs/x')).toEqual({
        slug: 'x',
      });
    });

    it('matches deeply nested paths', () => {
      expect(matchPath('/docs/[...slug]', '/docs/a/b/c/d/e')).toEqual({
        slug: 'a/b/c/d/e',
      });
    });

    it('does not match empty catch-all', () => {
      expect(matchPath('/docs/[...slug]', '/docs')).toBeNull();
    });

    it('does not match with trailing slash only', () => {
      expect(matchPath('/docs/[...slug]', '/docs/')).toBeNull();
    });
  });

  describe('static routes (no params)', () => {
    it('matches exact static path', () => {
      const result = matchPath('/about', '/about');
      expect(result).not.toBeNull();
    });

    it('matches root path', () => {
      const result = matchPath('/', '/');
      expect(result).not.toBeNull();
    });
  });

  describe('no-match cases', () => {
    it('returns null for wrong prefix', () => {
      expect(matchPath('/products/[id]', '/blog/abc')).toBeNull();
    });

    it('returns null for extra segments', () => {
      expect(matchPath('/products/[id]', '/products/abc/extra')).toBeNull();
    });

    it('returns null for missing segments', () => {
      expect(matchPath('/products/[id]', '/products')).toBeNull();
    });

    it('returns null for empty path against parameterized route', () => {
      expect(matchPath('/products/[id]', '/')).toBeNull();
    });

    it('returns null for trailing slash mismatch', () => {
      expect(matchPath('/products/[id]', '/products/abc/')).toBeNull();
    });

    it('returns null for completely different paths', () => {
      expect(matchPath('/api/users', '/api/posts')).toBeNull();
    });
  });

  describe('regex special characters in paths', () => {
    it('matches path values containing dots', () => {
      expect(matchPath('/files/[name]', '/files/image.png')).toEqual({
        name: 'image.png',
      });
    });

    it('matches path values containing plus signs', () => {
      expect(matchPath('/search/[query]', '/search/a+b')).toEqual({
        query: 'a+b',
      });
    });

    it('handles dots in static segments correctly', () => {
      expect(matchPath('/api/v1.0/[id]', '/api/v1.0/abc')).toEqual({
        id: 'abc',
      });
    });

    it('dot in static segment does not match as wildcard', () => {
      expect(matchPath('/api/v1.0/[id]', '/api/v1X0/abc')).toBeNull();
    });

    it('handles parentheses in static segments', () => {
      expect(matchPath('/docs/(group)/[id]', '/docs/(group)/abc')).toEqual({
        id: 'abc',
      });
    });
  });
});
