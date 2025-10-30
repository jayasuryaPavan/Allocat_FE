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

export class StoresApiService {
  static async list(params?: { active?: boolean }): Promise<ApiResponse<StoreItem[]>> {
    const query = params?.active !== undefined ? `?active=${params.active}` : ''
    const resp = await api.get(`/stores${query}`)
    return resp.data
  }

  static async getById(storeId: number): Promise<ApiResponse<StoreItem>> {
    const resp = await api.get(`/stores/${storeId}`)
    return resp.data
  }

  static async getByCode(storeCode: string): Promise<ApiResponse<StoreItem>> {
    const resp = await api.get(`/stores/code/${encodeURIComponent(storeCode)}`)
    return resp.data
  }

  static async validateAccess(payload: ValidateAccessRequest): Promise<ApiResponse<boolean>> {
    const resp = await api.post('/stores/validate-access', payload)
    return resp.data
  }
}
