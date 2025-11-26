import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'
import type { Discount } from '../types'

export const useDiscountStore = defineStore('discount', () => {
    const discounts = ref<Discount[]>([])
    const isLoading = ref(false)

    const apiService = useApiService()
    const notificationStore = useNotificationStore()

    const fetchDiscounts = async (activeOnly: boolean = false) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/discounts', { params: { activeOnly } })
            if (response.data.success) {
                discounts.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to fetch discounts', error.response?.data?.message || 'Unknown error')
        } finally {
            isLoading.value = false
        }
    }

    const createDiscount = async (discount: Partial<Discount>) => {
        isLoading.value = true
        try {
            const response = await apiService.post('/discounts', discount)
            if (response.data.success) {
                discounts.value.push(response.data.data)
                notificationStore.success('Discount created', 'New discount created successfully')
            }
        } catch (error: any) {
            notificationStore.error('Failed to create discount', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateDiscount = async (id: number, discount: Partial<Discount>) => {
        isLoading.value = true
        try {
            const response = await apiService.put(`/discounts/${id}`, discount)
            if (response.data.success) {
                const index = discounts.value.findIndex(d => d.id === id)
                if (index !== -1) {
                    discounts.value[index] = response.data.data
                }
                notificationStore.success('Discount updated', 'Discount updated successfully')
            }
        } catch (error: any) {
            notificationStore.error('Failed to update discount', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deactivateDiscount = async (id: number) => {
        isLoading.value = true
        try {
            const response = await apiService.put(`/discounts/${id}/deactivate`)
            if (response.data.success) {
                const index = discounts.value.findIndex(d => d.id === id)
                if (index !== -1) {
                    discounts.value[index].isActive = false
                }
                notificationStore.success('Discount deactivated', 'Discount has been deactivated')
            }
        } catch (error: any) {
            notificationStore.error('Failed to deactivate discount', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        discounts,
        isLoading,
        fetchDiscounts,
        createDiscount,
        updateDiscount,
        deactivateDiscount
    }
})
