export const environment = {
  production: false,
  staging: true,
  development: false,
  apiUrl: import.meta.env.VITE_API_URL || 'https://staging-api.allocat.com/api',
  appName: 'Allocat (Staging)',
  version: '1.0.0',
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: false
  },
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    preferencesKey: 'user_preferences'
  },
  storage: {
    type: 'localStorage',
    prefix: 'allocat_staging_'
  },
  ui: {
    defaultTheme: 'light',
    defaultLanguage: 'en',
    itemsPerPage: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    supportedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
}

