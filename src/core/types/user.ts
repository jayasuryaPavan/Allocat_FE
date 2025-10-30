export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  phone?: string
  role: Role
  permissions: Permission[]
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  displayName: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  resource: string
  action: string
  description?: string
}

export interface UserSession {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  isCurrent: boolean
  lastActiveAt: string
  createdAt: string
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  acceptTerms: boolean
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  systemNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  dashboardLayout: {
    widgets: string[]
    columns: number
    gap: number
  }
  sidebarCollapsed: boolean
  itemsPerPage: number
  defaultCurrency: string
}

export interface UserResponse {
  user: User
  accessToken: string
  refreshToken: string
}

