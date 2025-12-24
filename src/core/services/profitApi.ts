import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'

export interface ProfitSummary {
  totalRevenue: number
  totalCost: number
  netProfit: number
  profitMargin: number
  orders: number
  itemsSold: number
}

export interface ProfitProductRow {
  rank?: number
  productId?: number
  productName: string
  sku: string
  netProfit: number
  profitMargin: number
  quantity: number
}

export interface ProfitCategoryRow {
  categoryName: string
  quantity: number
  revenue: number
  cost: number
  netProfit: number
  profitMargin: number
  percentOfTotal: number
}

export interface ProfitTrendRow {
  date: string
  revenue: number
  cost: number
  netProfit: number
  profitMargin: number
  orders: number
  items: number
}

export interface ProfitabilityResponse {
  summary: ProfitSummary
  topProfitableProducts: ProfitProductRow[]
  leastProfitableProducts: ProfitProductRow[]
  categoryProfit: ProfitCategoryRow[]
  dailyProfitTrend: ProfitTrendRow[]
}

class ProfitApiService {
  private readonly baseUrl = '/profitability'
  private apiService = useApiService()

  async getProfitability(params: {
    storeId: number
    startDate: string
    endDate: string
  }): Promise<ApiResponse<ProfitabilityResponse>> {
    try {
      const response = await this.apiService.get<ApiResponse<ProfitabilityResponse>>(this.baseUrl, {
        params
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch profitability data'
      }
    }
  }
}

export const profitApiService = new ProfitApiService()





