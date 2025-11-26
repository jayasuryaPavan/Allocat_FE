import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'
import type { Cart, CartItem, Discount } from '../types'

export const usePosStore = defineStore('pos', () => {
    // State
    const currentCart = ref<Cart | null>(null)
    const isLoading = ref(false)
    const isProcessingPayment = ref(false)

    // Services
    const apiService = useApiService()
    const notificationStore = useNotificationStore()

    // Getters
    const cartTotal = computed(() => currentCart.value?.total || 0)
    const cartItemCount = computed(() => currentCart.value?.items.reduce((acc, item) => acc + item.quantity, 0) || 0)
    const hasItems = computed(() => (currentCart.value?.items.length || 0) > 0)

    // Actions
    const createCart = async (storeId: number, cashierId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.post('/pos/cart', { storeId, cashierId })
            if (response.data.success) {
                currentCart.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to create cart', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getCart = async (cartId: string) => {
        isLoading.value = true
        try {
            const response = await apiService.get(`/pos/cart/${cartId}`)
            if (response.data.success) {
                currentCart.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to load cart', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const addItem = async (cartId: string, productId?: number, barcode?: string, quantity: number = 1) => {
        isLoading.value = true
        try {
            const payload = { productId, barcode, quantity }
            const response = await apiService.post(`/pos/cart/${cartId}/items`, payload)
            if (response.data.success) {
                currentCart.value = response.data.data
                notificationStore.success('Item added', 'Product added to cart')
            }
        } catch (error: any) {
            notificationStore.error('Failed to add item', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateItemQuantity = async (cartId: string, itemId: string, quantity: number) => {
        isLoading.value = true
        try {
            const response = await apiService.put(`/pos/cart/${cartId}/items/${itemId}`, { quantity })
            if (response.data.success) {
                currentCart.value = response.data.data
            }
        } catch (error: any) {
            notificationStore.error('Failed to update item', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const removeItem = async (cartId: string, itemId: string) => {
        isLoading.value = true
        try {
            const response = await apiService.delete(`/pos/cart/${cartId}/items/${itemId}`)
            if (response.data.success) {
                currentCart.value = response.data.data
                notificationStore.info('Item removed', 'Product removed from cart')
            }
        } catch (error: any) {
            notificationStore.error('Failed to remove item', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const applyDiscount = async (cartId: string, code: string) => {
        isLoading.value = true
        try {
            const response = await apiService.post(`/pos/cart/${cartId}/discount?code=${code}`)
            if (response.data.success) {
                currentCart.value = response.data.data
                notificationStore.success('Discount applied', `Discount code ${code} applied`)
            }
        } catch (error: any) {
            notificationStore.error('Failed to apply discount', error.response?.data?.message || 'Invalid discount code')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const removeDiscount = async (cartId: string) => {
        isLoading.value = true
        try {
            const response = await apiService.delete(`/pos/cart/${cartId}/discount`)
            if (response.data.success) {
                currentCart.value = response.data.data
                notificationStore.info('Discount removed', 'Discount removed from cart')
            }
        } catch (error: any) {
            notificationStore.error('Failed to remove discount', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const clearCart = async (cartId: string) => {
        isLoading.value = true
        try {
            const response = await apiService.delete(`/pos/cart/${cartId}`)
            if (response.data.success) {
                currentCart.value = null
                notificationStore.info('Cart cleared', 'All items removed from cart')
            }
        } catch (error: any) {
            notificationStore.error('Failed to clear cart', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const checkout = async (checkoutData: any) => {
        isProcessingPayment.value = true
        try {
            const response = await apiService.post(`/pos/cart/${checkoutData.cartId}/checkout`, checkoutData)
            if (response.data.success) {
                currentCart.value = null
                notificationStore.success('Checkout successful', 'Order completed successfully')
                return response.data.data // Returns the created SalesOrder
            }
        } catch (error: any) {
            notificationStore.error('Checkout failed', error.response?.data?.message || 'Transaction failed')
            throw error
        } finally {
            isProcessingPayment.value = false
        }
    }

    return {
        currentCart,
        isLoading,
        isProcessingPayment,
        cartTotal,
        cartItemCount,
        hasItems,
        createCart,
        getCart,
        addItem,
        updateItemQuantity,
        removeItem,
        applyDiscount,
        removeDiscount,
        clearCart,
        checkout
    }
})
