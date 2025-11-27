/**
 * POS Store Tests
 * Example test for Pinia stores
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePosStore } from '@/features/pos/stores/posStore'
import { mockApiService, mockNotificationStore } from '../../utils/mocks'

// Mock dependencies
vi.mock('@/core/services/api', () => ({
  useApiService: () => mockApiService
}))

vi.mock('@/core/stores/notification', () => ({
  useNotificationStore: () => mockNotificationStore
}))

describe('POS Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('createCart', () => {
    it('should create a cart successfully', async () => {
      const mockCart = {
        cartId: 'cart-123',
        storeId: 1,
        cashierId: 1,
        items: [],
        subtotal: 0,
        total: 0
      }

      mockApiService.post.mockResolvedValue({
        data: {
          success: true,
          data: mockCart
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      })

      const posStore = usePosStore()
      await posStore.createCart(1, 1)

      expect(mockApiService.post).toHaveBeenCalledWith('/pos/cart', {
        storeId: 1,
        cashierId: 1
      })
      expect(posStore.currentCart).toEqual(mockCart)
    })

    it('should handle cart creation errors', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Server error' }
        }
      }

      mockApiService.post.mockRejectedValue(mockError)

      const posStore = usePosStore()
      
      await expect(posStore.createCart(1, 1)).rejects.toEqual(mockError)
      expect(mockNotificationStore.error).toHaveBeenCalled()
    })
  })

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const mockCart = {
        cartId: 'cart-123',
        items: [
          {
            id: 'item-1',
            product: { id: 1, name: 'Product 1' },
            quantity: 1,
            unitPrice: 10
          }
        ],
        total: 10
      }

      mockApiService.post.mockResolvedValue({
        data: {
          success: true,
          data: mockCart
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const posStore = usePosStore()
      posStore.currentCart = {
        cartId: 'cart-123',
        items: [],
        total: 0
      } as any

      await posStore.addItem('cart-123', 1, undefined, 1)

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/pos/cart/cart-123/items',
        { productId: 1, barcode: undefined, quantity: 1 }
      )
      expect(posStore.currentCart).toEqual(mockCart)
      expect(mockNotificationStore.success).toHaveBeenCalled()
    })
  })

  describe('computed properties', () => {
    it('should calculate cartTotal correctly', () => {
      const posStore = usePosStore()
      posStore.currentCart = {
        cartId: 'cart-123',
        total: 150.50
      } as any

      expect(posStore.cartTotal).toBe(150.50)
    })

    it('should calculate cartItemCount correctly', () => {
      const posStore = usePosStore()
      posStore.currentCart = {
        cartId: 'cart-123',
        items: [
          { id: '1', quantity: 2 },
          { id: '2', quantity: 3 }
        ]
      } as any

      expect(posStore.cartItemCount).toBe(5)
    })

    it('should return hasItems correctly', () => {
      const posStore = usePosStore()
      
      posStore.currentCart = {
        cartId: 'cart-123',
        items: []
      } as any
      expect(posStore.hasItems).toBe(false)

      posStore.currentCart = {
        cartId: 'cart-123',
        items: [{ id: '1', quantity: 1 }]
      } as any
      expect(posStore.hasItems).toBe(true)
    })
  })
})

