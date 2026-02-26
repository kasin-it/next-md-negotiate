import type { MdVersionHandler } from './types.js';
import { matchPath } from './matchPath.js';

// Minimal types to avoid importing next directly
interface NextApiRequest {
  query: Record<string, string | string[] | undefined>;
}

interface NextApiResponse {
  status(code: number): NextApiResponse;
  setHeader(name: string, value: string): NextApiResponse;
  end(body?: string): void;
}

/**
 * Creates a Pages Router API handler for `pages/api/md-api/[...path].ts`.
 *
 * @example
 * // pages/api/md-api/[...path].ts
 * import { createMdApiHandler } from 'next-md-negotiate';
 * import registry from '@/md.config';
 *
 * export default createMdApiHandler(registry);
 */
export function createMdApiHandler(
  registry: MdVersionHandler[]
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pathParam = req.query.path;
    const pathSegments = Array.isArray(pathParam)
      ? pathParam
      : pathParam
        ? [pathParam]
        : [];

    const incomingPath = '/' + pathSegments.join('/');

    for (const route of registry) {
      const match = matchPath(route.pattern, incomingPath);

      if (match) {
        try {
          const markdown = await route.handler(match);
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          res.status(200).end(markdown);
          return;
        } catch (error) {
          console.error('[next-md-negotiate] Handler error:', error);
          res.status(500).end('Internal Server Error');
          return;
        }
      }
    }

    res.status(404).end('Not Found');
  };
}
