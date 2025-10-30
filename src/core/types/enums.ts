// User and Authentication Enums
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  LOCKED = 'locked'
}

export enum UserRoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  SALES = 'sales',
  INVENTORY = 'inventory',
  ACCOUNTING = 'accounting',
  CUSTOMER = 'customer'
}

export enum PermissionResource {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  STORE = 'store',
  PRODUCT = 'product',
  CATEGORY = 'category',
  INVENTORY = 'inventory',
  PURCHASE = 'purchase',
  SALE = 'sale',
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
  REPORT = 'report',
  SETTING = 'setting',
  AUDIT = 'audit'
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign'
}

// Product and Inventory Enums
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock'
}

export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
  BUNDLE = 'bundle',
  DIGITAL = 'digital',
  SERVICE = 'service'
}

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
  OVERSTOCK = 'overstock',
  RESERVED = 'reserved',
  DAMAGED = 'damaged',
  EXPIRED = 'expired'
}

export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
  RETURN = 'return',
  DAMAGE = 'damage',
  EXPIRY = 'expiry'
}

export enum StockMovementReason {
  PURCHASE = 'purchase',
  SALE = 'sale',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  DAMAGE = 'damage',
  EXPIRY = 'expiry',
  THEFT = 'theft',
  LOSS = 'loss',
  PROMOTION = 'promotion',
  SAMPLE = 'sample'
}

// Sales and POS Enums
export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CREDIT = 'credit',
  GIFT_CARD = 'gift_card',
  LOYALTY_POINTS = 'loyalty_points'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund'
}

export enum TransactionType {
  SALE = 'sale',
  RETURN = 'return',
  REFUND = 'refund',
  VOID = 'void',
  ADJUSTMENT = 'adjustment'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  BUY_X_GET_Y = 'buy_x_get_y',
  BULK_DISCOUNT = 'bulk_discount',
  COUPON = 'coupon'
}

// Purchase and Supplier Enums
export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  SENT = 'sent',
  RECEIVED = 'received',
  PARTIAL_RECEIVED = 'partial_received',
  CANCELLED = 'cancelled'
}

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLACKLISTED = 'blacklisted'
}

export enum GRNStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Customer Enums
export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  VIP = 'vip',
  WHOLESALE = 'wholesale'
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLACKLISTED = 'blacklisted'
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

// Report Enums
export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  FINANCIAL = 'financial',
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
  PRODUCT = 'product',
  STAFF = 'staff',
  AUDIT = 'audit'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

// System Enums
export enum SystemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended'
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum LogType {
  SYSTEM = 'system',
  USER = 'user',
  API = 'api',
  SECURITY = 'security',
  BUSINESS = 'business'
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  BUSINESS = 'business'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook'
}

// Theme and UI Enums
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  ZH = 'zh',
  JA = 'ja',
  KO = 'ko',
  AR = 'ar',
  HI = 'hi',
  RU = 'ru'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
  BRL = 'BRL',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  SEK = 'SEK',
  NOK = 'NOK',
  DKK = 'DKK',
  PLN = 'PLN',
  CZK = 'CZK',
  HUF = 'HUF',
  RON = 'RON',
  BGN = 'BGN',
  HRK = 'HRK',
  TRY = 'TRY',
  RUB = 'RUB',
  ZAR = 'ZAR',
  NGN = 'NGN',
  EGP = 'EGP',
  KES = 'KES',
  GHS = 'GHS',
  TZS = 'TZS',
  UGX = 'UGX',
  MXN = 'MXN',
  ARS = 'ARS',
  CLP = 'CLP',
  COP = 'COP',
  PEN = 'PEN',
  UYU = 'UYU',
  VEF = 'VEF',
  KRW = 'KRW',
  THB = 'THB',
  SGD = 'SGD',
  MYR = 'MYR',
  IDR = 'IDR',
  PHP = 'PHP',
  VND = 'VND'
}

export enum DateFormat {
  MM_DD_YYYY = 'MM/DD/YYYY',
  DD_MM_YYYY = 'DD/MM/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
  DD_MMM_YYYY = 'DD MMM YYYY',
  MMM_DD_YYYY = 'MMM DD, YYYY',
  YYYY_MM_DD_HH_MM = 'YYYY-MM-DD HH:mm',
  DD_MM_YYYY_HH_MM = 'DD/MM/YYYY HH:mm'
}

export enum TimeFormat {
  HOUR_12 = '12h',
  HOUR_24 = '24h'
}

// File and Media Enums
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  CODE = 'code',
  OTHER = 'other'
}

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  WEBP = 'webp',
  SVG = 'svg',
  BMP = 'bmp',
  TIFF = 'tiff'
}

export enum DocumentFormat {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  PPT = 'ppt',
  PPTX = 'pptx',
  TXT = 'txt',
  RTF = 'rtf',
  CSV = 'csv'
}

// Integration Enums
export enum IntegrationType {
  PAYMENT_GATEWAY = 'payment_gateway',
  ACCOUNTING_SOFTWARE = 'accounting_software',
  INVENTORY_SYSTEM = 'inventory_system',
  ECOMMERCE_PLATFORM = 'ecommerce_platform',
  CRM_SYSTEM = 'crm_system',
  EMAIL_SERVICE = 'email_service',
  SMS_SERVICE = 'sms_service',
  ANALYTICS = 'analytics',
  BACKUP_SERVICE = 'backup_service',
  SECURITY_SERVICE = 'security_service'
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CONFIGURING = 'configuring',
  ERROR = 'error',
  PENDING = 'pending'
}

// Audit and Compliance Enums
export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  SUSPEND = 'suspend',
  UNSUSPEND = 'unsuspend',
  RESET_PASSWORD = 'reset_password',
  CHANGE_PASSWORD = 'change_password'
}

export enum ComplianceType {
  GDPR = 'gdpr',
  CCPA = 'ccpa',
  HIPAA = 'hipaa',
  SOX = 'sox',
  PCI_DSS = 'pci_dss',
  ISO27001 = 'iso27001',
  SOC2 = 'soc2'
}

// Business Process Enums
export enum WorkflowStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Device and Hardware Enums
export enum DeviceType {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
  KIOSK = 'kiosk',
  POS_TERMINAL = 'pos_terminal',
  BARCODE_SCANNER = 'barcode_scanner',
  RECEIPT_PRINTER = 'receipt_printer',
  CASH_DRAWER = 'cash_drawer',
  CARD_READER = 'card_reader'
}

export enum PrinterType {
  THERMAL = 'thermal',
  LASER = 'laser',
  INKJET = 'inkjet',
  DOT_MATRIX = 'dot_matrix',
  VIRTUAL = 'virtual'
}

export enum ScannerType {
  LASER = 'laser',
  CCD = 'ccd',
  CAMERA = 'camera',
  MAGNETIC = 'magnetic',
  RFID = 'rfid',
  NFC = 'nfc'
}