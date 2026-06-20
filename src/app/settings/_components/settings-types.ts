import type {
  AppearanceSettingsInput,
  ConnectionsSettingsInput,
  CreditsSettingsInput,
  FeedSettingsInput,
  IdentitySettingsInput,
  NotificationSettingsInput,
  PrivacySettingsInput,
  ProfileSettingsInput,
} from "@/modules/settings/schemas/settings-schema";

export type SettingsProfileForm = ProfileSettingsInput;
export type SettingsIdentityForm = IdentitySettingsInput;

export type SettingsAccountForm = {
  email: string;
  twoFactorEnabled: boolean;
  activeSessions: Array<{
    id: string;
    device: string;
    username?: string;
    lastActive?: string;
  }>;
  connectedAccounts: Array<{
    provider: string;
    connected: boolean;
    username?: string;
  }>;
  password?: string;
  revokeSessionIds?: string[];
};

export type SettingsNotificationsForm = NotificationSettingsInput;
export type SettingsPrivacyForm = PrivacySettingsInput;
export type SettingsFeedForm = FeedSettingsInput;
export type SettingsAppearanceForm = AppearanceSettingsInput;
export type SettingsCreditsForm = CreditsSettingsInput;
export type SettingsConnectionsForm = ConnectionsSettingsInput;

export type SettingsDataForm = {
  exportFrequency: "manual" | "monthly" | "quarterly";
  exportFormat: "json" | "csv";
  lastExportDate: string | null;
  apiKeys: Array<{
    id: string;
    name: string;
    createdAt: string;
    lastUsed?: string;
  }>;
  accountDeletionRequested: boolean;
  accountDeletionDate: string | null;
  requestExport?: boolean;
  requestAccountDeletion?: boolean;
  cancelAccountDeletion?: boolean;
};

export type SettingsIdentityMeta = {
  disciplines: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
  softwares: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
  experienceLevels: Array<{
    value: "student" | "emerging" | "intermediate" | "advanced" | "senior";
    label: string;
  }>;
};
