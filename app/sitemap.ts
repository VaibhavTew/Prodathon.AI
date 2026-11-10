import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const pages = ["", "/hackathon", "/workshops", "/colleges", "/sponsors", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...content.workshops
      .filter((w) => w.published)
      .map((w) => ({ url: `${siteUrl}/workshops/${w.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
