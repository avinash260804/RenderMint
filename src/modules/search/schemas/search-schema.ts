import { z } from "zod";

import { disciplines } from "@/lib/mock/community-data";

export const searchQuerySchema = z.object({
  q: z.string().trim().optional(),
  discipline: z.string().trim().optional(),
  software: z.string().trim().optional(),
  postType: z.enum(["discussion", "critique", "showcase", "help", "resource"]).optional(),
  solved: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(30).default(12),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export type SearchResultItem = {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  software?: string;
  postType: "discussion" | "critique" | "showcase" | "help" | "resource";
  solved: boolean;
  tags: string[];
  bodyPreview: string;
  score: number;
  createdAt: string;
};

export const validDisciplines = new Set<string>(disciplines.map((discipline) => discipline.slug));
