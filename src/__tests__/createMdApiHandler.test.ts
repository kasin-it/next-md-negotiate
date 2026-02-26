import { describe, it, expect, vi } from 'vitest';
import { createMdApiHandler } from '../createMdApiHandler.js';
import type { MdVersionHandler } from '../types.js';

function makeReq(path: string | string[]) {
  return { query: { path: Array.isArray(path) ? path : [path] } };
}

function makeRes() {
  const res = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: '',
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    setHeader(name: string, value: string) {
      res.headers[name] = value;
      return res;
    },
    end(body?: string) {
      res.body = body ?? '';
    },
  };
  return res;
}

function makeRegistry(...entries: [string, (p: any) => Promise<string>][]): MdVersionHandler[] {
  return entries.map(([pattern, handler]) => ({ pattern, handler }));
}

describe('createMdApiHandler', () => {
  describe('successful match', () => {
    it('returns 200 with markdown body', async () => {
      const registry = makeRegistry([
        '/products/[id]',
        async ({ id }) => `# Product ${id}`,
      ]);
      const handler = createMdApiHandler(registry);
      const req = makeReq(['products', 'abc']);
      const res = makeRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('# Product abc');
    });

    it('sets Content-Type header', async () => {
      const registry = makeRegistry(['/test', async () => '# Test']);
      const handler = createMdApiHandler(registry);
      const req = makeReq(['test']);
      const res = makeRes();

      await handler(req, res);

      expect(res.headers['Content-Type']).toBe('text/markdown; charset=utf-8');
    });
  });

  describe('no match', () => {
    it('returns 404', async () => {
      const registry = makeRegistry(['/products/[id]', async () => '# Product']);
      const handler = createMdApiHandler(registry);
      const req = makeReq(['unknown']);
      const res = makeRes();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toBe('Not Found');
    });

    it('returns 404 for empty registry', async () => {
      const handler = createMdApiHandler([]);
      const req = makeReq(['anything']);
      const res = makeRes();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('path handling', () => {
    it('handles catch-all paths', async () => {
      const registry = makeRegistry([
        '/docs/[...slug]',
        async ({ slug }) => `# ${slug}`,
      ]);
      const handler = createMdApiHandler(registry);
      const req = makeReq(['docs', 'a', 'b', 'c']);
      const res = makeRes();

      await handler(req, res);

      expect(res.body).toBe('# a/b/c');
    });

    it('handles string path param (non-array)', async () => {
      const registry = makeRegistry(['/items/[id]', async ({ id }) => `# ${id}`]);
      const handler = createMdApiHandler(registry);
      const req = { query: { path: 'items' } };
      const res = makeRes();

      await handler(req, res);
      // '/items' doesn't match '/items/[id]', so 404
      expect(res.statusCode).toBe(404);
    });

    it('handles undefined path param', async () => {
      const registry = makeRegistry(['/', async () => '# Home']);
      const handler = createMdApiHandler(registry);
      const req = { query: {} };
      const res = makeRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('# Home');
    });
  });

  describe('error handling', () => {
    it('returns 500 when handler throws', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const registry = makeRegistry([
        '/fail/[id]',
        async () => { throw new Error('db error'); },
      ]);
      const handler = createMdApiHandler(registry);
      const req = makeReq(['fail', 'x']);
      const res = makeRes();

      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toBe('Internal Server Error');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
