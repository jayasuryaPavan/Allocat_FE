export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'ws://localhost:8080/ws',
  appName: 'Allocat mERP - Development',
  version: '1.0.0-dev',
  enableDebugTools: true,
  logLevel: 'debug',
  enableServiceWorker: false,
  enablePWA: false,
  enableAnalytics: false,
  enableErrorReporting: true,
  features: {
    enableOfflineMode: true,
    enablePushNotifications: false,
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
    maxBulkImportRows: 100,
    maxSearchResults: 50,
    sessionTimeout: 60 * 60 * 1000, // 60 minutes
    cacheTimeout: 2 * 60 * 1000 // 2 minutes
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
    enablePasswordPolicy: false,
    enableSessionManagement: true,
    enableAuditLogging: true,
    maxLoginAttempts: 10,
    lockoutDuration: 5 * 60 * 1000 // 5 minutes
  }
};
