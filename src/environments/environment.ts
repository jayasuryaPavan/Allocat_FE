export const environment = {
  production: false,
  development: true,
  apiUrl: 'http://localhost:8080/api', // Use relative URL to leverage Vite proxy in development
  wsUrl: 'ws://localhost:8080/ws',
  appName: 'Allocat mERP',
  version: '1.0.0',
  enableDebugTools: true,
  logLevel: 'debug',
  enableServiceWorker: false,
  enablePWA: false,
  enableAnalytics: false,
  enableErrorReporting: false,
  features: {
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableDarkMode: true,
    enableMultiLanguage: true,
    enableBarcodeScanner: true,
    enableReceiptPrinting: true,
    enableInventoryTracking: true,
    enableCustomerLoyalty: true,
    enableAdvancedReports: true,
    enableDevBypass: false
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxBulkImportRows: 1000,
    maxSearchResults: 100,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  },
  integrations: {
    enablePaymentGateway: false,
    enableInventorySync: false,
    enableAccountingIntegration: false,
    enableEmailNotifications: false,
    enableSMSService: false
  },
  security: {
    enableTwoFactorAuth: false,
    enablePasswordPolicy: true,
    enableSessionManagement: true,
    enableAuditLogging: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  }
};
