import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'
import type { SalesOrder } from '../types'

export const useSalesStore = defineStore('sales', () => {
    const orders = ref<SalesOrder[]>([])
    const currentOrder = ref<SalesOrder | null>(null)
    const isLoading = ref(false)
    const totalOrders = ref(0)

    const apiService = useApiService()
    const notificationStore = useNotificationStore()

    const fetchOrders = async (params: any) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/sales', { params })
            if (response.data.success) {
                orders.value = response.data.data.content
                totalOrders.value = response.data.data.totalElements
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
            const response = await apiService.get(`/sales/${id}`)
            if (response.data.success) {
                currentOrder.value = response.data.data
                return response.data.data
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
            const response = await apiService.put(`/sales/${id}/cancel`, null, { params: { reason } })
            if (response.data.success) {
                notificationStore.success('Order cancelled', 'Order has been cancelled successfully')
                // Update local state if the order is in the list
                const index = orders.value.findIndex(o => o.id === id)
                if (index !== -1) {
                    orders.value[index] = response.data.data
                }
                if (currentOrder.value?.id === id) {
                    currentOrder.value = response.data.data
                }
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
