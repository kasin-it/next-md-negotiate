/**
 * Matches an incoming path against a Next.js-style route pattern.
 *
 * Supports:
 * - Named params:   /products/[productId]  → { productId: 'abc' }
 * - Catch-all:      /docs/[...slug]        → { slug: 'a/b/c' }
 * - Multiple params: /[org]/[repo]          → { org: 'x', repo: 'y' }
 */

const regexCache = new Map<string, RegExp>();

function compilePattern(pattern: string): RegExp {
  const cached = regexCache.get(pattern);
  if (cached) return cached;

  // Replace param placeholders with temporary tokens to avoid escaping them
  const CATCHALL_TOKEN = '\x00CATCHALL_';
  const PARAM_TOKEN = '\x00PARAM_';

  let tokenized = pattern;
  const catchAllNames: string[] = [];
  const paramNames: string[] = [];

  // Extract catch-all params first
  tokenized = tokenized.replace(/\[\.\.\.([a-zA-Z_]+)\]/g, (_, name) => {
    catchAllNames.push(name);
    return `${CATCHALL_TOKEN}${catchAllNames.length - 1}\x00`;
  });

  // Extract named params
  tokenized = tokenized.replace(/\[([a-zA-Z_]+)\]/g, (_, name) => {
    paramNames.push(name);
    return `${PARAM_TOKEN}${paramNames.length - 1}\x00`;
  });

  // Escape remaining static segments for regex safety
  let regexStr = tokenized.replace(/[.*+?^${}()|\\]/g, '\\$&');

  // Restore catch-all tokens as regex groups
  catchAllNames.forEach((name, i) => {
    regexStr = regexStr.replace(`${CATCHALL_TOKEN}${i}\x00`, `(?<${name}>.+)`);
  });

  // Restore param tokens as regex groups
  paramNames.forEach((name, i) => {
    regexStr = regexStr.replace(`${PARAM_TOKEN}${i}\x00`, `(?<${name}>[^/]+)`);
  });

  const regex = new RegExp(`^${regexStr}$`);
  regexCache.set(pattern, regex);
  return regex;
}

export function matchPath(
  pattern: string,
  path: string
): Record<string, string> | null {
  const regex = compilePattern(pattern);
  const match = path.match(regex);

  if (!match) return null;
  return match.groups ? { ...match.groups } : {};
}
