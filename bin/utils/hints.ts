import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ConfigEntry {
  pattern: string;
  hintText?: string;
  skipHint?: boolean;
}

export function extractDefaultHintText(content: string): string | undefined {
  const match = /export\s+const\s+defaultHintText\s*=\s*['"`]([^'"`]+)['"`]/.exec(content);
  return match ? match[1] : undefined;
}

export function extractConfigEntries(content: string): ConfigEntry[] {
  const entries: ConfigEntry[] = [];
  const callRegex = /createMdVersion\s*\(/g;

  let match: RegExpExecArray | null;
  while ((match = callRegex.exec(content)) !== null) {
    const start = match.index + match[0].length;
    // Use bracket-depth tracking to find the end of the call
    let depth = 1;
    let i = start;
    for (; i < content.length && depth > 0; i++) {
      if (content[i] === "(") depth++;
      else if (content[i] === ")") depth--;
    }
    const callBody = content.slice(start, i - 1);

    // Extract the first string argument (the pattern)
    const patternMatch = /['"`]([^'"`]+)['"`]/.exec(callBody);
    if (!patternMatch) continue;
    const pattern = patternMatch[1];

    // Check for hintText in an options object
    const hintMatch = /hintText\s*:\s*['"`]([^'"`]+)['"`]/.exec(callBody);
    const hintText = hintMatch ? hintMatch[1] : undefined;

    // Check for skipHint: true
    const skipHint = /skipHint\s*:\s*true/.test(callBody);

    entries.push({ pattern, hintText, skipHint: skipHint || undefined });
  }

  return entries;
}

export function resolvePageFile(
  cwd: string,
  pattern: string,
  useSrc: boolean,
  hasAppDir: boolean,
): string | null {
  const base = useSrc ? join(cwd, "src") : cwd;
  const extensions = ["tsx", "jsx", "ts", "js"];

  if (hasAppDir) {
    // App Router: app/{pattern}/page.{ext}
    const routeDir = pattern === "/" ? "" : pattern.replace(/^\//, "");
    for (const ext of extensions) {
      const filePath = join(base, "app", routeDir, `page.${ext}`);
      if (existsSync(filePath)) return filePath;
    }
  } else {
    // Pages Router: pages/{pattern}.{ext}
    const routePath = pattern === "/" ? "index" : pattern.replace(/^\//, "");
    for (const ext of extensions) {
      const filePath = join(base, "pages", `${routePath}.${ext}`);
      if (existsSync(filePath)) return filePath;
    }
  }

  return null;
}

export function injectLlmHint(content: string, hintText?: string): string | null {
  // Already has LlmHint — skip
  if (content.includes("LlmHint")) return null;

  const hintTag = hintText
    ? `<LlmHint message="${hintText}" />`
    : "<LlmHint />";

  // Add import
  let result = content;
  const existingImportMatch = /^(import\s+\{[^}]*\}\s+from\s+['"]next-md-negotiate['"];?)$/m.exec(result);
  if (existingImportMatch) {
    // Merge into existing import
    const oldImport = existingImportMatch[0];
    const newImport = oldImport.replace(/\}/, ", LlmHint }");
    result = result.replace(oldImport, newImport);
  } else {
    // Add import after last existing import
    const importLines = [...result.matchAll(/^import\s+.+$/gm)];
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1];
      const insertPos = lastImport.index! + lastImport[0].length;
      result =
        result.slice(0, insertPos) +
        "\nimport { LlmHint } from 'next-md-negotiate';" +
        result.slice(insertPos);
    } else {
      result = "import { LlmHint } from 'next-md-negotiate';\n" + result;
    }
  }

  // Find `return (` in a function component and inject the hint tag
  const returnMatch = /return\s*\(\s*\n(\s*)(<)/m.exec(result);
  if (!returnMatch) return null;

  const indent = returnMatch[1];

  // Check what element follows
  const afterReturn = result.slice(returnMatch.index + returnMatch[0].length - 1);

  if (afterReturn.startsWith("<>")) {
    // Fragment root — insert hint after <>
    const fragPos = result.indexOf("<>", returnMatch.index + returnMatch[0].length - afterReturn.length);
    const insertPos = fragPos + 2;
    result =
      result.slice(0, insertPos) +
      "\n" + indent + "  " + hintTag +
      result.slice(insertPos);
  } else {
    // Non-fragment root — wrap in fragment
    // Find the matching closing paren for `return (`
    const parenStart = result.indexOf("(", returnMatch.index);
    let depth = 1;
    let i = parenStart + 1;
    for (; i < result.length && depth > 0; i++) {
      if (result[i] === "(") depth++;
      else if (result[i] === ")") depth--;
    }
    const parenEnd = i - 1;

    // Get the content between parens
    const innerContent = result.slice(parenStart + 1, parenEnd);
    // Find the actual JSX within (skip leading whitespace)
    const leadingWs = innerContent.match(/^\s*\n(\s*)/);
    const jsxIndent = leadingWs ? leadingWs[1] : indent;

    result =
      result.slice(0, parenStart + 1) +
      "\n" + jsxIndent + "<>" +
      "\n" + jsxIndent + "  " + hintTag +
      innerContent.replace(/\n(\s*)$/, "\n" + jsxIndent + "</>\n$1") +
      result.slice(parenEnd);
  }

  return result;
}

export function removeLlmHint(content: string): string | null {
  if (!content.includes("LlmHint")) return null;

  let result = content;

  // Remove <LlmHint /> or <LlmHint message="..." />
  result = result.replace(/[ \t]*<LlmHint\b[^/]*\/>\s*\n?/g, "");

  // Remove standalone import line
  result = result.replace(
    /^import\s+\{\s*LlmHint\s*\}\s+from\s+['"]next-md-negotiate['"];?\s*\n?/gm,
    "",
  );

  // Remove LlmHint from combined imports
  result = result.replace(
    /,\s*LlmHint\b/g,
    "",
  );
  result = result.replace(
    /\bLlmHint\s*,\s*/g,
    "",
  );

  return result;
}
