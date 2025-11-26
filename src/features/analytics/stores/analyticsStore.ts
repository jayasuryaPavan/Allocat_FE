import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'

export interface SalesSummary {
    date: string
    totalSales: number
    transactionCount: number
    averageTicket: number
    taxCollected: number
    discountsGiven: number
}

export interface TrendData {
    period: string
    sales: number
    transactions: number
}

export interface SalesTrendResponse {
    trends: TrendData[]
    periodType: string
}

export interface CashierPerformance {
    cashierId: number
    cashierName: string
    transactionCount: number
    totalSales: number
    averageTicket: number
    averageTransactionTime: number
}

export interface ProductAnalytics {
    productId: number
    productName: string
    sku: string
    quantitySold: number
    revenue: number
    transactionCount: number
}

export interface TopProductsResponse {
    products: ProductAnalytics[]
    sortBy: string
    limit: number
}

export interface LowStockAlert {
    productId: number
    productName: string
    sku: string
    currentStock: number
    reorderLevel: number
    storeName: string
}

export const useAnalyticsStore = defineStore('analytics', () => {
    const apiService = useApiService()
    const notificationStore = useNotificationStore()

    const isLoading = ref(false)
    const salesSummary = ref<SalesSummary | null>(null)
    const salesTrends = ref<SalesTrendResponse | null>(null)
    const cashierPerformance = ref<CashierPerformance[]>([])
    const topProducts = ref<TopProductsResponse | null>(null)
    const lowStockAlerts = ref<LowStockAlert[]>([])

    const getSalesSummary = async (startDate: string, endDate: string, storeId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/analytics/sales/summary', {
                params: { startDate, endDate, storeId }
            })
            if (response.data.success) {
                salesSummary.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load sales summary', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getSalesTrends = async (startDate: string, endDate: string, storeId: number, periodType: string = 'daily') => {
        isLoading.value = true
        try {
            const response = await apiService.get('/analytics/sales/trends', {
                params: { startDate, endDate, storeId, periodType }
            })
            if (response.data.success) {
                salesTrends.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load sales trends', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getCashierPerformance = async (startDate: string, endDate: string, storeId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/analytics/cashier/performance', {
                params: { startDate, endDate, storeId }
            })
            if (response.data.success) {
                cashierPerformance.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load cashier performance', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getTopSellingProducts = async (startDate: string, endDate: string, storeId: number, sortBy: string = 'quantity', limit: number = 10) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/analytics/products/top-selling', {
                params: { startDate, endDate, storeId, sortBy, limit }
            })
            if (response.data.success) {
                topProducts.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load top products', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getLowStockAlerts = async (storeId: number, threshold: number = 10) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/analytics/products/low-stock', {
                params: { storeId, threshold }
            })
            if (response.data.success) {
                lowStockAlerts.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load low stock alerts', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        salesSummary,
        salesTrends,
        cashierPerformance,
        topProducts,
        lowStockAlerts,
        getSalesSummary,
        getSalesTrends,
        getCashierPerformance,
        getTopSellingProducts,
        getLowStockAlerts
    }
})
