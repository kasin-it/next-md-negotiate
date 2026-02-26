import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as clack from "@clack/prompts";

const isTTY = process.stdin.isTTY;

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

const REWRITES_IMPORT = `import { createRewritesFromConfig } from 'next-md-negotiate';\nimport { mdConfig } from './md.config';\n`;

const REWRITES_SNIPPET = `  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },`;

const NEW_NEXT_CONFIG = `import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

export default {
  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },
};
`;

const BEFORE_FILES_ENTRY = `      beforeFiles: createRewritesFromConfig(mdConfig),`;

// --- Output helpers ---

function logSuccess(msg: string) {
  if (isTTY) clack.log.success(msg);
  else console.log(`  ${msg}`);
}

function logWarn(msg: string) {
  if (isTTY) clack.log.warn(msg);
  else console.log(`  ${msg}`);
}

function logInfo(msg: string) {
  if (isTTY) clack.log.info(msg);
  else console.log(`  ${msg}`);
}

function logError(msg: string) {
  if (isTTY) clack.log.error(msg);
  else console.error(msg);
}

function showNote(content: string, title: string) {
  if (isTTY) clack.note(content, title);
  else {
    console.log(`\n${title}:\n`);
    for (const line of content.split("\n")) {
      console.log(`  ${line}`);
    }
  }
}

// --- Codemod helpers ---

function printRewritesSnippet() {
  const snippet = [
    "import { createRewritesFromConfig } from 'next-md-negotiate';",
    "import { mdConfig } from './md.config';",
    "",
    "// inside your config object:",
    "async rewrites() {",
    "  return {",
    "    beforeFiles: createRewritesFromConfig(mdConfig),",
    "  };",
    "},",
  ].join("\n");

  showNote(snippet, "Add this to your next.config");
}

function printMiddlewareInstructions() {
  const snippet = [
    "// middleware.ts (or proxy.ts)",
    "import { createNegotiatorFromConfig } from 'next-md-negotiate';",
    "import { mdConfig } from './md.config';",
    "",
    "const md = createNegotiatorFromConfig(mdConfig);",
    "",
    "export function middleware(request: Request) {",
    "  const mdResponse = md(request);",
    "  if (mdResponse) return mdResponse;",
    "  // ...your other middleware logic",
    "}",
  ].join("\n");

  showNote(snippet, "Add a middleware or proxy for content negotiation");
}

function printGenericInstructions() {
  const rewritesSnippet = [
    "// next.config.ts",
    "import { createRewritesFromConfig } from 'next-md-negotiate';",
    "import { mdConfig } from './md.config';",
    "",
    "export default {",
    "  async rewrites() {",
    "    return {",
    "      beforeFiles: createRewritesFromConfig(mdConfig),",
    "    };",
    "  },",
    "};",
  ].join("\n");

  const middlewareSnippet = [
    "// middleware.ts (or proxy.ts)",
    "import { createNegotiatorFromConfig } from 'next-md-negotiate';",
    "import { mdConfig } from './md.config';",
    "",
    "const md = createNegotiatorFromConfig(mdConfig);",
    "",
    "export function middleware(request: Request) {",
    "  const mdResponse = md(request);",
    "  if (mdResponse) return mdResponse;",
    "  // ...your other middleware logic",
    "}",
  ].join("\n");

  showNote(rewritesSnippet, "Next step — add rewrites to next.config");
  showNote(middlewareSnippet, "Alternative — use middleware or proxy instead");
}

function findNextConfig(cwd: string): string | null {
  for (const name of ["next.config.ts", "next.config.mjs", "next.config.js"]) {
    if (existsSync(join(cwd, name))) return join(cwd, name);
  }
  return null;
}

function injectIntoExistingRewrites(content: string): string | null {
  const rewritesMatch = /(?:async\s+)?rewrites\s*\(\s*\)\s*\{/.exec(content);
  if (!rewritesMatch) return null;

  const bodyStart = rewritesMatch.index! + rewritesMatch[0].length;
  const afterBody = content.slice(bodyStart);

  const returnMatch = /return\s*/.exec(afterBody);
  if (!returnMatch) return null;

  const returnEnd = bodyStart + returnMatch.index! + returnMatch[0].length;
  const charAfterReturn = content[returnEnd];

  if (charAfterReturn === "{") {
    const insertPos = returnEnd + 1;
    return (
      content.slice(0, insertPos) +
      "\n" +
      BEFORE_FILES_ENTRY +
      content.slice(insertPos)
    );
  }

  if (charAfterReturn === "[") {
    let depth = 0;
    let i = returnEnd;
    for (; i < content.length; i++) {
      if (content[i] === "[") depth++;
      else if (content[i] === "]") {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    if (depth !== 0) return null;

    const arrayContent = content.slice(returnEnd, i);
    const replacement =
      "{\n" +
      BEFORE_FILES_ENTRY +
      "\n      afterFiles: " +
      arrayContent +
      "," +
      "\n    }";

    return content.slice(0, returnEnd) + replacement + content.slice(i);
  }

  return null;
}

function findConfigObjectStart(content: string): number | null {
  // 1. export default { ... }
  // 2. const/let/var name: Type = { ... }  (with optional type annotation)
  // 3. module.exports = { ... }
  const directPattern =
    /(?:export\s+default\s*\{|(?:const|let|var)\s+\w+(?:\s*:[^=]+)?\s*=\s*\{|module\.exports\s*=\s*\{)/;
  const match = directPattern.exec(content);
  if (match) return match.index + match[0].length;

  // 4. export default <identifier> → resolve to its variable declaration
  const defaultExportMatch = /export\s+default\s+(\w+)/.exec(content);
  if (defaultExportMatch) {
    const varName = defaultExportMatch[1];
    const varPattern = new RegExp(
      `(?:const|let|var)\\s+${varName}(?:\\s*:[^=]+)?\\s*=\\s*\\{`,
    );
    const varMatch = varPattern.exec(content);
    if (varMatch) return varMatch.index + varMatch[0].length;
  }

  return null;
}

function applyRewritesCodemod(cwd: string) {
  const configPath = findNextConfig(cwd);

  if (!configPath) {
    writeFileSync(join(cwd, "next.config.ts"), NEW_NEXT_CONFIG);
    logSuccess("Created next.config.ts with rewrites");
    return;
  }

  const content = readFileSync(configPath, "utf-8");
  const fileName = configPath.split("/").pop()!;

  if (content.includes("createRewritesFromConfig") || content.includes("createMarkdownRewrites")) {
    logWarn(`${fileName} already has rewrite configuration — skipped`);
    return;
  }

  if (/rewrites/.test(content)) {
    const injected = injectIntoExistingRewrites(content);
    if (injected) {
      writeFileSync(configPath, REWRITES_IMPORT + injected);
      logSuccess(`Updated ${fileName} with rewrites`);
      return;
    }
    logWarn(
      `${fileName} has a rewrites() function but could not auto-modify it.`,
    );
    printRewritesSnippet();
    return;
  }

  const insertPos = findConfigObjectStart(content);

  if (insertPos === null) {
    logWarn(`Could not find config object in ${fileName}.`);
    printRewritesSnippet();
    return;
  }
  const updated =
    REWRITES_IMPORT +
    content.slice(0, insertPos) +
    "\n" +
    REWRITES_SNIPPET +
    "\n" +
    content.slice(insertPos);

  writeFileSync(configPath, updated);
  logSuccess(`Updated ${fileName} with rewrites`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command !== "init") {
    console.log("Usage: next-md-negotiate init");
    process.exit(1);
  }

  const flags = new Set(args.slice(1));
  const cwd = process.cwd();

  if (isTTY) clack.intro("next-md-negotiate init");

  // Verify this looks like a Next.js project
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (!deps["next"]) {
        logError(
          'Error: "next" is not listed in package.json dependencies. Is this a Next.js project?',
        );
        process.exit(1);
      }
    } catch {
      // If package.json can't be parsed, continue with directory-based detection
    }
  }

  // Detect project structure
  const useSrc =
    existsSync(join(cwd, "src", "app")) ||
    existsSync(join(cwd, "src", "pages"));
  const hasAppDir = existsSync(join(cwd, useSrc ? "src" : "", "app"));
  const hasPagesDir = existsSync(join(cwd, useSrc ? "src" : "", "pages"));

  if (!hasAppDir && !hasPagesDir) {
    logError(
      "Error: Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.",
    );
    process.exit(1);
  }

  const configDir = useSrc ? join(cwd, "src") : cwd;

  try {
    if (hasAppDir) {
      const appDir = join(cwd, useSrc ? "src" : "", "app");
      const routeDir = join(appDir, "md-api", "[...path]");
      const routePath = join(routeDir, "route.ts");

      if (existsSync(routePath)) {
        logWarn("Skipped app/md-api/[...path]/route.ts (already exists)");
      } else {
        mkdirSync(routeDir, { recursive: true });
        writeFileSync(routePath, APP_ROUTE_HANDLER);
        logSuccess("Created app/md-api/[...path]/route.ts");
      }
    } else {
      const pagesDir = join(cwd, useSrc ? "src" : "", "pages");
      const apiDir = join(pagesDir, "api", "md-api");
      const routePath = join(apiDir, "[...path].ts");

      if (existsSync(routePath)) {
        logWarn("Skipped pages/api/md-api/[...path].ts (already exists)");
      } else {
        mkdirSync(apiDir, { recursive: true });
        writeFileSync(routePath, PAGES_API_HANDLER);
        logSuccess("Created pages/api/md-api/[...path].ts");
      }
    }

    const configPath = join(configDir, "md.config.ts");

    if (existsSync(configPath)) {
      logWarn("Skipped md.config.ts (already exists)");
    } else {
      writeFileSync(configPath, MD_CONFIG);
      logSuccess("Created md.config.ts");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logError(`Error: Failed to write files — ${message}`);
    process.exit(1);
  }

  // Strategy selection
  if (flags.has("--rewrites")) {
    applyRewritesCodemod(cwd);
  } else if (flags.has("--middleware")) {
    printMiddlewareInstructions();
  } else if (isTTY) {
    const strategy = await clack.select({
      message: "How would you like to add content negotiation?",
      options: [
        {
          value: "rewrites",
          label: "Add rewrites to next.config",
          hint: "recommended",
        },
        {
          value: "middleware",
          label: "Use middleware or proxy",
          hint: "manual setup",
        },
      ],
    });

    if (clack.isCancel(strategy)) {
      clack.cancel("Setup cancelled.");
      process.exit(0);
    }

    if (strategy === "rewrites") {
      applyRewritesCodemod(cwd);
    } else {
      printMiddlewareInstructions();
    }
  } else {
    printGenericInstructions();
  }

  logInfo("Define your routes in md.config.ts");
  if (isTTY) clack.outro("You're all set!");
}

main();
