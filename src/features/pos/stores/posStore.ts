import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '@/core/services/api'
import { useNotificationStore } from '@/core/stores/notification'
import type { Cart } from '../types'

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
            if (response.data?.success) {
                currentCart.value = response.data.data
            } else {
                throw new Error(response.data?.message || 'Failed to create cart')
            }
        } catch (error: any) {
            console.error('Create cart error:', error)
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url,
                baseURL: error.config?.baseURL,
                fullURL: `${error.config?.baseURL}${error.config?.url}`
            })
            const errorMessage = error.response?.status === 404
                ? 'POS endpoint not found. Please ensure the backend is running on port 8080.'
                : error.response?.data?.message || error.message || 'Unknown error'
            notificationStore.error('Failed to create cart', errorMessage)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getCart = async (cartId: string) => {
        isLoading.value = true
        try {
            const response = await apiService.get(`/pos/cart/${cartId}`)
            if (response.data?.success) {
                currentCart.value = response.data.data
            } else {
                throw new Error(response.data?.message || 'Failed to load cart')
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
            if (response.data?.success) {
                currentCart.value = response.data.data
                notificationStore.success('Item added', 'Product added to cart')
            } else {
                throw new Error(response.data?.message || 'Failed to add item')
            }
        } catch (error: any) {
            notificationStore.error('Failed to add item', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const addCustomItem = async (cartId: string, item: {
        description: string,
        unitPrice: number,
        quantity: number,
        taxExempt: boolean
    }) => {
        isLoading.value = true
        try {
            // TODO: Add API call later - for now, add item locally
            // Add item locally to cart state
            if (currentCart.value) {
                const taxRate = item.taxExempt ? 0 : 0.13 // 13% HST default
                const subtotal = item.unitPrice * item.quantity
                const taxAmount = item.taxExempt ? 0 : (subtotal * taxRate)

                const newItem = {
                    itemId: `custom-${Date.now()}`,
                    productId: null,
                    productCode: 'CUSTOM',
                    productName: item.description,
                    barcode: null,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: subtotal,
                    taxAmount: taxAmount,
                    discountAmount: 0,
                    total: subtotal + taxAmount,
                    taxExempt: item.taxExempt
                }
                currentCart.value.items.push(newItem as any)

                // Recalculate cart totals
                const cartSubtotal = currentCart.value.items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0)
                const cartTaxAmount = currentCart.value.items.reduce((acc, i) => acc + i.taxAmount, 0)
                currentCart.value.subtotal = cartSubtotal
                currentCart.value.taxAmount = cartTaxAmount
                currentCart.value.total = cartSubtotal + cartTaxAmount - currentCart.value.discountAmount
            } else {
                throw new Error('No cart initialized')
            }
        } catch (error: any) {
            notificationStore.error('Failed to add item', error.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateItemQuantity = async (cartId: string, itemId: string, quantity: number) => {
        isLoading.value = true
        try {
            const response = await apiService.put(`/pos/cart/${cartId}/items/${itemId}`, { quantity })
            if (response.data?.success) {
                currentCart.value = response.data.data
            } else {
                throw new Error(response.data?.message || 'Failed to update item')
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
            if (response.data?.success) {
                currentCart.value = response.data.data
                notificationStore.info('Item removed', 'Product removed from cart')
            } else {
                throw new Error(response.data?.message || 'Failed to remove item')
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
            if (response.data?.success) {
                currentCart.value = response.data.data
                notificationStore.success('Discount applied', `Discount code ${code} applied`)
            } else {
                throw new Error(response.data?.message || 'Failed to apply discount')
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
            if (response.data?.success) {
                currentCart.value = response.data.data
                notificationStore.info('Discount removed', 'Discount removed from cart')
            } else {
                throw new Error(response.data?.message || 'Failed to remove discount')
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
            if (response.data?.success) {
                currentCart.value = null
                notificationStore.info('Cart cleared', 'All items removed from cart')
            } else {
                throw new Error(response.data?.message || 'Failed to clear cart')
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
            if (response.data?.success) {
                currentCart.value = null
                notificationStore.success('Checkout successful', 'Order completed successfully')
                return response.data.data // Returns the created SalesOrder
            } else {
                throw new Error(response.data?.message || 'Checkout failed')
            }
        } catch (error: any) {
            notificationStore.error('Checkout failed', error.response?.data?.message || 'Transaction failed')
            throw error
        } finally {
            isProcessingPayment.value = false
        }
    }

    const holdOrder = async (cartId: string, customerId?: number, notes?: string) => {
        isLoading.value = true
        try {
            const response = await apiService.post(`/pos/cart/${cartId}/hold`, { customerId, notes })
            if (response.data?.success) {
                currentCart.value = null
                notificationStore.success('Order Suspended', 'Order has been parked successfully')
            } else {
                throw new Error(response.data?.message || 'Failed to suspend order')
            }
        } catch (error: any) {
            notificationStore.error('Failed to suspend order', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getHeldOrders = async (storeId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.get('/pos/orders/held', { params: { storeId } })
            if (response.data?.success) {
                return response.data.data
            }
            return []
        } catch (error: any) {
            notificationStore.error('Failed to fetch held orders', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const resumeOrder = async (orderId: number) => {
        isLoading.value = true
        try {
            const response = await apiService.post(`/pos/orders/${orderId}/resume`)
            if (response.data?.success) {
                const order = response.data.data
                // We need to create a new cart and populate it

                // 1. Create Cart
                const storeId = order.store.id
                const cashierId = order.cashier.id
                const cartResp = await apiService.post('/pos/cart', { storeId, cashierId })
                if (!cartResp.data?.success) {
                    throw new Error(cartResp.data?.message || 'Failed to create cart for resumed order')
                }
                const newCartId = cartResp.data.data?.cartId
                if (!newCartId) {
                    throw new Error('Cart ID not found in response')
                }

                // 2. Add Items
                for (const item of order.items) {
                    await apiService.post(`/pos/cart/${newCartId}/items`, {
                        productId: item.product.id,
                        quantity: item.quantity
                    })
                }

                // 3. Update current cart
                const finalCartResp = await apiService.get(`/pos/cart/${newCartId}`)
                if (finalCartResp.data?.success) {
                    currentCart.value = finalCartResp.data.data
                } else {
                    throw new Error(finalCartResp.data?.message || 'Failed to retrieve cart after resuming order')
                }

                notificationStore.success('Order Resumed', 'Order retrieved successfully')
            } else {
                throw new Error(response.data?.message || 'Failed to resume order')
            }
        } catch (error: any) {
            notificationStore.error('Failed to resume order', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const processReturn = async (returnRequest: any) => {
        isLoading.value = true
        try {
            const response = await apiService.post('/pos/returns', returnRequest)
            if (response.data?.success) {
                notificationStore.success('Return Processed', 'Return has been processed successfully')
                return response.data.data
            } else {
                throw new Error(response.data?.message || 'Failed to process return')
            }
        } catch (error: any) {
            notificationStore.error('Failed to process return', error.response?.data?.message || 'Unknown error')
            throw error
        } finally {
            isLoading.value = false
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
        addCustomItem,
        updateItemQuantity,
        removeItem,
        applyDiscount,
        removeDiscount,
        clearCart,
        checkout,
        holdOrder,
        getHeldOrders,
        resumeOrder,
        processReturn
    }
})
