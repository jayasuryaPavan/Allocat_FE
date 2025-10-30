export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T = any> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface RequestConfig {
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  onUploadProgress?: (progress: number) => void
}

