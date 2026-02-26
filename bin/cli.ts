import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APP_ROUTE_HANDLER = `import { createMdHandler } from 'next-md-negotiate';
import registry from '@/md.config';

export const GET = createMdHandler(registry);
`;

const PAGES_API_HANDLER = `import { createMdApiHandler } from 'next-md-negotiate';
import registry from '@/md.config';

export default createMdApiHandler(registry);
`;

const MD_CONFIG = `import { createMdVersion } from 'next-md-negotiate';

export default [
  // createMdVersion('/products/[productId]', async ({ productId }) => {
  //   return \`# Product \${productId}\`;
  // }),
];
`;

function main() {
  const command = process.argv[2];

  if (command !== 'init') {
    console.log('Usage: next-md-negotiate init');
    process.exit(1);
  }

  const cwd = process.cwd();

  // Verify this looks like a Next.js project
  const pkgPath = join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (!deps['next']) {
        console.error('Error: "next" is not listed in package.json dependencies. Is this a Next.js project?');
        process.exit(1);
      }
    } catch {
      // If package.json can't be parsed, continue with directory-based detection
    }
  }

  // Detect project structure
  const useSrc = existsSync(join(cwd, 'src', 'app')) || existsSync(join(cwd, 'src', 'pages'));
  const hasAppDir = existsSync(join(cwd, useSrc ? 'src' : '', 'app'));
  const hasPagesDir = existsSync(join(cwd, useSrc ? 'src' : '', 'pages'));

  if (!hasAppDir && !hasPagesDir) {
    console.error(
      'Error: Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.'
    );
    process.exit(1);
  }

  const configDir = useSrc ? join(cwd, 'src') : cwd;

  try {
    if (hasAppDir) {
      // App Router: create app/md-api/[...path]/route.ts
      const appDir = join(cwd, useSrc ? 'src' : '', 'app');
      const routeDir = join(appDir, 'md-api', '[...path]');
      const routePath = join(routeDir, 'route.ts');

      if (existsSync(routePath)) {
        console.log('  Skipped app/md-api/[...path]/route.ts (already exists)');
      } else {
        mkdirSync(routeDir, { recursive: true });
        writeFileSync(routePath, APP_ROUTE_HANDLER);
        console.log('  Created app/md-api/[...path]/route.ts');
      }
    } else {
      // Pages Router: create pages/api/md-api/[...path].ts
      const pagesDir = join(cwd, useSrc ? 'src' : '', 'pages');
      const apiDir = join(pagesDir, 'api', 'md-api');
      const routePath = join(apiDir, '[...path].ts');

      if (existsSync(routePath)) {
        console.log('  Skipped pages/api/md-api/[...path].ts (already exists)');
      } else {
        mkdirSync(apiDir, { recursive: true });
        writeFileSync(routePath, PAGES_API_HANDLER);
        console.log('  Created pages/api/md-api/[...path].ts');
      }
    }

    // Create md.config.ts
    const configPath = join(configDir, 'md.config.ts');

    if (existsSync(configPath)) {
      console.log('  Skipped md.config.ts (already exists)');
    } else {
      writeFileSync(configPath, MD_CONFIG);
      console.log('  Created md.config.ts');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: Failed to write files — ${message}`);
    process.exit(1);
  }

  // Detect Next.js major version for strategy guidance
  let nextMajor: number | null = null;
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const nextVersion = deps['next'];
      if (nextVersion) {
        const match = nextVersion.match(/(\d+)/);
        if (match) nextMajor = parseInt(match[1], 10);
      }
    } catch {
      // Ignore parse errors
    }
  }

  console.log('\nNext step — add content negotiation:\n');

  if (nextMajor !== null && nextMajor >= 16) {
    console.log(`  Your project uses Next.js ${nextMajor}, so add a proxy.ts in your project root:\n`);
    console.log('  // proxy.ts');
    console.log("  import { createMarkdownProxy } from 'next-md-negotiate';");
    console.log('');
    console.log('  const md = createMarkdownProxy({');
    console.log("    routes: ['/products/[productId]', '/blog/[slug]'],");
    console.log('  });');
    console.log('');
    console.log('  export function proxy(request: Request) {');
    console.log('    return md(request);');
    console.log('  }');
  } else if (nextMajor !== null && nextMajor >= 14 && hasAppDir) {
    console.log(`  Your project uses Next.js ${nextMajor} with App Router, so add a middleware.ts in your project root:\n`);
    console.log('  // middleware.ts');
    console.log("  import { createMarkdownMiddleware } from 'next-md-negotiate';");
    console.log('');
    console.log('  const md = createMarkdownMiddleware({');
    console.log("    routes: ['/products/[productId]', '/blog/[slug]'],");
    console.log('  });');
    console.log('');
    console.log('  export function middleware(request: Request) {');
    console.log('    return md(request);');
    console.log('  }');
  } else if (nextMajor !== null && hasPagesDir && !hasAppDir) {
    console.log(`  Your project uses Next.js ${nextMajor} with Pages Router, so add rewrites to next.config.js:\n`);
    console.log('  // next.config.js');
    console.log("  import { createMarkdownRewrites } from 'next-md-negotiate';");
    console.log('');
    console.log('  export default {');
    console.log('    async rewrites() {');
    console.log('      return {');
    console.log('        beforeFiles: createMarkdownRewrites({');
    console.log("          routes: ['/products/[productId]', '/blog/[slug]'],");
    console.log('        }),');
    console.log('      };');
    console.log('    },');
    console.log('  };');
  } else {
    // Version unknown or ambiguous — show all options
    console.log('  Choose the integration method that fits your setup:\n');
    console.log('  Next.js 16+        → proxy.ts       with createMarkdownProxy');
    console.log('  Next.js 14-15 (App Router) → middleware.ts  with createMarkdownMiddleware');
    console.log('  Pages Router       → next.config.js with createMarkdownRewrites');
  }

  console.log('\n  Then define your routes in md.config.ts');
}

main();
