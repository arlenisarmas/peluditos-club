import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout/exito", "/checkout/pendiente", "/checkout/error"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
