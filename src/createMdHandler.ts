import type { MdVersionHandler } from './types.js';
import { matchPath } from './matchPath.js';

/**
 * Creates a Next.js route handler for the catch-all `/md-api/[...path]` route.
 *
 * @example
 * // app/md-api/[...path]/route.ts
 * import { createMdHandler } from 'next-md-negotiate';
 * import registry from '@/md.config';
 *
 * export const GET = createMdHandler(registry);
 */
export function createMdHandler(
  registry: MdVersionHandler[]
): (req: Request, ctx: { params: Promise<{ path: string[] }> }) => Promise<Response> {
  return async function GET(
    _req: Request,
    { params }: { params: Promise<{ path: string[] }> }
  ): Promise<Response> {
    const { path } = await params;
    const incomingPath = '/' + path.join('/');

    for (const route of registry) {
      const match = matchPath(route.pattern, incomingPath);

      if (match) {
        try {
          const markdown = await route.handler(match);
          const headers = new Headers();
          headers.set('Content-Type', 'text/markdown; charset=utf-8');
          return new Response(markdown, { status: 200, headers });
        } catch (error) {
          console.error('[next-md-negotiate] Handler error:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }
    }

    return new Response('Not Found', { status: 404 });
  };
}
