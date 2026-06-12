import { randomUUID } from "crypto";

export function generateSlug(title: string) {
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 140);

  const base = normalized || "post";
  const suffix = randomUUID().replace(/-/g, "").slice(0, 6);

  return `${base}-${suffix}`;
}
