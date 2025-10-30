export const environment = {
  production: false,
  apiUrl: 'https://api-staging.allocat.com/api',
  wsUrl: 'wss://api-staging.allocat.com/ws',
  appName: 'Allocat - Staging',
  version: '1.0.0-staging',
  enableDebugTools: false,
  logLevel: 'info',
  enableServiceWorker: true,
  enablePWA: true,
  enableAnalytics: true,
  enableErrorReporting: true,
  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableDarkMode: true,
    enableMultiLanguage: true,
    enableBarcodeScanner: true,
    enableReceiptPrinting: true,
    enableInventoryTracking: true,
    enableCustomerLoyalty: true,
    enableAdvancedReports: true
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxBulkImportRows: 500,
    maxSearchResults: 100,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  },
  integrations: {
    enablePaymentGateway: true,
    enableInventorySync: true,
    enableAccountingIntegration: false,
    enableEmailNotifications: true,
    enableSMSService: false
  },
  security: {
    enableTwoFactorAuth: true,
    enablePasswordPolicy: true,
    enableSessionManagement: true,
    enableAuditLogging: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  }
};
