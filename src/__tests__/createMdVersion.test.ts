import { describe, it, expect } from 'vitest';
import { createMdVersion } from '../createMdVersion.js';

describe('createMdVersion', () => {
  it('returns an object with pattern and handler', () => {
    const handler = async () => '# Hello';
    const result = createMdVersion('/products/[id]', handler);

    expect(result).toHaveProperty('pattern', '/products/[id]');
    expect(result).toHaveProperty('handler');
  });

  it('preserves the pattern exactly', () => {
    const result = createMdVersion('/blog/[...slug]', async () => '# Blog');
    expect(result.pattern).toBe('/blog/[...slug]');
  });

  it('handler is callable and returns the expected string', async () => {
    const result = createMdVersion(
      '/products/[id]',
      async ({ id }) => `# Product ${id}`
    );

    const output = await result.handler({ id: '42' });
    expect(output).toBe('# Product 42');
  });

  it('works with multiple params', async () => {
    const result = createMdVersion(
      '/[org]/[repo]',
      async ({ org, repo }) => `# ${org}/${repo}`
    );

    const output = await result.handler({ org: 'vercel', repo: 'next' });
    expect(output).toBe('# vercel/next');
  });
});
