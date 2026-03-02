import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { logSuccess, logWarn, showNote } from "./log.js";
import { findNextConfig } from "./project.js";

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

export function printRewritesSnippet() {
  const snippet = `import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

// inside your config object:
async rewrites() {
  return {
    beforeFiles: createRewritesFromConfig(mdConfig),
  };
},`;

  showNote(snippet, "Add this to your next.config");
}

export function printMiddlewareInstructions() {
  const snippet = `// middleware.ts (or proxy.ts)
import { createNegotiatorFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

const md = createNegotiatorFromConfig(mdConfig);

export function middleware(request: Request) {
  const mdResponse = md(request);
  if (mdResponse) return mdResponse;
  // ...your other middleware logic
}`;

  showNote(snippet, "Add a middleware or proxy for content negotiation");
}

export function printGenericInstructions() {
  const rewritesSnippet = `// next.config.ts
import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

export default {
  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },
};`;

  const middlewareSnippet = `// middleware.ts (or proxy.ts)
import { createNegotiatorFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';

const md = createNegotiatorFromConfig(mdConfig);

export function middleware(request: Request) {
  const mdResponse = md(request);
  if (mdResponse) return mdResponse;
  // ...your other middleware logic
}`;

  showNote(rewritesSnippet, "Next step — add rewrites to next.config");
  showNote(middlewareSnippet, "Alternative — use middleware or proxy instead");
}

function injectIntoExistingRewrites(content: string): string | null {
  const rewritesMatch = /(?:async\s+)?rewrites\s*\(\s*\)\s*\{/.exec(content);
  if (!rewritesMatch) return null;

  const bodyStart = rewritesMatch.index + rewritesMatch[0].length;
  const afterBody = content.slice(bodyStart);

  const returnMatch = /return\s*/.exec(afterBody);
  if (!returnMatch) return null;

  const returnEnd = bodyStart + returnMatch.index + returnMatch[0].length;
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
  const directPattern =
    /(?:export\s+default\s*\{|(?:const|let|var)\s+\w+(?:\s*:[^=]+)?\s*=\s*\{|module\.exports\s*=\s*\{)/;
  const match = directPattern.exec(content);
  if (match) return match.index + match[0].length;

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

export function applyRewritesCodemod(cwd: string) {
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
