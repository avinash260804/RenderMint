type PrismaLike = {
  post: any;
};

export async function getFeed(
  prisma: PrismaLike,
  filters: { disciplineSlug?: string; postType?: string; page?: number; limit?: number },
) {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    include: { discipline: true },
    orderBy: { createdAt: "desc" },
  });

  const type = filters.postType?.toUpperCase();
  const filtered = posts
    .map(mapPost)
    .filter((post: any) => !filters.disciplineSlug || post.discipline?.slug === filters.disciplineSlug)
    .filter((post: any) => !type || post.type === type);

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? (filtered.length || 20));
  return filtered.slice((page - 1) * limit, page * limit);
}

function mapPost(post: any) {
  const type = post.type ?? post.postType;
  return {
    ...post,
    content: post.content ?? post.body,
    type: typeof type === "string" ? type.toUpperCase() : type,
    deletedAt: post.deletedAt ?? null,
  };
}
