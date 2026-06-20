import { z } from "zod";

export const settingsSectionSchema = z.enum([
  "profile",
  "identity",
  "account",
  "notifications",
  "privacy",
  "feed",
  "appearance",
  "credits",
  "connections",
  "data",
]);

export const settingsSocialLinksSchema = z.object({
  twitter: z.string().trim().max(100).optional().or(z.literal("")),
  instagram: z.string().trim().max(100).optional().or(z.literal("")),
  behance: z.string().trim().max(100).optional().or(z.literal("")),
  linkedin: z.string().trim().max(100).optional().or(z.literal("")),
  dribbble: z.string().trim().max(100).optional().or(z.literal("")),
});

export const settingsProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Username must contain lowercase letters, numbers, or underscore."),
  bio: z.string().trim().max(300),
  avatarUrl: z.string().trim().url().max(500).or(z.literal("")),
  coverImageUrl: z.string().trim().url().max(500).or(z.literal("")),
  portfolioUrl: z.string().trim().url().max(500).or(z.literal("")),
  location: z.string().trim().max(120),
  locationVisible: z.boolean(),
  socialLinks: settingsSocialLinksSchema,
});

export const experienceLevelSchema = z.enum([
  "student",
  "emerging",
  "intermediate",
  "advanced",
  "senior",
]);

export const settingsIdentitySchema = z.object({
  primaryDiscipline: z.string().trim().min(1).max(64),
  secondaryDisciplines: z.array(z.string().trim().min(1).max(64)).max(8),
  experienceLevel: experienceLevelSchema,
  softwareTools: z.array(z.string().trim().min(1).max(64)).max(24),
  skills: z.array(z.string().trim().min(1).max(40)).max(24),
  acceptCritique: z.boolean(),
  offerMentorship: z.boolean(),
});

export const settingsAccountSchema = z.object({
  password: z.string().min(8).max(72).optional(),
  twoFactorEnabled: z.boolean().optional(),
  revokeSessionIds: z.array(z.string().trim().min(1)).max(16).optional(),
});

export const emailFrequencySchema = z.enum(["realtime", "daily", "weekly"]);

export const settingsNotificationsSchema = z.object({
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  emailFrequency: emailFrequencySchema,
  commentNotifications: z.boolean(),
  newFollowerNotifications: z.boolean(),
  newsAndFeatures: z.boolean(),
});

export const profileVisibilitySchema = z.enum(["public", "unlisted", "private"]);
export const messagePermissionsSchema = z.enum(["everyone", "followers", "none"]);

export const settingsPrivacySchema = z.object({
  profileVisibility: profileVisibilitySchema,
  onlineStatusVisible: z.boolean(),
  activityVisible: z.boolean(),
  messagePermissions: messagePermissionsSchema,
  searchVisible: z.boolean(),
});

export const contentTypeFilterSchema = z.enum([
  "critique",
  "showcase",
  "help",
  "discussion",
  "resource",
]);
export const sortingPreferenceSchema = z.enum(["recent", "trending", "most-helpful"]);

export const settingsFeedSchema = z.object({
  contentTypeFilters: z.array(contentTypeFilterSchema).max(5),
  disciplineFilters: z.array(z.string().trim().min(1).max(64)).max(12),
  sortingPreference: sortingPreferenceSchema,
});

export const appearanceThemeSchema = z.enum(["dark", "light", "auto"]);
export const fontSizeSchema = z.enum(["small", "normal", "large"]);

export const settingsAppearanceSchema = z.object({
  theme: appearanceThemeSchema,
  compactMode: z.boolean(),
  fontSize: fontSizeSchema,
});

export const settingsCreditsSchema = z.object({
  displayCredits: z.boolean(),
  creditsGoal: z.number().int().min(0).max(100000),
  reputationHistoryVisible: z.boolean(),
  reputationGoal: z.number().int().min(0).max(100000),
});

export const settingsConnectionItemSchema = z.object({
  service: z.enum(["dribbble", "behance", "github", "portfolio"]),
  connected: z.boolean(),
  username: z.string().trim().max(120).optional().or(z.literal("")),
  syncEnabled: z.boolean(),
});

export const settingsConnectionsSchema = z.object({
  connections: z.array(settingsConnectionItemSchema).max(8),
});

export const exportFrequencySchema = z.enum(["manual", "monthly", "quarterly"]);
export const exportFormatSchema = z.enum(["json", "csv"]);

export const settingsApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  lastUsed: z.string().optional(),
});

export const settingsDataSchema = z.object({
  exportFrequency: exportFrequencySchema,
  exportFormat: exportFormatSchema,
  apiKeys: z.array(settingsApiKeySchema).max(20).optional(),
  requestExport: z.boolean().optional(),
  requestAccountDeletion: z.boolean().optional(),
  cancelAccountDeletion: z.boolean().optional(),
});

export type SettingsSection = z.infer<typeof settingsSectionSchema>;
export type ProfileSettingsInput = z.infer<typeof settingsProfileSchema>;
export type IdentitySettingsInput = z.infer<typeof settingsIdentitySchema>;
export type AccountSettingsInput = z.infer<typeof settingsAccountSchema>;
export type NotificationSettingsInput = z.infer<typeof settingsNotificationsSchema>;
export type PrivacySettingsInput = z.infer<typeof settingsPrivacySchema>;
export type FeedSettingsInput = z.infer<typeof settingsFeedSchema>;
export type AppearanceSettingsInput = z.infer<typeof settingsAppearanceSchema>;
export type CreditsSettingsInput = z.infer<typeof settingsCreditsSchema>;
export type ConnectionsSettingsInput = z.infer<typeof settingsConnectionsSchema>;
export type DataSettingsInput = z.infer<typeof settingsDataSchema>;

export type SettingsSectionPayloadMap = {
  profile: ProfileSettingsInput;
  identity: IdentitySettingsInput;
  account: AccountSettingsInput;
  notifications: NotificationSettingsInput;
  privacy: PrivacySettingsInput;
  feed: FeedSettingsInput;
  appearance: AppearanceSettingsInput;
  credits: CreditsSettingsInput;
  connections: ConnectionsSettingsInput;
  data: DataSettingsInput;
};

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "identity", label: "Identity" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "feed", label: "Feed" },
  { id: "appearance", label: "Appearance" },
  { id: "credits", label: "Credits" },
  { id: "connections", label: "Connections" },
  { id: "data", label: "Data" },
] as const;

export const SETTINGS_EXPERIENCE_LEVELS = [
  { value: "student", label: "Student" },
  { value: "emerging", label: "Emerging (0-2 years)" },
  { value: "intermediate", label: "Intermediate (2-5 years)" },
  { value: "advanced", label: "Advanced (5-10 years)" },
  { value: "senior", label: "Senior (10+ years)" },
] as const;

