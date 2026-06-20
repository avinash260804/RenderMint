/**
 * API Client for Settings operations
 * 
 * In production, these would call the real Atelier backend APIs:
 * - /api/profiles/me (GET, PATCH)
 * - /api/settings/* (POST)
 * 
 * This mock implementation simulates the API responses following
 * the Atelier architecture patterns from src/modules/*/server
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Simulates API call with network delay
 * In production, this would use fetch or axios
 */
async function apiCall<T>(
  method: string,
  endpoint: string,
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In production, would be:
  // const response = await fetch(`/api${endpoint}`, {
  //   method,
  //   headers: { 'Content-Type': 'application/json' },
  //   body: body ? JSON.stringify(body) : undefined,
  // })
  // return response.json()

  return {
    success: true,
    data: body as T,
  }
}

export const settingsApi = {
  // Profile endpoints
  getProfile: () => apiCall('GET', '/profiles/me'),
  updateProfile: (data: Record<string, any>) => apiCall('PATCH', '/profiles/me', data),

  // Settings endpoints (following Atelier module pattern)
  updateNotifications: (data: Record<string, any>) => apiCall('POST', '/settings/notifications', data),
  updatePrivacy: (data: Record<string, any>) => apiCall('POST', '/settings/privacy', data),
  updateAppearance: (data: Record<string, any>) => apiCall('POST', '/settings/appearance', data),
  updateFeedPreferences: (data: Record<string, any>) => apiCall('POST', '/settings/feed', data),
  updateConnections: (data: Record<string, any>) => apiCall('POST', '/settings/connections', data),

  // Account endpoints
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiCall('POST', '/account/password', data),
  updateEmail: (data: { newEmail: string }) => apiCall('POST', '/account/email', data),
  enable2FA: () => apiCall('POST', '/account/2fa/enable'),
  disable2FA: () => apiCall('POST', '/account/2fa/disable'),

  // Data endpoints
  exportData: () => apiCall('POST', '/data/export'),
  deleteAccount: () => apiCall('POST', '/account/delete'),
}
