import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as clack from "@clack/prompts";
import { isTTY, logSuccess, logWarn, logInfo, logError } from "./utils/log.js";
import { detectProject, findMdConfig } from "./utils/project.js";
import { applyRewritesCodemod, printMiddlewareInstructions, printGenericInstructions } from "./utils/rewrites.js";
import { extractDefaultHintText, extractConfigEntries, resolvePageFile, injectLlmHint, removeLlmHint } from "./utils/hints.js";

// --- Init templates ---

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

// --- Commands ---

async function runInit(args: string[]) {
  const flags = new Set(args);
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

  const project = detectProject(cwd);
  if (!project) {
    logError(
      "Error: Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.",
    );
    process.exit(1);
  }

  try {
    if (project.hasAppDir) {
      const appDir = join(cwd, project.useSrc ? "src" : "", "app");
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
      const pagesDir = join(cwd, project.useSrc ? "src" : "", "pages");
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

    const configPath = join(project.configDir, "md.config.ts");

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

async function runAddHints() {
  const cwd = process.cwd();
  const project = detectProject(cwd);

  if (!project) {
    logError(
      "Error: Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.",
    );
    process.exit(1);
  }

  const mdConfigPath = findMdConfig(cwd, project.configDir);
  if (!mdConfigPath) {
    logError("Error: Could not find md.config.ts or md.config.js. Run 'next-md-negotiate init' first.");
    process.exit(1);
  }

  const configContent = readFileSync(mdConfigPath, "utf-8");
  const defaultHintText = extractDefaultHintText(configContent);
  const entries = extractConfigEntries(configContent);

  if (entries.length === 0) {
    logWarn("No createMdVersion() entries found in config.");
    return;
  }

  for (const entry of entries) {
    if (entry.skipHint) {
      logWarn(`Skipped ${entry.pattern} (skipHint: true)`);
      continue;
    }

    const pageFile = resolvePageFile(cwd, entry.pattern, project.useSrc, project.hasAppDir);
    if (!pageFile) {
      logWarn(`Could not find page file for pattern: ${entry.pattern}`);
      continue;
    }

    const content = readFileSync(pageFile, "utf-8");
    const hintText = entry.hintText ?? defaultHintText;
    const updated = injectLlmHint(content, hintText);

    if (updated === null) {
      logWarn(`Skipped ${pageFile.replace(cwd + "/", "")} (already has LlmHint)`);
      continue;
    }

    writeFileSync(pageFile, updated);
    logSuccess(`Injected LlmHint into ${pageFile.replace(cwd + "/", "")}`);
  }
}

async function runRemoveHints() {
  const cwd = process.cwd();
  const project = detectProject(cwd);

  if (!project) {
    logError(
      "Error: Could not find app/ or pages/ directory. Make sure you are in a Next.js project root.",
    );
    process.exit(1);
  }

  const mdConfigPath = findMdConfig(cwd, project.configDir);
  if (!mdConfigPath) {
    logError("Error: Could not find md.config.ts or md.config.js. Run 'next-md-negotiate init' first.");
    process.exit(1);
  }

  const configContent = readFileSync(mdConfigPath, "utf-8");
  const entries = extractConfigEntries(configContent);

  if (entries.length === 0) {
    logWarn("No createMdVersion() entries found in config.");
    return;
  }

  for (const entry of entries) {
    const pageFile = resolvePageFile(cwd, entry.pattern, project.useSrc, project.hasAppDir);
    if (!pageFile) {
      continue;
    }

    const content = readFileSync(pageFile, "utf-8");
    const updated = removeLlmHint(content);

    if (updated === null) {
      continue;
    }

    writeFileSync(pageFile, updated);
    logSuccess(`Removed LlmHint from ${pageFile.replace(cwd + "/", "")}`);
  }
}

// --- Entry point ---

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "init":
      await runInit(args.slice(1));
      break;
    case "add-hints":
      await runAddHints();
      break;
    case "remove-hints":
      await runRemoveHints();
      break;
    default:
      console.log("Usage: next-md-negotiate <init|add-hints|remove-hints>");
      process.exit(1);
  }
}

main();
