import type { MetadataRoute } from "next";

import { DOCS_NAV } from "@/app/docs/nav";

const SITE_URL = "https://next-md-negotiate.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...DOCS_NAV.map(({ href }) => href)].map((pathname) => ({
    url: new URL(pathname, SITE_URL).toString(),
  }));
}
