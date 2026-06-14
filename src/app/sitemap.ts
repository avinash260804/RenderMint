import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { communityCatalogDisciplines, communityCatalogPosts } from "@/lib/community/catalog";

const spacePaths = ["discussions", "critique", "showcase", "help", "resources"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post/new`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const disciplineRoutes: MetadataRoute.Sitemap = communityCatalogDisciplines.flatMap((discipline) => {
    const hub = {
      url: `${baseUrl}/${discipline.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    };

    const spaces = spacePaths.map((spacePath) => ({
      url: `${baseUrl}/${discipline.slug}/${spacePath}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: spacePath === "help" ? 0.88 : 0.8,
    }));

    return [hub, ...spaces];
  });

  const threadRoutes: MetadataRoute.Sitemap = communityCatalogPosts.map((post) => ({
    url: `${baseUrl}/thread/${post.slug}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: post.type === "help" ? ("daily" as const) : ("weekly" as const),
    priority: post.type === "help" ? 0.95 : 0.72,
  }));

  return [...coreRoutes, ...disciplineRoutes, ...threadRoutes];
}
