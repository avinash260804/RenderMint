type SlugOptions = {
  checkExists?: (slug: string) => boolean | Promise<boolean>;
};

export async function generateUniqueSlug(title: string, options: SlugOptions = {}) {
  const base = createSlugBase(title);

  if (!options.checkExists) {
    return base;
  }

  for (let index = 0; index < 100; index += 1) {
    const candidate = index === 0 ? base : `${base}-${index}`;
    if (!(await options.checkExists(candidate))) {
      return candidate;
    }
  }

  return `${base}-${Date.now()}`;
}

export function generateSlug(title: string, options?: SlugOptions) {
  const base = createSlugBase(title);
  if (!options?.checkExists) {
    return base;
  }

  return generateUniqueSlug(title, options);
}

function createSlugBase(title: string) {
  const normalized = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 140);

  return normalized || "post";
}
