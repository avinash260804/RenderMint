import { ConflictError, NotFoundError } from "@/lib/errors";
import { communityCatalogDisciplines } from "@/lib/community/catalog";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import { prisma } from "@/server/db/client";
import {
  SETTINGS_EXPERIENCE_LEVELS,
  type AccountSettingsInput,
  type AppearanceSettingsInput,
  type ConnectionsSettingsInput,
  type CreditsSettingsInput,
  type FeedSettingsInput,
  type IdentitySettingsInput,
  type NotificationSettingsInput,
  type PrivacySettingsInput,
  type ProfileSettingsInput,
} from "@/modules/settings/schemas/settings-schema";

type SettingsJsonObject = Record<string, string>;

type SettingsConnection = {
  service: "dribbble" | "behance" | "github" | "portfolio";
  connected: boolean;
  username?: string;
  syncEnabled: boolean;
};

type SettingsApiKey = {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
};

function emptySocialLinks(): SettingsJsonObject {
  return {
    twitter: "",
    instagram: "",
    behance: "",
    linkedin: "",
    dribbble: "",
  };
}

function defaultConnections(): SettingsConnection[] {
  return [
    { service: "dribbble", connected: false, username: "", syncEnabled: false },
    { service: "behance", connected: false, username: "", syncEnabled: false },
    { service: "github", connected: false, username: "", syncEnabled: false },
    { service: "portfolio", connected: false, username: "", syncEnabled: false },
  ];
}

function parseJsonObject(value: unknown, fallback: SettingsJsonObject): SettingsJsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const next = { ...fallback };
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      next[key] = entry;
    }
  }
  return next;
}

function parseConnections(value: unknown): SettingsConnection[] {
  if (!Array.isArray(value)) return defaultConnections();

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const service = record.service;
      if (
        service !== "dribbble" &&
        service !== "behance" &&
        service !== "github" &&
        service !== "portfolio"
      ) {
        return null;
      }
      return {
        service,
        connected: Boolean(record.connected),
        username: typeof record.username === "string" ? record.username : "",
        syncEnabled: Boolean(record.syncEnabled),
      };
    })
    .filter(Boolean);

  return parsed as SettingsConnection[];
}

function parseApiKeys(value: unknown): SettingsApiKey[] {
  if (!Array.isArray(value)) return [];

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      if (typeof record.id !== "string" || typeof record.name !== "string") return null;
      if (typeof record.createdAt !== "string") return null;
      return {
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        lastUsed: typeof record.lastUsed === "string" ? record.lastUsed : undefined,
      };
    })
    .filter(Boolean);

  return parsed as SettingsApiKey[];
}

async function ensureProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarUrl: true,
      experienceLevel: true,
      skills: true,
      primaryDiscipline: true,
      createdAt: true,
      discipline: {
        select: {
          slug: true,
          name: true,
        },
      },
      profileSoftwares: {
        select: {
          software: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      },
      settings: true,
    },
  });

  if (!profile) {
    throw new NotFoundError("Profile not found.");
  }

  return profile;
}

async function getDisciplineTaxonomy() {
  try {
    const disciplines = await prisma.discipline.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        softwares: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    if (disciplines.length > 0) {
      return {
        disciplines: disciplines.map((discipline) => ({
          id: discipline.id,
          slug: discipline.slug,
          name: discipline.name,
        })),
        softwares: disciplines.flatMap((discipline) => discipline.softwares),
      };
    }
  } catch {
    // Fall back to static catalog below.
  }

  return {
    disciplines: communityCatalogDisciplines.map((discipline, index) => ({
      id: index + 1,
      slug: discipline.slug,
      name: discipline.name,
    })),
    softwares: communityCatalogDisciplines.flatMap((discipline, disciplineIndex) =>
      discipline.softwares.map((software, softwareIndex) => ({
        id: Number(`${disciplineIndex + 1}${softwareIndex + 1}`),
        slug: software.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name: software,
      })),
    ),
  };
}

async function upsertDefaults(userId: string) {
  const profile = await ensureProfile(userId);

  const displayName = profile.username;
  const socialLinks = parseJsonObject(profile.settings?.socialLinks, emptySocialLinks());
  const connections = parseConnections(profile.settings?.connections);
  const apiKeys = parseApiKeys(profile.settings?.apiKeys);

  return prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      displayName,
      bio: profile.bio ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      coverImageUrl: "",
      portfolioUrl: "",
      location: "",
      locationVisible: true,
      socialLinks,
      primaryDiscipline: profile.primaryDiscipline ?? "",
      secondaryDisciplines: [],
      experienceLevel: normalizeExperienceLevel(profile.experienceLevel),
      softwareTools: profile.profileSoftwares.map((entry) => entry.software.slug),
      skills: profile.skills,
      acceptCritique: true,
      offerMentorship: false,
      twoFactorEnabled: false,
      emailNotifications: true,
      inAppNotifications: true,
      emailFrequency: "daily",
      commentNotifications: true,
      newFollowerNotifications: false,
      newsAndFeatures: true,
      profileVisibility: "public",
      onlineStatusVisible: true,
      activityVisible: true,
      messagePermissions: "none",
      searchVisible: true,
      contentTypeFilters: ["discussion", "critique", "showcase", "help", "resource"],
      disciplineFilters: profile.primaryDiscipline ? [profile.primaryDiscipline] : [],
      sortingPreference: "recent",
      theme: "dark",
      compactMode: false,
      fontSize: "normal",
      displayCredits: true,
      creditsGoal: 100,
      reputationHistoryVisible: true,
      reputationGoal: 500,
      connections,
      exportFrequency: "manual",
      exportFormat: "json",
      apiKeys,
      accountDeletionRequested: false,
    },
    update: {},
  });
}

function normalizeExperienceLevel(value: string | null) {
  switch (value?.toLowerCase()) {
    case "student":
      return "student";
    case "practitioner":
      return "emerging";
    case "contributor":
      return "intermediate";
    case "mentor":
      return "advanced";
    case "senior":
    case "advanced":
    case "intermediate":
    case "emerging":
      return value.toLowerCase();
    default:
      return "student";
  }
}

function mapExperienceLevelToProfile(value: string) {
  switch (value) {
    case "student":
      return "Student";
    case "emerging":
      return "Practitioner";
    case "intermediate":
      return "Contributor";
    case "advanced":
    case "senior":
      return "Mentor";
    default:
      return "Practitioner";
  }
}

export async function getUserSettings(userId: string) {
  const [profile, settings, taxonomy] = await Promise.all([
    ensureProfile(userId),
    upsertDefaults(userId),
    getDisciplineTaxonomy(),
  ]);

  const softwareMap = new Map(taxonomy.softwares.map((software) => [software.slug, software.name]));

  return {
    profile: {
      displayName: settings.displayName ?? profile.username,
      username: profile.username,
      bio: settings.bio ?? profile.bio ?? "",
      avatarUrl: settings.avatarUrl ?? profile.avatarUrl ?? "",
      coverImageUrl: settings.coverImageUrl ?? "",
      portfolioUrl: settings.portfolioUrl ?? "",
      location: settings.location ?? "",
      locationVisible: settings.locationVisible,
      socialLinks: parseJsonObject(settings.socialLinks, emptySocialLinks()),
    },
    identity: {
      primaryDiscipline: settings.primaryDiscipline || profile.primaryDiscipline || "",
      secondaryDisciplines: settings.secondaryDisciplines,
      experienceLevel: settings.experienceLevel,
      softwareTools:
        settings.softwareTools.length > 0
          ? settings.softwareTools
          : profile.profileSoftwares.map((entry) => entry.software.slug),
      softwareLabels:
        settings.softwareTools.length > 0
          ? settings.softwareTools.map((slug) => softwareMap.get(slug) ?? slug)
          : profile.profileSoftwares.map((entry) => entry.software.name),
      skills: settings.skills.length > 0 ? settings.skills : profile.skills,
      acceptCritique: settings.acceptCritique,
      offerMentorship: settings.offerMentorship,
    },
    account: {
      twoFactorEnabled: settings.twoFactorEnabled,
      activeSessions: [],
      connectedAccounts: parseConnections(settings.connections).map((entry) => ({
        provider: entry.service,
        connected: entry.connected,
        username: entry.username ?? "",
      })),
    },
    notifications: {
      emailNotifications: settings.emailNotifications,
      inAppNotifications: settings.inAppNotifications,
      emailFrequency: settings.emailFrequency,
      commentNotifications: settings.commentNotifications,
      newFollowerNotifications: settings.newFollowerNotifications,
      newsAndFeatures: settings.newsAndFeatures,
    },
    privacy: {
      profileVisibility: settings.profileVisibility,
      onlineStatusVisible: settings.onlineStatusVisible,
      activityVisible: settings.activityVisible,
      messagePermissions: settings.messagePermissions,
      searchVisible: settings.searchVisible,
    },
    feed: {
      contentTypeFilters: settings.contentTypeFilters,
      disciplineFilters: settings.disciplineFilters,
      sortingPreference: settings.sortingPreference,
    },
    appearance: {
      theme: settings.theme,
      compactMode: settings.compactMode,
      fontSize: settings.fontSize,
    },
    credits: {
      displayCredits: settings.displayCredits,
      creditsGoal: settings.creditsGoal,
      reputationHistoryVisible: settings.reputationHistoryVisible,
      reputationGoal: settings.reputationGoal,
    },
    connections: {
      connections: parseConnections(settings.connections),
    },
    data: {
      exportFrequency: settings.exportFrequency,
      exportFormat: settings.exportFormat,
      lastExportDate: settings.lastExportDate?.toISOString() ?? null,
      apiKeys: parseApiKeys(settings.apiKeys),
      accountDeletionRequested: settings.accountDeletionRequested,
      accountDeletionDate: settings.accountDeletionDate?.toISOString() ?? null,
    },
    meta: {
      disciplines: taxonomy.disciplines,
      softwares: taxonomy.softwares,
      experienceLevels: SETTINGS_EXPERIENCE_LEVELS,
    },
  };
}

export async function updateProfileSettings(userId: string, data: Partial<ProfileSettingsInput>) {
  if (data.username) {
    const usernameOwner = await prisma.profile.findUnique({
      where: { username: data.username },
      select: { id: true },
    });

    if (usernameOwner && usernameOwner.id !== userId) {
      throw new ConflictError("Username is already taken.");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { id: userId },
      data: {
        username: data.username,
        bio: data.bio !== undefined ? sanitizeText(data.bio) : undefined,
        avatarUrl:
          data.avatarUrl === undefined
            ? undefined
            : data.avatarUrl
              ? sanitizeUrl(data.avatarUrl)
              : null,
      },
    });

    await tx.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        displayName: sanitizeText(data.displayName ?? ""),
        bio: sanitizeText(data.bio ?? ""),
        avatarUrl: data.avatarUrl ? sanitizeUrl(data.avatarUrl) : "",
        coverImageUrl: data.coverImageUrl ? sanitizeUrl(data.coverImageUrl) : "",
        portfolioUrl: data.portfolioUrl ? sanitizeUrl(data.portfolioUrl) : "",
        location: sanitizeText(data.location ?? ""),
        locationVisible: data.locationVisible ?? true,
        socialLinks: data.socialLinks ?? emptySocialLinks(),
      },
      update: {
        displayName: data.displayName !== undefined ? sanitizeText(data.displayName) : undefined,
        bio: data.bio !== undefined ? sanitizeText(data.bio) : undefined,
        avatarUrl:
          data.avatarUrl !== undefined
            ? data.avatarUrl
              ? sanitizeUrl(data.avatarUrl)
              : ""
            : undefined,
        coverImageUrl:
          data.coverImageUrl !== undefined
            ? data.coverImageUrl
              ? sanitizeUrl(data.coverImageUrl)
              : ""
            : undefined,
        portfolioUrl:
          data.portfolioUrl !== undefined
            ? data.portfolioUrl
              ? sanitizeUrl(data.portfolioUrl)
              : ""
            : undefined,
        location: data.location !== undefined ? sanitizeText(data.location) : undefined,
        locationVisible: data.locationVisible,
        socialLinks: data.socialLinks,
      },
    });
  });
}

export async function updateCreativeIdentity(userId: string, data: Partial<IdentitySettingsInput>) {
  const taxonomy = await getDisciplineTaxonomy();
  const discipline = data.primaryDiscipline
    ? taxonomy.disciplines.find((entry) => entry.slug === data.primaryDiscipline)
    : null;

  if (data.primaryDiscipline && !discipline) {
    throw new NotFoundError("Selected discipline does not exist.");
  }

  let validSoftwareIds: number[] | undefined;
  if (data.primaryDiscipline && data.softwareTools) {
    const disciplineRecord = await prisma.discipline.findUnique({
      where: { slug: data.primaryDiscipline },
      select: { id: true },
    });

    if (disciplineRecord) {
      const softwares = await prisma.software.findMany({
        where: {
          disciplineId: disciplineRecord.id,
          slug: { in: data.softwareTools },
        },
        select: { id: true, slug: true },
      });

      if (softwares.length !== data.softwareTools.length) {
        throw new NotFoundError("One or more selected software tools are invalid for this discipline.");
      }

      validSoftwareIds = softwares.map((entry) => entry.id);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { id: userId },
      data: {
        primaryDiscipline: data.primaryDiscipline,
        experienceLevel:
          data.experienceLevel !== undefined
            ? mapExperienceLevelToProfile(data.experienceLevel)
            : undefined,
        skills: data.skills,
      },
    });

    if (validSoftwareIds) {
      await tx.profileSoftware.deleteMany({ where: { profileId: userId } });
      if (validSoftwareIds.length > 0) {
        await tx.profileSoftware.createMany({
          data: validSoftwareIds.map((softwareId) => ({
            profileId: userId,
            softwareId,
          })),
          skipDuplicates: true,
        });
      }
    }

    await tx.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        primaryDiscipline: data.primaryDiscipline ?? "",
        secondaryDisciplines: data.secondaryDisciplines ?? [],
        experienceLevel: data.experienceLevel ?? "student",
        softwareTools: data.softwareTools ?? [],
        skills: data.skills ?? [],
        acceptCritique: data.acceptCritique ?? true,
        offerMentorship: data.offerMentorship ?? false,
      },
      update: {
        primaryDiscipline: data.primaryDiscipline,
        secondaryDisciplines: data.secondaryDisciplines,
        experienceLevel: data.experienceLevel,
        softwareTools: data.softwareTools,
        skills: data.skills,
        acceptCritique: data.acceptCritique,
        offerMentorship: data.offerMentorship,
      },
    });
  });
}

export async function updateAccountSettings(userId: string, data: Partial<AccountSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      twoFactorEnabled: data.twoFactorEnabled ?? false,
    },
    update: {
      twoFactorEnabled: data.twoFactorEnabled,
    },
  });
}

export async function updateNotifications(userId: string, data: Partial<NotificationSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      emailNotifications: data.emailNotifications ?? true,
      inAppNotifications: data.inAppNotifications ?? true,
      emailFrequency: data.emailFrequency ?? "daily",
      commentNotifications: data.commentNotifications ?? true,
      newFollowerNotifications: data.newFollowerNotifications ?? false,
      newsAndFeatures: data.newsAndFeatures ?? true,
    },
    update: data,
  });
}

export async function updatePrivacy(userId: string, data: Partial<PrivacySettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      profileVisibility: data.profileVisibility ?? "public",
      onlineStatusVisible: data.onlineStatusVisible ?? true,
      activityVisible: data.activityVisible ?? true,
      messagePermissions: data.messagePermissions ?? "none",
      searchVisible: data.searchVisible ?? true,
    },
    update: data,
  });
}

export async function updateFeedPreferences(userId: string, data: Partial<FeedSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      contentTypeFilters: data.contentTypeFilters ?? ["discussion", "critique", "showcase", "help", "resource"],
      disciplineFilters: data.disciplineFilters ?? [],
      sortingPreference: data.sortingPreference ?? "recent",
    },
    update: data,
  });
}

export async function updateAppearance(userId: string, data: Partial<AppearanceSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      theme: data.theme ?? "dark",
      compactMode: data.compactMode ?? false,
      fontSize: data.fontSize ?? "normal",
    },
    update: data,
  });
}

export async function updateCreditsSettings(userId: string, data: Partial<CreditsSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      displayCredits: data.displayCredits ?? true,
      creditsGoal: data.creditsGoal ?? 100,
      reputationHistoryVisible: data.reputationHistoryVisible ?? true,
      reputationGoal: data.reputationGoal ?? 500,
    },
    update: data,
  });
}

export async function updateConnections(userId: string, data: Partial<ConnectionsSettingsInput>) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      connections: data.connections ?? defaultConnections(),
    },
    update: {
      connections: data.connections,
    },
  });
}

export async function exportUserData(userId: string, format: "json" | "csv") {
  const [profile, settings, posts, comments] = await Promise.all([
    getUserSettings(userId),
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.post.findMany({ where: { authorId: userId } }),
    prisma.comment.findMany({ where: { authorId: userId } }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile,
    rawSettings: settings,
    posts,
    comments,
  };

  if (format === "csv") {
    const rows = [
      ["section", "field", "value"],
      ["profile", "username", profile.profile.username],
      ["profile", "displayName", profile.profile.displayName],
      ["identity", "primaryDiscipline", profile.identity.primaryDiscipline],
      ["credits", "reputationGoal", String(profile.credits.reputationGoal)],
    ];
    return Buffer.from(rows.map((row) => row.join(",")).join("\n"), "utf8");
  }

  return Buffer.from(JSON.stringify(payload, null, 2), "utf8");
}

export async function requestAccountDeletion(userId: string) {
  const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      accountDeletionRequested: true,
      accountDeletionDate: deletionDate,
    },
    update: {
      accountDeletionRequested: true,
      accountDeletionDate: deletionDate,
    },
  });

  return { deletionDate };
}

export async function cancelAccountDeletion(userId: string) {
  await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      accountDeletionRequested: false,
      accountDeletionDate: null,
    },
    update: {
      accountDeletionRequested: false,
      accountDeletionDate: null,
    },
  });
}
