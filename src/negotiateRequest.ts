import { matchPath } from './matchPath.js';

const MARKDOWN_TYPES = [
  'text/markdown',
  'application/markdown',
  'text/x-markdown',
] as const;

export interface NegotiateOptions {
  routes: string[];
  internalPrefix?: string;
}

/**
 * Shared logic for proxy/middleware: checks if a request wants markdown
 * and matches a configured route. Returns the rewrite URL or null.
 */
export function negotiateRequest(
  request: { headers: { get(name: string): string | null }; url: string },
  options: NegotiateOptions
): URL | null {
  const accept = request.headers.get('accept') ?? '';
  const wantsMarkdown = MARKDOWN_TYPES.some((type) => accept.includes(type));

  if (!wantsMarkdown) return null;

  const url = new URL(request.url);
  const pathname = url.pathname;
  const prefix = options.internalPrefix ?? '/md-api';

  for (const route of options.routes) {
    if (matchPath(route, pathname)) {
      return new URL(`${prefix}${pathname}`, url.origin);
    }
  }

  return null;
}
