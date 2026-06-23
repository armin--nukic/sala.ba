import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3111";
  return [
    "",
    "/sale",
    "/sale-za-vjencanja",
    "/sport-sale",
    "/dijaspora",
    "/forum",
    "/about",
    "/contact",
    "/login",
    "/register"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}
