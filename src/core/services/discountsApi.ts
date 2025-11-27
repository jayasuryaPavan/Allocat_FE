import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'

export interface Discount {
  id: number
  code: string
  name: string
  description?: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
  createdAt?: string
  updatedAt?: string
}

class DiscountsApiService {
  private readonly baseUrl = '/discounts'
  private apiService = useApiService()

  /**
   * Get all discounts
   */
  async getAllDiscounts(activeOnly?: boolean): Promise<ApiResponse<Discount[]>> {
    try {
      const queryParams = activeOnly !== undefined 
        ? `?activeOnly=${activeOnly}` 
        : ''
      const response = await this.apiService.get<ApiResponse<Discount[]>>(`${this.baseUrl}${queryParams}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch discounts'
      }
    }
  }

  /**
   * Get discount by code
   */
  async getDiscountByCode(code: string): Promise<ApiResponse<Discount>> {
    try {
      const response = await this.apiService.get<ApiResponse<Discount>>(`${this.baseUrl}/code/${encodeURIComponent(code)}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch discount'
      }
    }
  }

  /**
   * Create a new discount
   */
  async createDiscount(discount: Omit<Discount, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<ApiResponse<Discount>> {
    try {
      const response = await this.apiService.post<ApiResponse<Discount>>(this.baseUrl, discount)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to create discount'
      }
    }
  }

  /**
   * Update an existing discount
   */
  async updateDiscount(id: number, discount: Partial<Discount>): Promise<ApiResponse<Discount>> {
    try {
      const response = await this.apiService.put<ApiResponse<Discount>>(`${this.baseUrl}/${id}`, discount)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to update discount'
      }
    }
  }

  /**
   * Deactivate a discount
   */
  async deactivateDiscount(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiService.put<ApiResponse<void>>(`${this.baseUrl}/${id}/deactivate`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to deactivate discount'
      }
    }
  }
}

export const discountsApiService = new DiscountsApiService()

