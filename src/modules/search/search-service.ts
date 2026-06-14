/* eslint-disable @typescript-eslint/no-explicit-any */

type PrismaLike = {
  post: any;
};

export async function searchPosts(
  prisma: PrismaLike,
  filters: { query?: string; disciplineSlug?: string; postType?: string },
) {
  const query = filters.query?.toLowerCase() ?? "";
  const type = filters.postType?.toUpperCase();
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    include: { discipline: true },
  });

  return posts
    .map(mapPost)
    .filter((post: any) => !query || `${post.title} ${post.content}`.toLowerCase().includes(query))
    .filter((post: any) => !filters.disciplineSlug || post.discipline?.slug === filters.disciplineSlug)
    .filter((post: any) => !type || post.type === type)
    .sort((a: any, b: any) => {
      if (type === "HELP") {
        return Number(Boolean(b.acceptedCommentId)) - Number(Boolean(a.acceptedCommentId));
      }

      return 0;
    });
}

function mapPost(post: any) {
  const type = post.type ?? post.postType;
  return {
    ...post,
    content: post.content ?? post.body ?? "",
    type: typeof type === "string" ? type.toUpperCase() : type,
  };
}
