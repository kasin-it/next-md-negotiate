import { describe, it, expect, vi } from 'vitest';
import { createMdHandler } from '../createMdHandler.js';
import type { MdVersionHandler } from '../types.js';

function makeParams(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

function makeRegistry(...entries: [string, (p: any) => Promise<string>][]): MdVersionHandler[] {
  return entries.map(([pattern, handler]) => ({ pattern, handler }));
}

describe('createMdHandler', () => {
  describe('successful match', () => {
    it('returns 200 with markdown body', async () => {
      const registry = makeRegistry([
        '/products/[id]',
        async ({ id }) => `# Product ${id}`,
      ]);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['products', 'abc']));

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('# Product abc');
    });

    it('sets Content-Type to text/markdown', async () => {
      const registry = makeRegistry(['/test', async () => '# Test']);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['test']));

      expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    });
  });

  describe('no match', () => {
    it('returns 404 when no patterns match', async () => {
      const registry = makeRegistry(['/products/[id]', async () => '# Product']);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['unknown']));

      expect(res.status).toBe(404);
    });

    it('returns 404 for empty registry', async () => {
      const handler = createMdHandler([]);
      const res = await handler(new Request('http://localhost'), makeParams(['anything']));

      expect(res.status).toBe(404);
    });
  });

  describe('registry order', () => {
    it('first matching pattern wins', async () => {
      const registry = makeRegistry(
        ['/items/[id]', async () => '# First'],
        ['/items/[id]', async () => '# Second'],
      );
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['items', 'x']));

      expect(await res.text()).toBe('# First');
    });

    it('falls through to second route when first does not match', async () => {
      const registry = makeRegistry(
        ['/products/[id]', async () => '# Product'],
        ['/blog/[slug]', async () => '# Blog'],
      );
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['blog', 'hello']));

      expect(await res.text()).toBe('# Blog');
    });
  });

  describe('path reconstruction', () => {
    it('handles multi-segment paths', async () => {
      const registry = makeRegistry([
        '/docs/[...slug]',
        async ({ slug }) => `# Docs: ${slug}`,
      ]);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['docs', 'a', 'b']));

      expect(await res.text()).toBe('# Docs: a/b');
    });

    it('handles empty path array (root)', async () => {
      const registry = makeRegistry(['/', async () => '# Home']);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams([]));

      expect(await res.text()).toBe('# Home');
    });
  });

  describe('error handling', () => {
    it('returns 500 when handler throws an Error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const registry = makeRegistry([
        '/fail/[id]',
        async () => { throw new Error('db error'); },
      ]);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['fail', 'x']));

      expect(res.status).toBe(500);
      expect(await res.text()).toBe('Internal Server Error');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns 500 when handler throws a string', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const registry = makeRegistry([
        '/fail/[id]',
        async () => { throw 'string error'; },
      ]);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['fail', 'x']));

      expect(res.status).toBe(500);
      consoleSpy.mockRestore();
    });

    it('returns 500 when handler rejects', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const registry = makeRegistry([
        '/fail/[id]',
        () => Promise.reject(new Error('rejected')),
      ]);
      const handler = createMdHandler(registry);
      const res = await handler(new Request('http://localhost'), makeParams(['fail', 'x']));

      expect(res.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });
});
