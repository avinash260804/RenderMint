/* eslint-disable @typescript-eslint/no-explicit-any */

type PrismaLike = {
  tag: any;
  discipline: any;
};

export async function listTags(prisma: PrismaLike, filters: { query?: string }) {
  const tags = await prisma.tag.findMany({});
  const query = filters.query?.toLowerCase() ?? "";

  return tags
    .filter((tag: any) => !query || tag.name.toLowerCase().startsWith(query))
    .sort((a: any, b: any) => (b.usageCount ?? 0) - (a.usageCount ?? 0));
}

export async function getPopularTags(
  prisma: PrismaLike,
  filters: { disciplineSlug?: string },
) {
  let disciplineId: string | undefined;
  if (filters.disciplineSlug) {
    const discipline = await prisma.discipline.findFirst({ where: { slug: filters.disciplineSlug } });
    disciplineId = discipline?.id;
  }

  const tags = await prisma.tag.findMany({});
  return tags
    .filter((tag: any) => !disciplineId || tag.disciplineId === disciplineId)
    .sort((a: any, b: any) => (b.usageCount ?? 0) - (a.usageCount ?? 0));
}
