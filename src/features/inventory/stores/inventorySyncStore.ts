import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'

export interface StoreInventory {
    storeId: number
    storeName: string
    quantity: number
    available: number
}

export const useInventorySyncStore = defineStore('inventorySync', () => {
    const apiService = useApiService()
    const notificationStore = useNotificationStore()

    const isLoading = ref(false)
    const multiStoreInventory = ref<Map<number, StoreInventory[]>>(new Map())
    const pollingInterval = ref<number | null>(null)

    /**
     * Get inventory across all stores for a product
     */
    const getMultiStoreInventory = async (productId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.get(`/inventory/product/${productId}/stores`)
            if (response.data.success) {
                multiStoreInventory.value.set(productId, response.data.data)
                return response.data.data
            }
            return []
        } catch (error: any) {
            notificationStore.error('Failed to load multi-store inventory', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Request stock transfer between stores
     */
    const requestStockTransfer = async (productId: number, fromStoreId: number, toStoreId: number, quantity: number) => {
        isLoading.value = true
        try {
            const response = await apiService.post('/inventory/transfer', {
                productId,
                fromStoreId,
                toStoreId,
                quantity
            })
            if (response.data.success) {
                notificationStore.success('Transfer Requested', 'Stock transfer has been requested')
                return response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Transfer Failed', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Start polling for inventory updates
     */
    const startPolling = (productIds: number[], intervalMs: number = 30000) => {
        stopPolling()

        pollingInterval.value = window.setInterval(async () => {
            for (const productId of productIds) {
                try {
                    await getMultiStoreInventory(productId)
                } catch (error) {
                    console.error(`Failed to poll inventory for product ${productId}:`, error)
                }
            }
        }, intervalMs)
    }

    /**
     * Stop polling
     */
    const stopPolling = () => {
        if (pollingInterval.value) {
            clearInterval(pollingInterval.value)
            pollingInterval.value = null
        }
    }

    return {
        isLoading,
        multiStoreInventory,
        getMultiStoreInventory,
        requestStockTransfer,
        startPolling,
        stopPolling
    }
})
