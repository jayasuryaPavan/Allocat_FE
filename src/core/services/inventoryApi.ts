import { ApiService } from './api'

const api = new ApiService()
import type { 
  Inventory, 
  ReceivedStock, 
  StockDiscrepancy, 
  InventoryStats
} from '../types/inventory'
import type { ApiResponse } from '../types/api'

export class InventoryApiService {
  // JSON Upload and Processing (New API)
  static async uploadReceivedStockJson(data: any[]): Promise<ApiResponse<ReceivedStock[]>> {
    const response = await api.post('/inventory/received-stock', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  }

  // Legacy CSV Upload (for backward compatibility)
  static async uploadCSV(file: File): Promise<ApiResponse<ReceivedStock[]>> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/inventory/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  // Received Stock Management
  static async getPendingReceivedStock(): Promise<ApiResponse<ReceivedStock[]>> {
    const response = await api.get('/inventory/received-stock/pending')
    return response.data
  }

  static async getAllReceivedStock(): Promise<ApiResponse<ReceivedStock[]>> {
    const response = await api.get('/inventory/received-stock')
    return response.data
  }

  static async verifyReceivedStock(
    receivedStockId: number, 
    verifiedQuantity: number, 
    verifiedBy: string
  ): Promise<ApiResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    queryParams.append('verifiedQuantity', verifiedQuantity.toString())
    queryParams.append('verifiedBy', verifiedBy)
    
    const response = await api.post(`/inventory/received-stock/${receivedStockId}/verify?${queryParams.toString()}`)
    return response.data
  }

  // Inventory Management
  static async getCurrentInventory(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.size !== undefined) queryParams.append('size', params.size.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)
    
    const url = queryParams.toString() 
      ? `/inventory/current?${queryParams.toString()}` 
      : '/inventory/current'
    const response = await api.get(url)
    return response.data
  }

  static async getInventoryByProduct(productId: number): Promise<ApiResponse<Inventory>> {
    const response = await api.get(`/inventory/product/${productId}`)
    return response.data
  }

  static async getLowStockItems(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.size !== undefined) queryParams.append('size', params.size.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)
    
    const url = queryParams.toString() 
      ? `/inventory/low-stock?${queryParams.toString()}` 
      : '/inventory/low-stock'
    const response = await api.get(url)
    return response.data
  }

  static async getOutOfStockItems(params?: {
    page?: number
    size?: number
    search?: string
    category?: string
    supplier?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.size !== undefined) queryParams.append('size', params.size.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.supplier) queryParams.append('supplier', params.supplier)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)
    
    const url = queryParams.toString() 
      ? `/inventory/out-of-stock?${queryParams.toString()}` 
      : '/inventory/out-of-stock'
    const response = await api.get(url)
    return response.data
  }

  static async reserveInventory(
    productId: number,
    quantity: number,
    reservedBy: string
  ): Promise<ApiResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    queryParams.append('productId', productId.toString())
    queryParams.append('quantity', quantity.toString())
    queryParams.append('reservedBy', reservedBy)
    
    const response = await api.post(`/inventory/reserve?${queryParams.toString()}`)
    return response.data
  }

  static async releaseReservation(
    productId: number,
    quantity: number,
    releasedBy: string
  ): Promise<ApiResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    queryParams.append('productId', productId.toString())
    queryParams.append('quantity', quantity.toString())
    queryParams.append('releasedBy', releasedBy)
    
    const response = await api.post(`/inventory/release-reservation?${queryParams.toString()}`)
    return response.data
  }

  // Stock Discrepancies
  static async getStockDiscrepancies(): Promise<ApiResponse<StockDiscrepancy[]>> {
    const response = await api.get('/inventory/discrepancies')
    return response.data
  }

  // Note: Product management methods have been moved to productsApi.ts
  // Import and use productsApiService instead

  // Note: Additional utility methods can be added here as needed
  // The backend doesn't currently have these endpoints, but they can be added when implemented
}

