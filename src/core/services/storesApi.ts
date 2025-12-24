import { ApiService } from './api'
import type { ApiResponse } from '../types/api'

export interface StoreItem {
  id: number
  code: string
  name: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  taxId?: string
  currency?: string
  timezone?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ValidateAccessRequest {
  storeId?: number
  storeCode?: string
  accessCode: string
}

const api = new ApiService()

export interface CreateStoreRequest {
  code: string
  name: string
  accessCode: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  taxId?: string
  currency?: string
  timezone?: string
}

export interface UpdateStoreRequest {
  name?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  taxId?: string
  currency?: string
  timezone?: string
  isActive?: boolean
  accessCode: string // Required for update
}

export class StoresApiService {
  /**
   * Get all stores (SUPER_ADMIN only)
   */
  static async list(params?: { active?: boolean }): Promise<ApiResponse<StoreItem[]>> {
    const query = params?.active !== undefined ? `?active=${params.active}` : ''
    const resp = await api.get(`/stores${query}`)
    return resp.data
  }

  /**
   * Get store by ID (SUPER_ADMIN only)
   */
  static async getById(storeId: number): Promise<ApiResponse<StoreItem>> {
    const resp = await api.get(`/stores/${storeId}`)
    return resp.data
  }

  /**
   * Get store by code (SUPER_ADMIN only)
   */
  static async getByCode(storeCode: string): Promise<ApiResponse<StoreItem>> {
    const resp = await api.get(`/stores/code/${encodeURIComponent(storeCode)}`)
    return resp.data
  }

  /**
   * Create a new store (SUPER_ADMIN only)
   */
  static async create(store: CreateStoreRequest): Promise<ApiResponse<StoreItem>> {
    const resp = await api.post('/stores', store)
    return resp.data
  }

  /**
   * Update store (SUPER_ADMIN only, requires access code)
   */
  static async update(storeId: number, store: UpdateStoreRequest): Promise<ApiResponse<StoreItem>> {
    const resp = await api.put(`/stores/${storeId}`, store)
    return resp.data
  }

  /**
   * Delete store (SUPER_ADMIN only, requires access code)
   */
  static async delete(storeId: number, accessCode: string): Promise<ApiResponse<void>> {
    const resp = await api.delete(`/stores/${storeId}`, {
      data: { accessCode }
    })
    return resp.data
  }

  /**
   * Validate store access code (SUPER_ADMIN only)
   */
  static async validateAccess(payload: ValidateAccessRequest): Promise<ApiResponse<boolean>> {
    const resp = await api.post('/stores/validate-access', payload)
    return resp.data
  }
}
