import { AppError } from "@/lib/handle-error";
import { generateSlug } from "@/lib/slug";

type PrismaLike = {
  post: any;
  discipline: any;
};

type PostInput = {
  title?: string;
  content?: string;
  body?: string;
  postType?: string;
  type?: string;
  disciplineId?: string;
};

export async function createPost(prisma: PrismaLike, userId: string | undefined, input: PostInput) {
  if (!userId) throw new AppError("Unauthorized", 401);
  if (!input.title?.trim()) throw new AppError("Title is required", 400);
  if (!input.disciplineId) throw new AppError("Discipline is required", 400);
  const type = normalizePostType(input.postType ?? input.type);
  if (!type) throw new AppError("Post type is required", 400);

  const discipline = await prisma.discipline.findUnique({ where: { id: input.disciplineId } });
  const slug = await generateSlug(input.title, {
    checkExists: async (candidate) => Boolean(await prisma.post.findUnique({ where: { slug: candidate } })),
  });

  return prisma.post.create({
    data: {
      title: input.title,
      slug,
      body: input.content ?? input.body ?? "",
      postType: type,
      authorId: userId,
      disciplineId: input.disciplineId,
      voteCount: 0,
      commentCount: 0,
    },
    include: { discipline: true },
  }).then(mapPost);
}

export async function getPostBySlug(prisma: PrismaLike, slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, deletedAt: null },
    include: { discipline: true },
  });

  return post ? mapPost(post) : null;
}

export async function listPosts(
  prisma: PrismaLike,
  filters: { disciplineSlug?: string; postType?: string; page?: number; limit?: number },
) {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    include: { discipline: true },
    orderBy: { createdAt: "desc" },
  });

  const type = normalizePostType(filters.postType);
  const filtered = posts
    .map(mapPost)
    .filter(
      (post: { discipline: { slug: string } }) =>
        !filters.disciplineSlug || post.discipline.slug === filters.disciplineSlug,
    )
    .filter((post: { type: string }) => !type || post.type === type);

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? (filtered.length || 20));
  return filtered.slice((page - 1) * limit, page * limit);
}

export async function updatePost(
  prisma: PrismaLike,
  userId: string,
  postId: string,
  input: { title?: string },
) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);

  return prisma.post.update({ where: { id: postId }, data: input }).then(mapPost);
}

export async function deletePost(prisma: PrismaLike, userId: string, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);

  await prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });
}

function normalizePostType(value?: string) {
  if (!value) return null;
  return value.toLowerCase();
}

function mapPost(post: any) {
  const type = post.postType ?? post.type;
  return {
    ...post,
    content: post.content ?? post.body,
    type: typeof type === "string" ? type.toUpperCase() : type,
    discipline: post.discipline,
    deletedAt: post.deletedAt ?? null,
  };
}
