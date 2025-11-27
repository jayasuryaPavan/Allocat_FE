import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'

export interface SalesSummary {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  totalTax: number
  totalDiscounts: number
  netSales: number
}

export interface SalesTrendData {
  period: string
  sales: number
  orders: number
}

export interface SalesTrendResponse {
  trends: SalesTrendData[]
  periodType: 'daily' | 'weekly' | 'monthly'
}

export interface CashierPerformance {
  cashierId: number
  cashierName: string
  totalSales: number
  orderCount: number
  averageOrderValue: number
  averageTransactionTime?: number
}

export interface TopProduct {
  productId: number
  productName: string
  productCode: string
  quantitySold: number
  revenue: number
}

export interface TopProductsResponse {
  products: TopProduct[]
  sortBy: 'quantity' | 'revenue'
}

export interface LowStockAlert {
  productId: number
  productName: string
  productCode: string
  currentStock: number
  minimumStockLevel: number
  shortage: number
}

class AnalyticsApiService {
  private readonly baseUrl = '/analytics'
  private apiService = useApiService()

  /**
   * Get sales summary for a date range
   */
  async getSalesSummary(params: {
    storeId: number
    startDate: string // ISO date format (YYYY-MM-DD)
    endDate: string // ISO date format (YYYY-MM-DD)
  }): Promise<ApiResponse<SalesSummary>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      queryParams.append('startDate', params.startDate)
      queryParams.append('endDate', params.endDate)

      const response = await this.apiService.get<ApiResponse<SalesSummary>>(
        `${this.baseUrl}/sales/summary?${queryParams.toString()}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch sales summary'
      }
    }
  }

  /**
   * Get sales trends over time
   */
  async getSalesTrends(params: {
    storeId: number
    startDate: string // ISO date format (YYYY-MM-DD)
    endDate: string // ISO date format (YYYY-MM-DD)
    periodType?: 'daily' | 'weekly' | 'monthly'
  }): Promise<ApiResponse<SalesTrendResponse>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      queryParams.append('startDate', params.startDate)
      queryParams.append('endDate', params.endDate)
      if (params.periodType) {
        queryParams.append('periodType', params.periodType)
      }

      const response = await this.apiService.get<ApiResponse<SalesTrendResponse>>(
        `${this.baseUrl}/sales/trends?${queryParams.toString()}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch sales trends'
      }
    }
  }

  /**
   * Get cashier performance metrics
   */
  async getCashierPerformance(params: {
    storeId: number
    startDate: string // ISO date format (YYYY-MM-DD)
    endDate: string // ISO date format (YYYY-MM-DD)
  }): Promise<ApiResponse<CashierPerformance[]>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      queryParams.append('startDate', params.startDate)
      queryParams.append('endDate', params.endDate)

      const response = await this.apiService.get<ApiResponse<CashierPerformance[]>>(
        `${this.baseUrl}/cashier/performance?${queryParams.toString()}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch cashier performance'
      }
    }
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(params: {
    storeId: number
    startDate: string // ISO date format (YYYY-MM-DD)
    endDate: string // ISO date format (YYYY-MM-DD)
    sortBy?: 'quantity' | 'revenue'
    limit?: number
  }): Promise<ApiResponse<TopProductsResponse>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      queryParams.append('startDate', params.startDate)
      queryParams.append('endDate', params.endDate)
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy)
      }
      if (params.limit !== undefined) {
        queryParams.append('limit', params.limit.toString())
      }

      const response = await this.apiService.get<ApiResponse<TopProductsResponse>>(
        `${this.baseUrl}/products/top-selling?${queryParams.toString()}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch top selling products'
      }
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(params: {
    storeId: number
    threshold?: number
  }): Promise<ApiResponse<LowStockAlert[]>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      if (params.threshold !== undefined) {
        queryParams.append('threshold', params.threshold.toString())
      }

      const response = await this.apiService.get<ApiResponse<LowStockAlert[]>>(
        `${this.baseUrl}/products/low-stock?${queryParams.toString()}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch low stock alerts'
      }
    }
  }
}

export const analyticsApiService = new AnalyticsApiService()

