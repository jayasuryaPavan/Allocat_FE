import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'
import type { Cart, CheckoutRequest, SalesOrder } from '@/features/pos/types'

class PosApiService {
  private readonly baseUrl = '/pos'
  private apiService = useApiService()

  /**
   * Create a new cart
   */
  async createCart(storeId: number, cashierId: number): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.post<ApiResponse<Cart>>(`${this.baseUrl}/cart`, { storeId, cashierId })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to create cart'
      }
    }
  }

  /**
   * Get cart by ID
   */
  async getCart(cartId: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.get<ApiResponse<Cart>>(`${this.baseUrl}/cart/${cartId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch cart'
      }
    }
  }

  /**
   * Add item to cart
   */
  async addItemToCart(cartId: string, request: {
    productId?: number
    barcode?: string
    quantity: number
  }): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.post<ApiResponse<Cart>>(`${this.baseUrl}/cart/${cartId}/items`, request)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to add item to cart'
      }
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.put<ApiResponse<Cart>>(
        `${this.baseUrl}/cart/${cartId}/items/${itemId}`,
        { quantity }
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to update cart item'
      }
    }
  }

  /**
   * Remove item from cart
   */
  async removeItemFromCart(cartId: string, itemId: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.delete<ApiResponse<Cart>>(`${this.baseUrl}/cart/${cartId}/items/${itemId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to remove item from cart'
      }
    }
  }

  /**
   * Apply discount to cart
   */
  async applyDiscount(cartId: string, code: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.post<ApiResponse<Cart>>(
        `${this.baseUrl}/cart/${cartId}/discount?code=${encodeURIComponent(code)}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to apply discount'
      }
    }
  }

  /**
   * Remove discount from cart
   */
  async removeDiscount(cartId: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await this.apiService.delete<ApiResponse<Cart>>(`${this.baseUrl}/cart/${cartId}/discount`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to remove discount'
      }
    }
  }

  /**
   * Clear cart (remove all items)
   */
  async clearCart(cartId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiService.delete<ApiResponse<void>>(`${this.baseUrl}/cart/${cartId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to clear cart'
      }
    }
  }

  /**
   * Checkout cart
   */
  async checkout(cartId: string, checkoutRequest: CheckoutRequest): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.post<ApiResponse<SalesOrder>>(
        `${this.baseUrl}/cart/${cartId}/checkout`,
        checkoutRequest
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Checkout failed'
      }
    }
  }

  /**
   * Hold/Park order
   */
  async holdOrder(cartId: string, request?: {
    customerId?: number
    notes?: string
  }): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.post<ApiResponse<SalesOrder>>(
        `${this.baseUrl}/cart/${cartId}/hold`,
        request || {}
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to hold order'
      }
    }
  }

  /**
   * Get held orders for a store
   */
  async getHeldOrders(storeId: number): Promise<ApiResponse<SalesOrder[]>> {
    try {
      const response = await this.apiService.get<ApiResponse<SalesOrder[]>>(
        `${this.baseUrl}/orders/held?storeId=${storeId}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch held orders'
      }
    }
  }

  /**
   * Resume a held order
   */
  async resumeOrder(orderId: number): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/orders/${orderId}/resume`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to resume order'
      }
    }
  }

  /**
   * Search order by order number
   */
  async searchOrder(query: string): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.get<ApiResponse<SalesOrder>>(
        `${this.baseUrl}/orders/search?query=${encodeURIComponent(query)}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Order not found'
      }
    }
  }

  /**
   * Process return
   */
  async processReturn(returnRequest: {
    originalOrderId: number
    items: Array<{
      orderItemId: number
      quantity: number
      reason?: string
    }>
    notes?: string
  }): Promise<ApiResponse<SalesOrder>> {
    try {
      const response = await this.apiService.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/returns`, returnRequest)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to process return'
      }
    }
  }
}

export const posApiService = new PosApiService()

