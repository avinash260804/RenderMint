export interface ProfileSettings {
  displayName: string
  username: string
  bio: string
  avatarUrl: string
  coverImageUrl: string
  portfolioUrl: string
  location: string
  locationVisible: boolean
  socialLinks: {
    twitter?: string
    instagram?: string
    behance?: string
    linkedin?: string
    dribbble?: string
  }
}

export interface CreativeIdentitySettings {
  primaryDiscipline: string
  secondaryDisciplines: string[]
  experienceLevel: string
  softwareTools: string[]
  skills: string[]
  acceptCritique: boolean
  offerMentorship: boolean
}

export interface AccountSettings {
  email: string
  password?: string
  twoFactorEnabled: boolean
  activeSessions: Array<{
    id: string
    device: string
    location: string
    lastActive: string
  }>
  connectedAccounts: Array<{
    provider: string
    connected: boolean
    email?: string
  }>
}

export interface NotificationSettings {
  [key: string]: boolean
}

export interface PrivacySettings {
  profileVisible: boolean
  showOnlineStatus: boolean
  workVisible: boolean
  showActivity: boolean
  allowMessages: boolean
  messageSettings: 'everyone' | 'followers' | 'following'
}

export interface FeedSettings {
  showFollowing: boolean
  showTrending: boolean
  showCollaborations: boolean
  showOpportunities: boolean
  contentFilter: 'all' | 'disciplines' | 'following'
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  compact: boolean
  fontSize: 'small' | 'normal' | 'large'
}

export interface CreditsSettings {
  displayCredits: boolean
  creditNotificationEmail: string
  creditGoal: number
}

export interface ConnectionSettings {
  linkedAccounts: Array<{
    platform: string
    username: string
    connected: boolean
  }>
  syncSettings: boolean
}

export interface DataSettings {
  dataExportFormat: 'json' | 'csv'
  downloadData: boolean
  deleteAccount: boolean
}
