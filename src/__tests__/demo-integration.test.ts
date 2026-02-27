import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, spawn, type ChildProcess } from 'node:child_process';
import { join } from 'node:path';

const DEMO_DIR = join(import.meta.dirname, '..', '..', 'demo');
const PORT = 3099;
const BASE = `http://localhost:${PORT}`;

let server: ChildProcess;

async function waitForServer(url: string, timeout = 15_000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

beforeAll(async () => {
  execSync('npx next build', { cwd: DEMO_DIR, stdio: 'pipe' });

  server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: DEMO_DIR,
    stdio: 'pipe',
  });

  await waitForServer(BASE);
}, 60_000);

afterAll(() => {
  server?.kill();
});

describe('demo app integration', () => {
  describe('HTML pages work normally for browsers', () => {
    it('serves the home page', async () => {
      const res = await fetch(BASE, {
        headers: { Accept: 'text/html' },
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('next-md-negotiate');
      expect(html).toContain('Wireless Headphones');
      expect(html).toContain('Getting Started');
    });

    it('serves /products/1 as HTML', async () => {
      const res = await fetch(`${BASE}/products/1`, {
        headers: { Accept: 'text/html' },
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('Wireless Headphones');
      expect(html).toContain('79.99');
    });

    it('serves /blog/getting-started as HTML', async () => {
      const res = await fetch(`${BASE}/blog/getting-started`, {
        headers: { Accept: 'text/html' },
      });

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('Getting Started with next-md-negotiate');
      expect(html).toContain('2025-06-01');
    });
  });

  describe('markdown content negotiation via rewrites', () => {
    it('returns markdown for /products/1 when Accept: text/markdown', async () => {
      const res = await fetch(`${BASE}/products/1`, {
        headers: { Accept: 'text/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Wireless Headphones');
      expect(body).toContain('**Price:** $79.99');
      expect(body).toContain('Noise-cancelling');
    });

    it('returns markdown for /blog/why-markdown when Accept: text/markdown', async () => {
      const res = await fetch(`${BASE}/blog/why-markdown`, {
        headers: { Accept: 'text/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Why Serve Markdown to LLMs?');
      expect(body).toContain('*2025-07-15*');
      expect(body).toContain('reduce token usage');
    });

    it('accepts application/markdown', async () => {
      const res = await fetch(`${BASE}/products/2`, {
        headers: { Accept: 'application/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Mechanical Keyboard');
    });

    it('accepts text/markdown among multiple types', async () => {
      const res = await fetch(`${BASE}/products/3`, {
        headers: { Accept: 'text/html, text/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# USB-C Hub');
    });
  });

  describe('same URL, different content based on Accept header', () => {
    it('/products/1 returns HTML for browsers, markdown for LLMs', async () => {
      const [htmlRes, mdRes] = await Promise.all([
        fetch(`${BASE}/products/1`, { headers: { Accept: 'text/html' } }),
        fetch(`${BASE}/products/1`, { headers: { Accept: 'text/markdown' } }),
      ]);

      const html = await htmlRes.text();
      const md = await mdRes.text();

      // HTML response contains markup
      expect(html).toContain('<');
      expect(html).toContain('Wireless Headphones');

      // Markdown response is plain text
      expect(md).not.toContain('<!DOCTYPE');
      expect(md).toContain('# Wireless Headphones');
      expect(md).toContain('**Price:**');
    });
  });

  describe('not-found handling', () => {
    it('returns not-found markdown for unknown product ID', async () => {
      const res = await fetch(`${BASE}/products/999`, {
        headers: { Accept: 'text/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Not Found');
      expect(body).toContain('"999"');
    });

    it('returns not-found markdown for unknown blog slug', async () => {
      const res = await fetch(`${BASE}/blog/nonexistent`, {
        headers: { Accept: 'text/markdown' },
      });

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Not Found');
      expect(body).toContain('"nonexistent"');
    });
  });

  describe('routes not in config are not rewritten', () => {
    it('returns 404 for unregistered route with markdown accept', async () => {
      const res = await fetch(`${BASE}/unknown/path`, {
        headers: { Accept: 'text/markdown' },
      });

      expect(res.status).toBe(404);
    });
  });

  describe('direct md-api route access', () => {
    it('returns markdown when hitting /md-api/products/2 directly', async () => {
      const res = await fetch(`${BASE}/md-api/products/2`);

      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('# Mechanical Keyboard');
    });
  });
});
