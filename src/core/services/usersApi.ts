import { ApiService } from './api'
import type { ApiResponse } from '../types/api'
import type { User } from '../types/user'

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  roleName?: string
  storeCode: string
  storeId?: number // deprecated - use storeCode instead
}

const api = new ApiService()

export interface Role {
  id: number
  name: string
  description?: string
  permissions?: string[]
}

export class UsersApiService {
  /**
   * Get all users (SUPER_ADMIN or ADMIN)
   * ADMIN users only see users from their store
   */
  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await api.get('/users')
    return response.data
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await api.post('/users', data)
    return response.data
  }

  /**
   * Get all available roles
   */
  static async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const response = await api.get('/users/roles')
    return response.data
  }
}


