export const environment = {
  production: false,
  staging: false,
  development: true,
  apiUrl: ((window as any).env?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '') + '/api', // Ensure /api suffix
  appName: 'Allocat mERP',
  version: '1.0.0',
  features: {
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
    enableDevBypass: false // Enable development bypass for authentication
  },
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    preferencesKey: 'user_preferences'
  },
  storage: {
    type: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'
    prefix: 'allocat_'
  },
  ui: {
    defaultTheme: 'light',
    defaultLanguage: 'en',
    itemsPerPage: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    supportedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  integrations: {
    enableInvenGaduAssist: true,
    invenGaduSearchUrl: '',
    enableAICsvMapping: true, // Enable AI-powered CSV column mapping
    xtractorApiUrl: 'http://localhost:8000', // Xtractor Agent API endpoint
    enablePdfExtraction: true // Enable PDF table extraction
  }
}

