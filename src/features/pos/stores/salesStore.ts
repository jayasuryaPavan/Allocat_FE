import { defineStore } from 'pinia'
import { ref } from 'vue'
import { salesApiService } from '@/core/services/salesApi'
import { useNotificationStore } from '@/core/stores/notification'
import type { SalesOrder } from '../types'

export const useSalesStore = defineStore('sales', () => {
    const orders = ref<SalesOrder[]>([])
    const currentOrder = ref<SalesOrder | null>(null)
    const isLoading = ref(false)
    const totalOrders = ref(0)

    const notificationStore = useNotificationStore()

    const fetchOrders = async (params: {
        storeId: number
        startDate?: string
        endDate?: string
        page?: number
        size?: number
        sortBy?: string
        sortDirection?: 'asc' | 'desc'
    }) => {
        isLoading.value = true
        try {
            const response = await salesApiService.getSalesOrders(params)
            if (response.success && response.data) {
                // Handle paginated response
                if (response.data.content) {
                    orders.value = response.data.content
                    totalOrders.value = response.data.totalElements || 0
                } else if (Array.isArray(response.data)) {
                    // Handle non-paginated response
                    orders.value = response.data
                    totalOrders.value = response.data.length
                }
            } else {
                notificationStore.error('Failed to fetch orders', response.message || 'Unknown error')
            }
        } catch (error: any) {
            notificationStore.error('Failed to fetch orders', error.response?.data?.message || 'Unknown error')
        } finally {
            isLoading.value = false
        }
    }

    const getOrderById = async (id: number) => {
        isLoading.value = true
        try {
            const response = await salesApiService.getOrderById(id)
            if (response.success && response.data) {
                currentOrder.value = response.data
                return response.data
            } else {
                notificationStore.error('Failed to load order', response.message || 'Unknown error')
                throw new Error(response.message || 'Failed to load order')
            }
        } catch (error: any) {
            notificationStore.error('Failed to load order', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const cancelOrder = async (id: number, reason: string) => {
        isLoading.value = true
        try {
            const response = await salesApiService.cancelOrder(id, reason)
            if (response.success && response.data) {
                notificationStore.success('Order cancelled', 'Order has been cancelled successfully')
                // Update local state if the order is in the list
                const index = orders.value.findIndex(o => o.id === id)
                if (index !== -1) {
                    orders.value[index] = response.data
                }
                if (currentOrder.value?.id === id) {
                    currentOrder.value = response.data
                }
            } else {
                notificationStore.error('Failed to cancel order', response.message || 'Unknown error')
                throw new Error(response.message || 'Failed to cancel order')
            }
        } catch (error: any) {
            notificationStore.error('Failed to cancel order', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        orders,
        currentOrder,
        isLoading,
        totalOrders,
        fetchOrders,
        getOrderById,
        cancelOrder
    }
})
