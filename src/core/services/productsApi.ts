import { useApiService } from './api'
import type { ApiResponse } from '@/core/types/api'
import type { Product } from '@/core/types/inventory'

class ProductsApiService {
  private readonly baseUrl = '/products'
  private apiService = useApiService()

  /**
   * Get all products with pagination, sorting, and filtering
   */
  async getAllProducts(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    search?: string
    category?: string
    supplier?: string
    active?: boolean
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page !== undefined) queryParams.append('page', params.page.toString())
      if (params?.size !== undefined) queryParams.append('size', params.size.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.supplier) queryParams.append('supplier', params.supplier)
      if (params?.active !== undefined) queryParams.append('active', params.active.toString())

      const url = queryParams.toString() 
        ? `${this.baseUrl}?${queryParams.toString()}` 
        : this.baseUrl
      
      const response = await this.apiService.get<any>(url)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch products'
      }
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await this.apiService.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch product'
      }
    }
  }

  /**
   * Get product by product code
   */
  async getProductByCode(productCode: string): Promise<ApiResponse<Product>> {
    try {
      const response = await this.apiService.get<ApiResponse<Product>>(`${this.baseUrl}/code/${encodeURIComponent(productCode)}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to fetch product'
      }
    }
  }

  /**
   * Search products by name, code, or barcode
   */
  async searchProducts(searchTerm: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.apiService.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/search?searchTerm=${encodeURIComponent(searchTerm)}`
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to search products'
      }
    }
  }

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    try {
      const response = await this.apiService.post<ApiResponse<Product>>(this.baseUrl, product)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to create product'
      }
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await this.apiService.put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, product)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Failed to update product'
      }
    }
  }

  /**
   * Delete a product (soft delete)
   */
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiService.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to delete product'
      }
    }
  }

  /**
   * Get all product categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(`${this.baseUrl}/categories`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch categories'
      }
    }
  }
}

export const productsApiService = new ProductsApiService()

