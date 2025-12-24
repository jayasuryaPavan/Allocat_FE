import { ApiService } from './api'
import type { ApiResponse } from '@/core/types/api'
import type { 
  Customer, 
  CreateCustomerRequest, 
  UpdateCustomerRequest,
  CustomerFilters 
} from '@/core/types/customer'

class CustomersApi extends ApiService {
  private readonly baseUrl = '/customers'

  /**
   * Get all customers with optional filters
   */
  async getAllCustomers(filters?: CustomerFilters): Promise<ApiResponse<Customer[]>> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.storeId) {
        params.append('storeId', filters.storeId.toString())
      }
      if (filters?.active !== undefined) {
        params.append('active', filters.active.toString())
      }
      if (filters?.search) {
        params.append('search', filters.search)
      }

      const url = params.toString() ? `${this.baseUrl}?${params.toString()}` : this.baseUrl
      const response = await this.get<Customer[]>(url)
      
      return {
        success: true,
        data: response.data || [],
        message: 'Customers retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.error || 'Failed to fetch customers'
      }
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: number): Promise<ApiResponse<Customer>> {
    try {
      const response = await this.get<Customer>(`${this.baseUrl}/${customerId}`)
      
      return {
        success: true,
        data: response.data,
        message: 'Customer retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.error || 'Failed to fetch customer'
      }
    }
  }

  /**
   * Get customer by code
   */
  async getCustomerByCode(customerCode: string): Promise<ApiResponse<Customer>> {
    try {
      const response = await this.get<Customer>(`${this.baseUrl}/code/${customerCode}`)
      
      return {
        success: true,
        data: response.data,
        message: 'Customer retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.error || 'Failed to fetch customer'
      }
    }
  }

  /**
   * Get customers by invoice number
   */
  async getCustomersByInvoice(
    invoiceNumber: string, 
    storeId?: number
  ): Promise<ApiResponse<Customer[]>> {
    try {
      const url = storeId 
        ? `${this.baseUrl}/invoice/${invoiceNumber}?storeId=${storeId}`
        : `${this.baseUrl}/invoice/${invoiceNumber}`
      
      const response = await this.get<Customer[]>(url)
      
      return {
        success: true,
        data: response.data || [],
        message: 'Customers retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.error || 'Failed to fetch customers'
      }
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    try {
      const response = await this.post<Customer>(this.baseUrl, data)
      
      return {
        success: true,
        data: response.data,
        message: 'Customer created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.error || 'Failed to create customer'
      }
    }
  }

  /**
   * Update existing customer
   */
  async updateCustomer(
    customerId: number, 
    data: UpdateCustomerRequest
  ): Promise<ApiResponse<Customer>> {
    try {
      const response = await this.put<Customer>(`${this.baseUrl}/${customerId}`, data)
      
      return {
        success: true,
        data: response.data,
        message: 'Customer updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.error || 'Failed to update customer'
      }
    }
  }

  /**
   * Delete customer (soft delete)
   */
  async deleteCustomer(customerId: number): Promise<ApiResponse<null>> {
    try {
      await this.delete(`${this.baseUrl}/${customerId}`)
      
      return {
        success: true,
        data: null,
        message: 'Customer deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || 'Failed to delete customer'
      }
    }
  }
}

export const CustomersApiService = new CustomersApi()



