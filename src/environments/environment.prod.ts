export const environment = {
  production: true,
  apiUrl: 'https://allocat-gateway-140766457860.northamerica-northeast2.run.app/api',
  wsUrl: 'wss://allocat-gateway-140766457860.northamerica-northeast2.run.app/ws',
  appName: 'Allocat mERP',
  version: '1.0.0',
  enableDebugTools: false,
  logLevel: 'error',
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
    maxBulkImportRows: 1000,
    maxSearchResults: 100,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  },
  integrations: {
    enablePaymentGateway: true,
    enableInventorySync: true,
    enableAccountingIntegration: true,
    enableEmailNotifications: true,
    enableSMSService: true
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
