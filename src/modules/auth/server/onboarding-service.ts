import { prisma } from "@/server/db/client";
import type { OnboardingInput } from "@/modules/auth/schemas/auth-schemas";

export async function getDisciplinesWithSoftwares() {
  return prisma.discipline.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      softwares: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function isUsernameAvailable(username: string, excludeUserId?: string) {
  const existing = await prisma.profile.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!existing) return true;
  if (excludeUserId && existing.id === excludeUserId) return true;
  return false;
}

export async function isUserOnboarded(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      username: true,
      primaryDiscipline: true,
      profileSoftwares: { select: { softwareId: true }, take: 1 },
    },
  });

  return Boolean(
    profile?.username && profile?.primaryDiscipline && profile.profileSoftwares.length > 0,
  );
}

export async function completeOnboarding(userId: string, input: OnboardingInput) {
  const discipline = await prisma.discipline.findUnique({
    where: { slug: input.disciplineSlug },
    select: { id: true, slug: true },
  });

  if (!discipline) {
    throw new Error("Selected discipline does not exist.");
  }

  const available = await isUsernameAvailable(input.username, userId);
  if (!available) {
    throw new Error("Username is already taken.");
  }

  const validSoftwares = await prisma.software.findMany({
    where: {
      id: { in: input.softwareIds },
      disciplineId: discipline.id,
    },
    select: { id: true },
  });

  if (validSoftwares.length !== input.softwareIds.length) {
    throw new Error("One or more selected softwares are invalid for the chosen discipline.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { id: userId },
      create: {
        id: userId,
        username: input.username,
        primaryDiscipline: discipline.slug,
      },
      update: {
        username: input.username,
        primaryDiscipline: discipline.slug,
      },
    });

    await tx.profileSoftware.deleteMany({ where: { profileId: userId } });

    await tx.profileSoftware.createMany({
      data: validSoftwares.map((software) => ({
        profileId: userId,
        softwareId: software.id,
      })),
      skipDuplicates: true,
    });
  });
}
