import { ApiService } from './api'

const api = new ApiService()
import type { 
  Product, 
  Inventory, 
  ReceivedStock, 
  StockDiscrepancy, 
  InventoryStats,
  ReservationRequest,
  ReleaseReservationRequest
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
    const formData = new FormData()
    formData.append('verifiedQuantity', verifiedQuantity.toString())
    formData.append('verifiedBy', verifiedBy)
    
    const response = await api.post(`/inventory/received-stock/${receivedStockId}/verify`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  }

  // Inventory Management
  static async getCurrentInventory(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/current')
    return response.data
  }

  static async getInventoryByProduct(productId: number): Promise<ApiResponse<Inventory>> {
    const response = await api.get(`/inventory/product/${productId}`)
    return response.data
  }

  static async getLowStockItems(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/low-stock')
    return response.data
  }

  static async getOutOfStockItems(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/out-of-stock')
    return response.data
  }

  static async reserveInventory(reservation: ReservationRequest): Promise<ApiResponse<Inventory>> {
    const formData = new FormData()
    formData.append('productId', reservation.productId.toString())
    formData.append('quantity', reservation.quantity.toString())
    formData.append('reservedBy', reservation.reservedBy)
    if (reservation.notes) {
      formData.append('notes', reservation.notes)
    }
    
    const response = await api.post('/inventory/reserve', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  }

  static async releaseReservation(release: ReleaseReservationRequest): Promise<ApiResponse<Inventory>> {
    const formData = new FormData()
    formData.append('productId', release.productId.toString())
    formData.append('quantity', release.quantity.toString())
    formData.append('releasedBy', release.releasedBy)
    if (release.notes) {
      formData.append('notes', release.notes)
    }
    
    const response = await api.post('/inventory/release-reservation', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  }

  // Stock Discrepancies
  static async getStockDiscrepancies(): Promise<ApiResponse<StockDiscrepancy[]>> {
    const response = await api.get('/inventory/discrepancies')
    return response.data
  }

  // Product Management
  static async getAllProducts(params?: {
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
    
    const response = await api.get(`/products?${queryParams.toString()}`)
    return response.data
  }

  static async getProductById(id: number): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`)
    return response.data
  }

  static async getProductByCode(productCode: string): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/code/${productCode}`)
    return response.data
  }

  static async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', product)
    return response.data
  }

  static async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  }

  static async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }

  static async searchProducts(searchTerm: string): Promise<ApiResponse<Product[]>> {
    const response = await api.get(`/products/search?searchTerm=${encodeURIComponent(searchTerm)}`)
    return response.data
  }

  static async getCategories(): Promise<ApiResponse<string[]>> {
    const response = await api.get('/products/categories')
    return response.data
  }

  // Statistics and Analytics
  static async getInventoryStats(): Promise<ApiResponse<InventoryStats>> {
    const response = await api.get('/inventory/stats')
    return response.data
  }

  // Additional endpoints from API documentation
  static async getReceivedStockById(id: number): Promise<ApiResponse<ReceivedStock>> {
    const response = await api.get(`/inventory/received-stock/${id}`)
    return response.data
  }

  static async updateReceivedStock(id: number, data: Partial<ReceivedStock>): Promise<ApiResponse<ReceivedStock>> {
    const response = await api.put(`/inventory/received-stock/${id}`, data)
    return response.data
  }

  static async deleteReceivedStock(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/inventory/received-stock/${id}`)
    return response.data
  }

  // Utility methods
  static async exportInventoryToCSV(): Promise<Blob> {
    const response = await api.get('/inventory/export', {
      responseType: 'blob'
    })
    return response.data
  }

  static async importInventoryFromCSV(file: File): Promise<ApiResponse<{ imported: number; errors: number }>> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/inventory/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

