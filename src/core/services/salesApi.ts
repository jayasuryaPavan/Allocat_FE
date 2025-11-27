import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'
import type { SalesOrder } from '@/features/pos/types'

class SalesApiService {
  private readonly baseUrl = '/sales'
  private apiService = useApiService()

  /**
   * Get sales orders with pagination and filtering
   */
  async getSalesOrders(params: {
    storeId: number
    startDate?: string
    endDate?: string
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection)

      const response = await this.apiService.get<any>(`${this.baseUrl}?${queryParams.toString()}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch sales orders'
      }
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: number): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.get<ApiResponse<SalesOrder>>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch order'
      }
    }
  }

  /**
   * Get order by order number
   */
  async getOrderByOrderNo(orderNo: string): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.get<ApiResponse<SalesOrder>>(`${this.baseUrl}/order-no/${encodeURIComponent(orderNo)}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch order'
      }
    }
  }

  /**
   * Get all orders for a specific customer
   */
  async getCustomerOrders(customerId: number): Promise<ApiResponse<SalesOrder[]>> {
    try {
      const response = await this.apiService.get<ApiResponse<SalesOrder[]>>(`${this.baseUrl}/customer/${customerId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch customer orders'
      }
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(id: number, reason: string): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.put<ApiResponse<SalesOrder>>(
        `${this.baseUrl}/${id}/cancel?reason=${encodeURIComponent(reason)}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to cancel order'
      }
    }
  }

  /**
   * Get sales metrics for a store and date range
   */
  async getSalesMetrics(params: {
    storeId: number
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalSales: number
    orderCount: number
    averageOrderValue: number
    startDate: string
    endDate: string
  }>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('storeId', params.storeId.toString())
      queryParams.append('startDate', params.startDate)
      queryParams.append('endDate', params.endDate)

      const response = await this.apiService.get<any>(`${this.baseUrl}/metrics?${queryParams.toString()}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch sales metrics'
      }
    }
  }
}

export const salesApiService = new SalesApiService()

