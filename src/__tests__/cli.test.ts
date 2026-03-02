import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const CLI_PATH = join(import.meta.dirname, '..', '..', 'dist', 'cli.js');

let tmpDir: string;

function run(cwd: string) {
  return execSync(`node ${CLI_PATH} init`, { cwd, encoding: 'utf-8', stdio: 'pipe' });
}

function runWithArgs(cwd: string, args: string) {
  try {
    return execSync(`node ${CLI_PATH} ${args}`, { cwd, encoding: 'utf-8', stdio: 'pipe' });
  } catch (e: any) {
    return e.stdout + e.stderr;
  }
}

beforeEach(() => {
  tmpDir = join(tmpdir(), `next-md-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('CLI init', () => {
  describe('App Router (app/ directory)', () => {
    it('creates route handler and config', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      run(tmpDir);

      const routePath = join(tmpDir, 'app', 'md-api', '[...path]', 'route.ts');
      const configPath = join(tmpDir, 'md.config.ts');

      expect(existsSync(routePath)).toBe(true);
      expect(existsSync(configPath)).toBe(true);

      const routeContent = readFileSync(routePath, 'utf-8');
      expect(routeContent).toContain('createMdHandler');
      expect(routeContent).toContain("from 'next-md-negotiate'");

      const configContent = readFileSync(configPath, 'utf-8');
      expect(configContent).toContain('createMdVersion');
    });
  });

  describe('App Router with src/ directory', () => {
    it('creates files in src/', () => {
      mkdirSync(join(tmpDir, 'src', 'app'), { recursive: true });
      run(tmpDir);

      expect(existsSync(join(tmpDir, 'src', 'app', 'md-api', '[...path]', 'route.ts'))).toBe(true);
      expect(existsSync(join(tmpDir, 'src', 'md.config.ts'))).toBe(true);
    });
  });

  describe('Pages Router (pages/ directory)', () => {
    it('creates API route handler and config', () => {
      mkdirSync(join(tmpDir, 'pages'), { recursive: true });
      run(tmpDir);

      const routePath = join(tmpDir, 'pages', 'api', 'md-api', '[...path].ts');
      const configPath = join(tmpDir, 'md.config.ts');

      expect(existsSync(routePath)).toBe(true);
      expect(existsSync(configPath)).toBe(true);

      const routeContent = readFileSync(routePath, 'utf-8');
      expect(routeContent).toContain('createMdApiHandler');
    });
  });

  describe('Pages Router with src/ directory', () => {
    it('creates files in src/', () => {
      mkdirSync(join(tmpDir, 'src', 'pages'), { recursive: true });
      run(tmpDir);

      expect(existsSync(join(tmpDir, 'src', 'pages', 'api', 'md-api', '[...path].ts'))).toBe(true);
      expect(existsSync(join(tmpDir, 'src', 'md.config.ts'))).toBe(true);
    });
  });

  describe('idempotency', () => {
    it('does not overwrite existing route handler', () => {
      mkdirSync(join(tmpDir, 'app', 'md-api', '[...path]'), { recursive: true });
      const routePath = join(tmpDir, 'app', 'md-api', '[...path]', 'route.ts');
      writeFileSync(routePath, 'custom content');

      const output = run(tmpDir);

      expect(readFileSync(routePath, 'utf-8')).toBe('custom content');
      expect(output).toContain('Skipped');
    });

    it('does not overwrite existing md.config.ts', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      const configPath = join(tmpDir, 'md.config.ts');
      writeFileSync(configPath, 'custom config');

      const output = run(tmpDir);

      expect(readFileSync(configPath, 'utf-8')).toBe('custom config');
      expect(output).toContain('Skipped');
    });
  });

  describe('error cases', () => {
    it('errors when no app/ or pages/ directory found', () => {
      const output = runWithArgs(tmpDir, 'init');
      expect(output).toContain('Error');
    });

    it('shows usage for invalid command', () => {
      const output = runWithArgs(tmpDir, 'invalid');
      expect(output).toContain('Usage');
      expect(output).toContain('add-hints');
      expect(output).toContain('remove-hints');
    });
  });

  describe('prefers App Router when both exist', () => {
    it('creates App Router handler when both app/ and pages/ exist', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      mkdirSync(join(tmpDir, 'pages'), { recursive: true });
      run(tmpDir);

      expect(existsSync(join(tmpDir, 'app', 'md-api', '[...path]', 'route.ts'))).toBe(true);
      expect(existsSync(join(tmpDir, 'pages', 'api', 'md-api', '[...path].ts'))).toBe(false);
    });
  });

  describe('--rewrites flag', () => {
    it('creates next.config.ts when none exists', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      const output = runWithArgs(tmpDir, 'init --rewrites');

      const configPath = join(tmpDir, 'next.config.ts');
      expect(existsSync(configPath)).toBe(true);

      const content = readFileSync(configPath, 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Created next.config.ts');
    });

    it('injects into existing export default config', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(join(tmpDir, 'next.config.ts'), 'export default {\n};\n');

      const output = runWithArgs(tmpDir, 'init --rewrites');

      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.ts');
    });

    it('skips when createRewritesFromConfig already present', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        "import { createRewritesFromConfig } from 'next-md-negotiate';\nexport default {};\n"
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      expect(output).toContain('already has rewrite configuration');
    });

    it('injects beforeFiles into existing object return', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `export default {\n  async rewrites() {\n    return {\n      afterFiles: [],\n    };\n  },\n};\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('afterFiles');
      expect(content).toContain('beforeFiles');
      expect(output).toContain('Updated next.config.ts');
    });

    it('injects into typed variable with separate export default', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `import type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = {\n};\n\nexport default nextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.ts');
    });

    it('injects into untyped variable with separate export default', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `const nextConfig = {\n};\n\nexport default nextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.ts');
    });

    it('injects into JSDoc-typed variable with module.exports', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.js'),
        `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n};\n\nmodule.exports = nextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.js'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.js');
    });

    it('injects into module.exports = { ... }', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.js'),
        `module.exports = {\n};\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.js'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.js');
    });

    it('injects into export default { ... } satisfies NextConfig', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `import type { NextConfig } from 'next';\n\nexport default {\n} satisfies NextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.ts');
    });

    it('injects into next.config.mjs', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.mjs'),
        `const nextConfig = {\n};\n\nexport default nextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.mjs'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('async rewrites()');
      expect(output).toContain('Updated next.config.mjs');
    });

    it('injects into typed variable with existing rewrites (object return)', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `import type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = {\n  async rewrites() {\n    return {\n      afterFiles: [],\n    };\n  },\n};\n\nexport default nextConfig;\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('createRewritesFromConfig');
      expect(content).toContain('beforeFiles');
      expect(content).toContain('afterFiles');
      expect(output).toContain('Updated next.config.ts');
    });

    it('wraps existing array return with beforeFiles + afterFiles', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      writeFileSync(
        join(tmpDir, 'next.config.ts'),
        `export default {\n  async rewrites() {\n    return [\n      { source: '/x', destination: '/y' },\n    ];\n  },\n};\n`
      );

      const output = runWithArgs(tmpDir, 'init --rewrites');
      const content = readFileSync(join(tmpDir, 'next.config.ts'), 'utf-8');
      expect(content).toContain('beforeFiles');
      expect(content).toContain('afterFiles');
      expect(content).toContain("source: '/x'");
      expect(output).toContain('Updated next.config.ts');
    });
  });

  describe('--add-hints flag', () => {
    it('injects LlmHint when config has entries', () => {
      mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
      writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
      writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);

      const output = runWithArgs(tmpDir, 'init --rewrites --add-hints');
      const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

      expect(content).toContain('LlmHint');
      expect(output).toContain('Injected LlmHint');
    });

    it('handles fresh config with no entries gracefully', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      const output = runWithArgs(tmpDir, 'init --rewrites --add-hints');

      expect(output).toContain('Created md.config.ts');
      expect(output).not.toContain('Injected LlmHint');
    });
  });

  describe('--middleware flag', () => {
    it('prints createNegotiatorFromConfig instructions', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      const output = runWithArgs(tmpDir, 'init --middleware');

      expect(output).toContain('createNegotiatorFromConfig');
      expect(output).toContain('mdConfig');
      expect(output).toContain('middleware');
      expect(output).not.toContain('createRewritesFromConfig');
    });
  });

  describe('no flags (non-TTY)', () => {
    it('prints both rewrites and middleware instructions', () => {
      mkdirSync(join(tmpDir, 'app'), { recursive: true });
      const output = run(tmpDir);

      expect(output).toContain('next.config');
      expect(output).toContain('createRewritesFromConfig');
      expect(output).toContain('createNegotiatorFromConfig');
      expect(output).toContain('middleware');
    });
  });
});

describe('CLI add-hints', () => {
  it('injects into App Router page files', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);

    const output = runWithArgs(tmpDir, 'add-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).toContain('LlmHint');
    expect(content).toContain("import { LlmHint } from 'next-md-negotiate'");
    expect(output).toContain('Injected LlmHint');
  });

  it('passes custom hint message from config', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }, { hintText: 'Custom message here' }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);

    runWithArgs(tmpDir, 'add-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).toContain('<LlmHint message="Custom message here" />');
  });

  it('uses defaultHintText when no per-route hintText', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    mkdirSync(join(tmpDir, 'app', 'blog', '[slug]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';

export const defaultHintText = 'Global hint message';

export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
  createMdVersion('/blog/[slug]', async ({ slug }) => {
    return \`# Blog \${slug}\`;
  }, { hintText: 'Per-route override' }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);
    writeFileSync(join(tmpDir, 'app', 'blog', '[slug]', 'page.tsx'), `export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
`);

    runWithArgs(tmpDir, 'add-hints');

    const productContent = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');
    expect(productContent).toContain('<LlmHint message="Global hint message" />');

    const blogContent = readFileSync(join(tmpDir, 'app', 'blog', '[slug]', 'page.tsx'), 'utf-8');
    expect(blogContent).toContain('<LlmHint message="Per-route override" />');
  });

  it('skips files that already have LlmHint', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `import { LlmHint } from 'next-md-negotiate';
export default function ProductPage() {
  return (
    <>
      <LlmHint />
      <div><h1>Product</h1></div>
    </>
  );
}
`);

    const output = runWithArgs(tmpDir, 'add-hints');
    expect(output).toContain('already has LlmHint');
  });

  it('handles fragment root JSX', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <>
      <h1>Product</h1>
      <p>Description</p>
    </>
  );
}
`);

    runWithArgs(tmpDir, 'add-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).toContain('<LlmHint />');
    // Should not double-wrap in fragments
    expect(content.match(/<>/g)?.length).toBe(1);
  });

  it('handles src/ directory', () => {
    mkdirSync(join(tmpDir, 'src', 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'src', 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'src', 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);

    const output = runWithArgs(tmpDir, 'add-hints');
    const content = readFileSync(join(tmpDir, 'src', 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).toContain('LlmHint');
    expect(output).toContain('Injected LlmHint');
  });

  it('handles Pages Router file resolution', () => {
    mkdirSync(join(tmpDir, 'pages', 'products'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'pages', 'products', '[productId].tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);

    const output = runWithArgs(tmpDir, 'add-hints');
    const content = readFileSync(join(tmpDir, 'pages', 'products', '[productId].tsx'), 'utf-8');

    expect(content).toContain('LlmHint');
    expect(output).toContain('Injected LlmHint');
  });

  it('warns when page file not found', () => {
    mkdirSync(join(tmpDir, 'app'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/nonexistent', async () => '# Hello'),
];
`);

    const output = runWithArgs(tmpDir, 'add-hints');
    expect(output).toContain('Could not find page file');
  });

  it('errors when md.config.ts not found', () => {
    mkdirSync(join(tmpDir, 'app'), { recursive: true });

    const output = runWithArgs(tmpDir, 'add-hints');
    expect(output).toContain('Could not find md.config');
  });

  it('skips routes with skipHint: true', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    mkdirSync(join(tmpDir, 'app', 'internal'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
  createMdVersion('/internal', async () => {
    return '# Internal';
  }, { skipHint: true }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `export default function ProductPage() {
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
`);
    writeFileSync(join(tmpDir, 'app', 'internal', 'page.tsx'), `export default function InternalPage() {
  return (
    <div>
      <h1>Internal</h1>
    </div>
  );
}
`);

    const output = runWithArgs(tmpDir, 'add-hints');

    // Product page should get the hint
    const productContent = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');
    expect(productContent).toContain('LlmHint');

    // Internal page should be skipped
    const internalContent = readFileSync(join(tmpDir, 'app', 'internal', 'page.tsx'), 'utf-8');
    expect(internalContent).not.toContain('LlmHint');

    expect(output).toContain('skipHint: true');
  });
});

describe('CLI remove-hints', () => {
  it('removes LlmHint tag and standalone import', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `import { LlmHint } from 'next-md-negotiate';

export default function ProductPage() {
  return (
    <>
      <LlmHint />
      <div><h1>Product</h1></div>
    </>
  );
}
`);

    const output = runWithArgs(tmpDir, 'remove-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).not.toContain('LlmHint');
    expect(output).toContain('Removed LlmHint');
  });

  it('removes LlmHint with message prop', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `import { LlmHint } from 'next-md-negotiate';

export default function ProductPage() {
  return (
    <>
      <LlmHint message="Custom hint" />
      <div><h1>Product</h1></div>
    </>
  );
}
`);

    const output = runWithArgs(tmpDir, 'remove-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).not.toContain('LlmHint');
    expect(output).toContain('Removed LlmHint');
  });

  it('removes LlmHint from combined imports', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `import { createMdVersion, LlmHint } from 'next-md-negotiate';

export default function ProductPage() {
  return (
    <>
      <LlmHint />
      <div><h1>Product</h1></div>
    </>
  );
}
`);

    runWithArgs(tmpDir, 'remove-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    expect(content).not.toContain('LlmHint');
    expect(content).toContain('createMdVersion');
    expect(content).toContain("from 'next-md-negotiate'");
  });

  it('leaves fragments in place', () => {
    mkdirSync(join(tmpDir, 'app', 'products', '[productId]'), { recursive: true });
    writeFileSync(join(tmpDir, 'md.config.ts'), `import { createMdVersion } from 'next-md-negotiate';
export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    return \`# Product \${productId}\`;
  }),
];
`);
    writeFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), `import { LlmHint } from 'next-md-negotiate';

export default function ProductPage() {
  return (
    <>
      <LlmHint />
      <div><h1>Product</h1></div>
    </>
  );
}
`);

    runWithArgs(tmpDir, 'remove-hints');
    const content = readFileSync(join(tmpDir, 'app', 'products', '[productId]', 'page.tsx'), 'utf-8');

    // Fragments should remain (harmless)
    expect(content).toContain('<>');
    expect(content).toContain('</>');
  });
});
