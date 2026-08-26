import { NextResponse, type NextRequest } from "next/server";

import { DOCS_NAV } from "@/app/docs/nav";

const MARKDOWN_TYPES = [
  "text/markdown",
  "application/markdown",
  "text/x-markdown",
];

const NEGOTIABLE_PATHS = new Set<string>([
  "/",
  ...DOCS_NAV.map(({ href }) => href),
]);

export function proxy(request: NextRequest) {
  const wantsMarkdown = MARKDOWN_TYPES.some((type) =>
    request.headers.get("accept")?.includes(type),
  );

  if (wantsMarkdown && !NEGOTIABLE_PATHS.has(request.nextUrl.pathname)) {
    return new NextResponse(
      [
        "# Documentation not found",
        "",
        "That documentation route does not exist.",
        "",
        "- [Documentation index](/docs)",
        "- [Agent instructions](/llms.txt)",
        "- [Sitemap](/sitemap.xml)",
      ].join("\n"),
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/", "/docs/:path*"],
};
