import { createMdHandler } from "next-md-negotiate";
import { mdConfig } from "@/md.config";

const markdownHandler = createMdHandler(mdConfig);

export async function GET(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const response = await markdownHandler(request, context);
  const headers = new Headers(response.headers);
  const vary = headers.get("Vary");

  if (!vary?.split(",").some((value) => value.trim().toLowerCase() === "accept")) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
