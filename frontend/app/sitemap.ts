import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3111";
  const publicPaths = [
    "",
    "/sale",
    "/sale-za-vjencanja",
    "/sport-sale",
    "/dijaspora",
    "/forum",
    "/about",
    "/contact"
  ];

  const venuePaths = [
    "/sale/crystal-wedding-hall",
    "/sale/hotel-hills-grand-ballroom",
    "/sale/hotel-hollywood-event-hall",
    "/sale/arena-sport-centar",
    "/sale/skenderija-mirza-delibasic-hall",
    "/sale/diaspora-event-house"
  ];

  return [...publicPaths, ...venuePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/sale/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/sale/") ? 0.72 : 0.8
  }));
}
