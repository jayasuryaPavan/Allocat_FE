import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/core/stores/auth'
import { useLoadingStore } from '@/core/stores/loading'
import { useNotificationStore } from '@/core/stores/notification'
import { environment } from '@/environments'

export class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore()
        const loadingStore = useLoadingStore()

        // Add auth token if not explicitly provided
        const token = authStore.getToken()
        const hasAuthHeader = !!config.headers?.Authorization
        if (token && !hasAuthHeader) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Attach active store code header if present
        const activeStoreCode = localStorage.getItem('active_store_code')
        if (activeStoreCode) {
          config.headers['X-Store-Code'] = activeStoreCode
        }

        // Show loading for non-GET requests
        if (config.method !== 'get') {
          loadingStore.startLoading()
        }

        return config
      },
      (error) => {
        const loadingStore = useLoadingStore()
        loadingStore.stopLoading()
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const loadingStore = useLoadingStore()
        loadingStore.stopLoading()
        return response
      },
      async (error) => {
        const loadingStore = useLoadingStore()
        const authStore = useAuthStore()
        const notificationStore = useNotificationStore()

        loadingStore.stopLoading()

        const originalRequest = error.config

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          // Skip refresh for the refresh endpoint itself or logout to avoid infinite loop
          if (originalRequest?.url?.includes('/auth/refresh') || originalRequest?.url?.includes('/auth/logout')) {
            console.error('Refresh token expired or invalid')
            authStore.logout(true)
            return Promise.reject(error)
          }

          // Try to refresh token only once per request
          if (originalRequest && !originalRequest._retry) {
            originalRequest._retry = true

            try {
              const newToken = await authStore.refreshToken()
              // Update the authorization header with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              // Retry the original request
              return this.axiosInstance(originalRequest)
            } catch (refreshError) {
              // Refresh failed, logout user
              console.error('Token refresh failed:', refreshError)
              authStore.logout(true)
              return Promise.reject(refreshError)
            }
          }
        }

        // Handle other errors
        if (error.response?.status >= 500) {
          notificationStore.error('Server Error', 'Something went wrong. Please try again later.')
        } else if (error.response?.status === 403) {
          notificationStore.error('Access Denied', 'You do not have permission to perform this action.')
        } else if (error.response?.status === 404) {
          // Skip notification for gemini-key endpoint - it's handled by Settings page
          const url = error.config?.url || ''
          if (!url.includes('/settings/gemini-key')) {
            notificationStore.error('Not Found', 'The requested resource was not found.')
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config)
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config)
  }

  // File upload
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })
  }

  // Download file
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Set base URL
  setBaseURL(baseURL: string) {
    this.axiosInstance.defaults.baseURL = baseURL
  }

  // Set default headers
  setDefaultHeaders(headers: Record<string, string>) {
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  // Get axios instance (for advanced usage)
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Create singleton instance
const apiService = new ApiService()

// Export function to use the service
export const useApiService = () => apiService

