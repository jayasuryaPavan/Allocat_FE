import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'
import { useNotificationStore } from './notification'
import { useApiService } from '@/core/services/api'
import { environment } from '@/environments'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData, 
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  UserPreferences
} from '@/core/types/user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const redirectUrl = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => isAuthenticated.value && !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role?.name || null)
  const userPermissions = computed(() => currentUser.value?.permissions || [])

  // Services
  const apiService = useApiService()
  const notificationStore = useNotificationStore()
  const router = useRouter()

  // Initialize auth state from stored tokens
  const initializeAuth = () => {
    // Development bypass - auto-login with mock user
    if (environment.features.enableDevBypass && environment.development) {
      const mockUser: User = {
        id: 'dev-user-001',
        email: 'surya@allocat.com',
        firstName: 'Surya',
        lastName: 'Akula',
        fullName: 'Surya Akula',
        avatar: `https://ui-avatars.com/api/?name=Surya+Akula&background=3b82f6&color=ffffff`,
        role: { id: '1', name: 'admin', displayName: 'Administrator', permissions: [{
          resource: '*', action: '*',
          id: '1'
        }] },
        permissions: [{
          resource: '*', action: '*',
          id: '1'
        }], // All permissions
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      currentUser.value = mockUser
      isAuthenticated.value = true
      console.log('🚀 Development bypass enabled - Auto-logged in as Dev User')
      return
    }

    const token = getToken()
    const user = getStoredUser()

    if (token && !isTokenExpired(token) && user) {
      currentUser.value = user
      isAuthenticated.value = true
      startTokenRefreshTimer()
    } else {
      logout()
    }
  }

  // Login
  const login = async (credentials: LoginCredentials): Promise<User> => {
    isLoading.value = true

    try {
      const response = await apiService.post('/auth/login', credentials)
      const apiResp = response.data
      if (!apiResp?.success) {
        throw new Error(apiResp?.error || 'Login failed')
      }
      const data = apiResp.data

      // Persist tokens
      setToken(data.accessToken)
      setRefreshToken(data.refreshToken)

      // Store the store code in session storage
      if (data.storeCode) {
        sessionStorage.setItem('active_store_code', data.storeCode)
        localStorage.setItem('active_store_code', data.storeCode)
      }

      // Map user into our shape as much as possible
      const mappedUser: User = {
        id: String(data.userId ?? ''),
        email: data.email ?? '',
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' ') || (data.username ?? ''),
        avatar: `https://ui-avatars.com/api/?name=${data.firstName || ''}+${data.lastName || ''}&background=3b82f6&color=ffffff` ,
        phone: data.phone ?? undefined,
        role: { id: 'role', name: String(data.role || ''), displayName: String(data.role || ''), permissions: (data.permissions || []).map((p: string, idx: number) => ({ id: String(idx), resource: p.split(':')[0] || '*', action: p.split(':')[1] || '*' })) },
        permissions: (data.permissions || []).map((p: string, idx: number) => ({ id: String(idx), resource: p.split(':')[0] || '*', action: p.split(':')[1] || '*' })),
        isActive: data.isActive ?? true,
        isEmailVerified: true,
        lastLoginAt: data.lastLoginAt ?? new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setCurrentUser(mappedUser)
      isAuthenticated.value = true
      startTokenRefreshTimer()
      
      notificationStore.success(apiResp.message || 'Login successful', 'Welcome back!')

      // Optionally hydrate full user profile
      try { await fetchCurrentUser() } catch {}

      const redirect = redirectUrl.value || '/dashboard'
      clearRedirectUrl()
      router.push(redirect)
      
      return mappedUser
    } catch (error: any) {
      notificationStore.error('Login failed', error.response?.data?.message || 'Invalid credentials')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Register
  const register = async (userData: RegisterData): Promise<User> => {
    isLoading.value = true

    try {
      const response = await apiService.post('/auth/register', userData)
      const user = response.data.user

      notificationStore.success('Registration successful', 'Please check your email to verify your account')
      return user
    } catch (error: any) {
      notificationStore.error('Registration failed', error.response?.data?.message || 'Registration failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Call backend logout endpoint with Authorization header
      await apiService.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors - clear tokens on client side anyway
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local data regardless of API response
      clearAuthData()
      currentUser.value = null
      isAuthenticated.value = false
      stopTokenRefreshTimer()
      
      router.push('/auth/login')
      notificationStore.info('Logged out', 'You have been successfully logged out')
    }
  }

  // Refresh token
  const refreshToken = async (): Promise<string> => {
    const refreshTok = getRefreshToken()
    
    if (!refreshTok) {
      console.error('No refresh token available')
      await logout()
      throw new Error('No refresh token available')
    }

    try {
      console.log('Attempting to refresh token...')
      // Use the axios instance directly to bypass the regular interceptor
      const axios = apiService.getAxiosInstance()
      const resp = await axios.post('/auth/refresh', undefined, {
        headers: { 
          Authorization: `Bearer ${refreshTok}`,
          'Content-Type': 'application/json'
        },
        // Skip the retry flag to prevent interceptor from interfering
        skipAuthRefresh: true
      } as any)
      
      const apiResp = resp.data
      console.log('Refresh response:', apiResp)
      
      if (!apiResp?.success) {
        throw new Error(apiResp?.error || 'Failed to refresh token')
      }
      
      const data = apiResp.data
      const newToken = data.accessToken

      if (!newToken) {
        throw new Error('No access token in refresh response')
      }

      setToken(newToken)
      
      // Update refresh token if provided
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken)
      }
      
      startTokenRefreshTimer()
      console.log('Token refreshed successfully')
      
      return newToken
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message)
      await logout()
      throw error
    }
  }

  // Fetch current user
  const fetchCurrentUser = async (): Promise<User> => {
    try {
      const response = await apiService.get('/auth/me')
      const apiResp = response.data
      if (!apiResp?.success) {
        throw new Error(apiResp?.error || 'Failed to load user')
      }
      const data = apiResp.data
      
      // Save all user details to session storage for later use
      sessionStorage.setItem('user_details', JSON.stringify(data))
      
      // Save store code to session storage
      if (data.storeCode) {
        sessionStorage.setItem('active_store_code', data.storeCode)
        localStorage.setItem('active_store_code', data.storeCode)
      }
      
      const user: User = {
        id: String(data.userId ?? ''),
        email: data.email ?? '',
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' ') || (data.username ?? ''),
        avatar: `https://ui-avatars.com/api/?name=${data.firstName || ''}+${data.lastName || ''}&background=3b82f6&color=ffffff`,
        phone: data.phone ?? undefined,
        role: { id: String(data.roleId ?? ''), name: String(data.role || ''), displayName: String(data.role || ''), permissions: (data.permissions || []).map((p: string, idx: number) => ({ id: String(idx), resource: p.split(':')[0] || '*', action: p.split(':')[1] || '*' })) },
        permissions: (data.permissions || []).map((p: string, idx: number) => ({ id: String(idx), resource: p.split(':')[0] || '*', action: p.split(':')[1] || '*' })),
        isActive: data.isActive ?? true,
        isEmailVerified: true,
        lastLoginAt: data.lastLoginAt ?? new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setCurrentUser(user)
      isAuthenticated.value = true
      return user
    } catch (error) {
      throw error as any
    }
  }

  // Forgot password
  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    isLoading.value = true

    try {
      await apiService.post('/auth/forgot-password', data)
      notificationStore.success('Password reset email sent', 'Please check your email for instructions')
    } catch (error: any) {
      notificationStore.error('Failed to send reset email', error.response?.data?.message || 'Failed to send reset email')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Reset password
  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    isLoading.value = true

    try {
      await apiService.post('/auth/reset-password', data)
      notificationStore.success('Password reset successful', 'You can now login with your new password')
      router.push('/auth/login')
    } catch (error: any) {
      notificationStore.error('Password reset failed', error.response?.data?.message || 'Password reset failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Change password
  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    isLoading.value = true

    try {
      await apiService.post('/auth/change-password', data)
      notificationStore.success('Password changed', 'Your password has been successfully changed')
    } catch (error: any) {
      notificationStore.error('Password change failed', error.response?.data?.message || 'Password change failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Update profile
  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    isLoading.value = true

    try {
      const response = await apiService.put('/auth/profile', data)
      const user = response.data.user

      setCurrentUser(user)
      notificationStore.success('Profile updated', 'Your profile has been successfully updated')
      return user
    } catch (error: any) {
      notificationStore.error('Profile update failed', error.response?.data?.message || 'Profile update failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Permission checks
  const hasPermission = (resource: string, action: string): boolean => {
    const user = currentUser.value
    if (!user || !user.permissions) {
      return false
    }

    return user.permissions.some(permission => 
      permission.resource === resource && permission.action === action
    )
  }

  const hasAnyPermissions = (permissions: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true
    const user = currentUser.value
    if (!user || !user.permissions) return false
    // SUPER_ADMIN bypass
    if (String(user.role?.name || '').toUpperCase() === 'SUPER_ADMIN') return true
    // Permissions are strings like "resource:action"
    return permissions.some((p) => {
      const [res, act] = p.split(':')
      return user.permissions.some(up => (up.resource === res || up.resource === '*') && (up.action === act || up.action === '*'))
    })
  }

  const hasRole = (roleName: string): boolean => {
    const user = currentUser.value
    if (!user?.role?.name) return false
    const userRole = String(user.role.name).toUpperCase()
    // SUPER_ADMIN has access to everything
    if (userRole === 'SUPER_ADMIN') return true
    return userRole === String(roleName).toUpperCase()
  }

  const hasAnyRole = (roleNames: string[]): boolean => {
    const user = currentUser.value
    if (!user?.role?.name) return false
    const userRole = String(user.role.name).toUpperCase()
    if (userRole === 'SUPER_ADMIN') return true
    if (!roleNames || roleNames.length === 0) return false
    if (roleNames.includes('*')) return true
    return roleNames.some(r => String(r).toUpperCase() === userRole)
  }

  // User preferences
  const getUserPreferences = (): UserPreferences => {
    const preferences = localStorage.getItem('user_preferences')
    if (preferences) {
      return JSON.parse(preferences)
    }

    // Return default preferences
    return {
      theme: 'light',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      systemNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      dashboardLayout: {
        widgets: [],
        columns: 3,
        gap: 16
      },
      sidebarCollapsed: false,
      itemsPerPage: 10,
      defaultCurrency: 'USD'
    }
  }

  const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const currentPreferences = getUserPreferences()
    const updatedPreferences = { ...currentPreferences, ...preferences }
    
    localStorage.setItem('user_preferences', JSON.stringify(updatedPreferences))
    
    try {
      const response = await apiService.put('/auth/preferences', updatedPreferences)
      const prefs = response.data.preferences
      
      localStorage.setItem('user_preferences', JSON.stringify(prefs))
      notificationStore.success('Preferences updated', 'Your preferences have been saved')
      
      return prefs
    } catch (error: any) {
      notificationStore.error('Failed to update preferences', error.response?.data?.message || 'Failed to update preferences')
      throw error
    }
  }

  // Token management
  const getToken = (): string | null => {
    return localStorage.getItem('access_token')
  }

  const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token')
  }

  const setToken = (token: string): void => {
    localStorage.setItem('access_token', token)
  }

  const setRefreshToken = (token: string): void => {
    localStorage.setItem('refresh_token', token)
  }

  const setCurrentUser = (user: User): void => {
    currentUser.value = user
    localStorage.setItem('current_user', JSON.stringify(user))
  }

  const getStoredUser = (): User | null => {
    const user = localStorage.getItem('current_user')
    return user ? JSON.parse(user) : null
  }

  const setRedirectUrl = (url: string): void => {
    redirectUrl.value = url
    localStorage.setItem('redirect_url', url)
  }

  const getRedirectUrl = (): string | null => {
    return redirectUrl.value || localStorage.getItem('redirect_url')
  }

  const clearRedirectUrl = (): void => {
    redirectUrl.value = null
    localStorage.removeItem('redirect_url')
  }

  const clearAuthData = (): void => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_user')
    localStorage.removeItem('redirect_url')
    localStorage.removeItem('active_store_code')
    sessionStorage.removeItem('active_store_code')
    sessionStorage.removeItem('user_details')
  }

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode(token) as any
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch {
      return true
    }
  }

  // Token refresh timer
  let tokenRefreshTimer: number | undefined

  const startTokenRefreshTimer = (): void => {
    stopTokenRefreshTimer()
    
    const token = getToken()
    if (!token) return

    try {
      const decoded = jwtDecode(token) as any
      const now = Date.now()
      const timeUntilExpiry = (decoded.exp * 1000) - now
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000) // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        tokenRefreshTimer = window.setTimeout(() => {
          refreshToken().catch(() => {
            // Token refresh failed, user will be logged out
          })
        }, refreshTime)
      }
    } catch {
      // Invalid token, logout
      logout()
    }
  }

  const stopTokenRefreshTimer = (): void => {
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer)
      tokenRefreshTimer = undefined
    }
  }

  // Initialize auth on store creation
  initializeAuth()

  return {
    // State
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    
    // Getters
    isLoggedIn,
    userRole,
    userPermissions,
    
    // Actions
    getToken,
    initializeAuth,
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    hasPermission,
    hasRole,
    hasAnyRole,
    getUserPreferences,
    updateUserPreferences,
    setRedirectUrl,
    getRedirectUrl,
    clearRedirectUrl,
    hasAnyPermissions
  }
})

