import { createInterface } from 'node:readline';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APP_ROUTE_HANDLER = `import { createMdHandler } from 'next-md-negotiate';
import { mdConfig } from '@/md.config';

export const GET = createMdHandler(mdConfig);
`;

const PAGES_API_HANDLER = `import { createMdApiHandler } from 'next-md-negotiate';
import { mdConfig } from '@/md.config';

export default createMdApiHandler(mdConfig);
`;

const MD_CONFIG = `import { createMdVersion } from 'next-md-negotiate';

export const mdConfig = [
  // createMdVersion('/products/[productId]', async ({ productId }) => {
  //   return \`# Product \${productId}\`;
  // }),
];
`;

const REWRITES_IMPORT = `import { createMarkdownRewrites } from 'next-md-negotiate';\n`;

const REWRITES_SNIPPET = `  async rewrites() {
    return {
      beforeFiles: createMarkdownRewrites({
        routes: ['/products/[productId]', '/blog/[slug]'],
      }),
    };
  },`;

const NEW_NEXT_CONFIG = `import { createMarkdownRewrites } from 'next-md-negotiate';

export default {
  async rewrites() {
    return {
      beforeFiles: createMarkdownRewrites({
        routes: ['/products/[productId]', '/blog/[slug]'],
      }),
    };
  },
};
`;

function printRewritesSnippet() {
  console.log('\nAdd this to your next.config:\n');
  console.log("  import { createMarkdownRewrites } from 'next-md-negotiate';");
  console.log('');
  console.log('  // inside your config object:');
  console.log('  async rewrites() {');
  console.log('    return {');
  console.log('      beforeFiles: createMarkdownRewrites({');
  console.log("        routes: ['/products/[productId]', '/blog/[slug]'],");
  console.log('      }),');
  console.log('    };');
  console.log('  },');
}

function printMiddlewareInstructions() {
  console.log('\nAdd a middleware or proxy for content negotiation:\n');
  console.log('  // middleware.ts (or proxy.ts)');
  console.log("  import { createMarkdownNegotiator } from 'next-md-negotiate';");
  console.log('');
  console.log('  export const middleware = createMarkdownNegotiator({');
  console.log("    routes: ['/products/[productId]', '/blog/[slug]'],");
  console.log('  });');
  console.log('');
  console.log('  Then define your routes in md.config.ts');
}

function printGenericInstructions() {
  console.log('\nNext step — add rewrites to next.config:\n');
  console.log('  // next.config.ts');
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
  console.log('');
  console.log('  Then define your routes in md.config.ts');
  console.log('');
  console.log('  Alternative: use createMarkdownNegotiator in middleware.ts or proxy.ts');
}

function findNextConfig(cwd: string): string | null {
  for (const name of ['next.config.ts', 'next.config.mjs', 'next.config.js']) {
    if (existsSync(join(cwd, name))) return join(cwd, name);
  }
  return null;
}

const BEFORE_FILES_ENTRY = `      beforeFiles: createMarkdownRewrites({
        routes: ['/products/[productId]', '/blog/[slug]'],
      }),`;

function injectIntoExistingRewrites(content: string): string | null {
  const rewritesMatch = /(?:async\s+)?rewrites\s*\(\s*\)\s*\{/.exec(content);
  if (!rewritesMatch) return null;

  const bodyStart = rewritesMatch.index! + rewritesMatch[0].length;
  const afterBody = content.slice(bodyStart);

  const returnMatch = /return\s*/.exec(afterBody);
  if (!returnMatch) return null;

  const returnEnd = bodyStart + returnMatch.index! + returnMatch[0].length;
  const charAfterReturn = content[returnEnd];

  // Object return — inject beforeFiles after the opening brace
  if (charAfterReturn === '{') {
    const insertPos = returnEnd + 1;
    return (
      content.slice(0, insertPos) +
      '\n' + BEFORE_FILES_ENTRY +
      content.slice(insertPos)
    );
  }

  // Array return — wrap in { beforeFiles: ..., afterFiles: [...] }
  if (charAfterReturn === '[') {
    let depth = 0;
    let i = returnEnd;
    for (; i < content.length; i++) {
      if (content[i] === '[') depth++;
      else if (content[i] === ']') {
        depth--;
        if (depth === 0) { i++; break; }
      }
    }
    if (depth !== 0) return null;

    const arrayContent = content.slice(returnEnd, i);
    const replacement =
      '{\n' + BEFORE_FILES_ENTRY +
      '\n      afterFiles: ' + arrayContent + ',' +
      '\n    }';

    return content.slice(0, returnEnd) + replacement + content.slice(i);
  }

  return null;
}

function applyRewritesCodemod(cwd: string) {
  const configPath = findNextConfig(cwd);

  if (!configPath) {
    // No config exists — create next.config.ts from scratch
    writeFileSync(join(cwd, 'next.config.ts'), NEW_NEXT_CONFIG);
    console.log('\n  Created next.config.ts with rewrites');
    return;
  }

  const content = readFileSync(configPath, 'utf-8');
  const fileName = configPath.split('/').pop()!;

  // Already has our import — skip
  if (content.includes('createMarkdownRewrites')) {
    console.log(`\n  ${fileName} already has createMarkdownRewrites — skipped`);
    return;
  }

  // Has an existing rewrites() — try to inject beforeFiles into return value
  if (/rewrites/.test(content)) {
    const injected = injectIntoExistingRewrites(content);
    if (injected) {
      writeFileSync(configPath, REWRITES_IMPORT + injected);
      console.log(`\n  Updated ${fileName} with rewrites`);
      return;
    }
    console.log(`\n  ${fileName} has a rewrites() function but could not auto-modify it.`);
    console.log('  Please add the following manually:\n');
    printRewritesSnippet();
    return;
  }

  // Try to inject into config object
  const configObjectPattern = /(?:export\s+default\s*\{|(?:const|let|var)\s+\w+\s*=\s*\{|module\.exports\s*=\s*\{)/;
  const match = configObjectPattern.exec(content);

  if (!match) {
    console.log(`\n  Could not find config object in ${fileName}.`);
    console.log('  Please add the following manually:\n');
    printRewritesSnippet();
    return;
  }

  // Inject import at top and rewrites after the opening brace
  const insertPos = match.index! + match[0].length;
  const updated =
    REWRITES_IMPORT +
    content.slice(0, insertPos) +
    '\n' +
    REWRITES_SNIPPET +
    '\n' +
    content.slice(insertPos);

  writeFileSync(configPath, updated);
  console.log(`\n  Updated ${fileName} with rewrites`);
}

function askChoice(): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    console.log('\nHow would you like to add content negotiation?\n');
    console.log('  1. Add rewrites to next.config (recommended)');
    console.log('  2. Use middleware or proxy (manual)\n');
    rl.question('Choice (1/2): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command !== 'init') {
    console.log('Usage: next-md-negotiate init');
    process.exit(1);
  }

  const flags = new Set(args.slice(1));
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

  // Strategy selection
  if (flags.has('--rewrites')) {
    applyRewritesCodemod(cwd);
  } else if (flags.has('--middleware')) {
    printMiddlewareInstructions();
  } else if (process.stdin.isTTY) {
    const choice = await askChoice();
    if (choice === '1') {
      applyRewritesCodemod(cwd);
    } else {
      printMiddlewareInstructions();
    }
  } else {
    printGenericInstructions();
  }

  console.log('');
  console.log('  Then define your routes in md.config.ts');
}

main();
